import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useIntervalFn } from '@vueuse/core'
import type { PlayerState, Quest, ActiveQuest, Rarity, Rank, Notification } from '../types'
import {
  AVAILABLE_QUESTS,
  RARITY_CONFIG,
  RARITIES,
  RANK_CONFIG,
  SHOP_ITEMS,
  BOARD_SIZE,
  REFRESH_COST,
} from '../constants'

function randFrom<T>(arr: T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)]
  if (item === undefined) throw new Error('Empty array')
  return item
}

function generateUid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function calcRankFromExp(exp: number): Rank {
  let rank: Rank = 'F'
  for (const cfg of RANK_CONFIG) {
    if (exp >= cfg.minExp) {
      rank = cfg.label
    }
  }
  return rank
}

function rollRarity(): Rarity {
  const total = RARITIES.reduce((sum, r) => sum + RARITY_CONFIG[r].weight, 0)
  let roll = Math.random() * total
  for (const rarity of RARITIES) {
    roll -= RARITY_CONFIG[rarity].weight
    if (roll <= 0) return rarity
  }
  return 'white'
}

function buildQuest(rarity: Rarity, isBoss = false): Quest {
  const template = randFrom(AVAILABLE_QUESTS)
  const cfg = RARITY_CONFIG[rarity]
  const expMult = isBoss ? cfg.expMult * 1.5 : cfg.expMult
  const timeMult = isBoss ? Math.min(cfg.timeMult * 0.4, 0.5) : cfg.timeMult
  return {
    uid: generateUid(),
    templateId: template.id,
    name: isBoss ? `[BOSS] ${template.name}` : template.name,
    description: template.description,
    category: template.category,
    icon: template.icon,
    rarity,
    exp: Math.round(template.baseExp * expMult),
    gold: Math.round(template.baseGold * cfg.goldMult),
    durationMinutes: Math.max(1, Math.round(template.baseDurationMinutes * timeMult)),
    hpRestore: Math.round(template.baseHpRestore * cfg.hpRestoreMult),
  }
}

const defaultPlayer: PlayerState = {
  hp: 100,
  maxHp: 100,
  exp: 0,
  gold: 30,
  rank: 'F',
  completedCount: 0,
  expBoostCharges: 0,
}

export function useGameState() {
  const player = useLocalStorage<PlayerState>('bounty-board-player', { ...defaultPlayer })
  const boardQuests = useLocalStorage<Quest[]>('bounty-board-quests', [])
  const activeQuests = useLocalStorage<ActiveQuest[]>('bounty-board-active', [])
  const bossActive = useLocalStorage<boolean>('bounty-board-boss', false)
  const bossQuest = useLocalStorage<ActiveQuest | null>('bounty-board-boss-quest', null)

  const notifications = ref<Notification[]>([])

  function pushNotif(type: Notification['type'], message: string) {
    const id = generateUid()
    notifications.value.push({ id, type, message })
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    }, 3500)
  }

  // ── Board ────────────────────────────────────────────────────────────────

  function fillBoard() {
    const quests: Quest[] = []
    for (let i = 0; i < BOARD_SIZE; i++) {
      quests.push(buildQuest(rollRarity()))
    }
    boardQuests.value = quests
  }

  if (boardQuests.value.length === 0) {
    fillBoard()
  }

  function refreshBoard(force = false) {
    if (!force) {
      if (player.value.gold < REFRESH_COST) {
        pushNotif('warning', `Không đủ Vàng! Cần ${REFRESH_COST} Gold để làm mới bảng.`)
        return
      }
      player.value.gold -= REFRESH_COST
    }
    fillBoard()
    pushNotif('success', '🎲 Bảng cáo thị đã được làm mới!')
  }

  function acceptQuest(uid: string) {
    if (bossActive.value) return
    const idx = boardQuests.value.findIndex((q) => q.uid === uid)
    if (idx === -1) return
    const quest = boardQuests.value[idx]
    if (!quest) return

    const now = Date.now()
    const active: ActiveQuest = {
      ...quest,
      acceptedAt: now,
      endTime: now + quest.durationMinutes * 60 * 1000,
      isBoss: false,
    }
    activeQuests.value.push(active)
    boardQuests.value.splice(idx, 1)
    boardQuests.value.push(buildQuest(rollRarity()))
    pushNotif('success', `⚔️ Đã chấp nhận: ${quest.name}`)
  }

  function randomAccept() {
    if (bossActive.value) return
    if (boardQuests.value.length === 0) return
    const quest = randFrom(boardQuests.value)
    acceptQuest(quest.uid)
  }

  // ── Quest Completion ──────────────────────────────────────────────────────

  function applyExpGain(base: number) {
    let gain = base
    if (player.value.expBoostCharges > 0) {
      gain = base * 2
      player.value.expBoostCharges = Math.max(0, player.value.expBoostCharges - 1)
      pushNotif('success', `✨ EXP x2 kích hoạt! Còn ${player.value.expBoostCharges} lần.`)
    }
    player.value.exp += gain
    return gain
  }

  function checkRankUp() {
    const newRank = calcRankFromExp(player.value.exp)
    if (newRank !== player.value.rank) {
      player.value.rank = newRank
      const cfg = RANK_CONFIG.find((r) => r.label === newRank)
      pushNotif('levelup', `🎉 THĂNG HẠNG! Bạn đã đạt Rank ${newRank} — ${cfg?.title ?? ''}!`)
    }
  }

  function completeQuest(uid: string) {
    const idx = activeQuests.value.findIndex((q) => q.uid === uid)
    if (idx === -1) return
    const quest = activeQuests.value[idx]
    if (!quest) return

    const gained = applyExpGain(quest.exp)
    player.value.gold += quest.gold
    player.value.hp = Math.min(player.value.maxHp, player.value.hp + quest.hpRestore)
    player.value.completedCount++

    activeQuests.value.splice(idx, 1)
    checkRankUp()
    pushNotif(
      'success',
      `✅ Hoàn thành! +${gained} EXP, +${quest.gold} Gold, +${quest.hpRestore} HP`,
    )

    if (player.value.completedCount % 3 === 0 && !bossActive.value) {
      triggerBoss()
    }
  }

  function failQuest(uid: string) {
    const idx = activeQuests.value.findIndex((q) => q.uid === uid)
    if (idx === -1) return
    const quest = activeQuests.value[idx]
    if (!quest) return

    const hpLoss = Math.round(player.value.maxHp * 0.1)
    const expLoss = Math.min(player.value.exp, 5)
    player.value.hp = Math.max(0, player.value.hp - hpLoss)
    player.value.exp = Math.max(0, player.value.exp - expLoss)
    player.value.rank = calcRankFromExp(player.value.exp)
    activeQuests.value.splice(idx, 1)
    pushNotif('fail', `💀 Thất bại: ${quest.name} — -${hpLoss} HP, -${expLoss} EXP`)
  }

  function skipQuest(uid: string) {
    const idx = activeQuests.value.findIndex((q) => q.uid === uid)
    if (idx === -1) return
    const quest = activeQuests.value[idx]
    if (!quest) return

    const hpLoss = Math.round(player.value.maxHp * 0.1)
    const goldLoss = Math.min(player.value.gold, 5)
    const expLoss = Math.min(player.value.exp, 5)
    player.value.hp = Math.max(0, player.value.hp - hpLoss)
    player.value.gold = Math.max(0, player.value.gold - goldLoss)
    player.value.exp = Math.max(0, player.value.exp - expLoss)
    player.value.rank = calcRankFromExp(player.value.exp)
    activeQuests.value.splice(idx, 1)
    pushNotif(
      'warning',
      `⏭️ Bỏ qua: ${quest.name} — -${hpLoss} HP, -${goldLoss} Gold, -${expLoss} EXP`,
    )
  }

  // ── Boss System ───────────────────────────────────────────────────────────

  function triggerBoss() {
    const bossRarity: Rarity = Math.random() < 0.3 ? 'gold' : 'purple'
    const quest = buildQuest(bossRarity, true)
    const now = Date.now()
    const boss: ActiveQuest = {
      ...quest,
      acceptedAt: now,
      endTime: now + quest.durationMinutes * 60 * 1000,
      isBoss: true,
    }
    bossQuest.value = boss
    bossActive.value = true
  }

  function completeBoss() {
    if (!bossQuest.value) return
    const q = bossQuest.value
    const gained = applyExpGain(q.exp * 3)
    player.value.gold += q.gold * 2
    player.value.hp = Math.min(player.value.maxHp, player.value.hp + q.hpRestore * 2)
    bossActive.value = false
    bossQuest.value = null
    checkRankUp()
    pushNotif('boss', `🏆 BOSS BẠI! +${gained} EXP (x3), +${q.gold * 2} Gold!`)
  }

  function failBoss() {
    if (!bossQuest.value) return
    const hpLoss = Math.round(player.value.maxHp * 0.5)
    player.value.hp = Math.max(0, player.value.hp - hpLoss)
    player.value.rank = calcRankFromExp(player.value.exp)
    bossActive.value = false
    bossQuest.value = null
    pushNotif('fail', `💥 Boss đánh bại bạn! -${hpLoss} HP (50% máu tối đa)`)
  }

  // ── Shop ──────────────────────────────────────────────────────────────────

  function buyItem(itemId: string) {
    const item = SHOP_ITEMS.find((i) => i.id === itemId)
    if (!item) return
    if (player.value.gold < item.price) {
      pushNotif('warning', `Không đủ Vàng! Cần ${item.price} Gold.`)
      return
    }
    player.value.gold -= item.price

    if (item.effect === 'hp_potion') {
      const healed = Math.min(30, player.value.maxHp - player.value.hp)
      player.value.hp += healed
      pushNotif('success', `🧪 Đã dùng ${item.name}! +${healed} HP`)
    } else if (item.effect === 'exp_scroll') {
      player.value.expBoostCharges += 3
      pushNotif('success', `📜 Đã dùng ${item.name}! EXP x2 cho 3 nhiệm vụ tới!`)
    } else if (item.effect === 'dragon_heart') {
      player.value.maxHp += 20
      player.value.hp = player.value.maxHp
      pushNotif('success', `💎 Đã dùng ${item.name}! Máu Tối Đa +20, hồi đầy!`)
    }
  }

  // ── Auto-fail expired quests ──────────────────────────────────────────────

  function checkExpired() {
    const now = Date.now()
    const expired = activeQuests.value.filter((q) => now >= q.endTime)
    for (const q of expired) {
      failQuest(q.uid)
    }
    if (bossQuest.value && now >= bossQuest.value.endTime && bossActive.value) {
      failBoss()
    }
  }

  useIntervalFn(checkExpired, 5000)

  // ── Computed ──────────────────────────────────────────────────────────────

  const currentRankConfig = computed(() => RANK_CONFIG.find((r) => r.label === player.value.rank))

  const expProgress = computed(() => {
    const cfg = currentRankConfig.value
    if (!cfg || cfg.nextExp === null) return 100
    const rangeSize = cfg.nextExp - cfg.minExp
    const inRange = player.value.exp - cfg.minExp
    return Math.min(100, Math.round((inRange / rangeSize) * 100))
  })

  const hpPercent = computed(() => Math.round((player.value.hp / player.value.maxHp) * 100))

  function resetPlayer() {
    player.value = { ...defaultPlayer }
    boardQuests.value = []
    activeQuests.value = []
    bossActive.value = false
    bossQuest.value = null
    fillBoard()
    pushNotif('warning', '🔄 Đã reset nhân vật.')
  }

  return {
    player,
    boardQuests,
    activeQuests,
    bossActive,
    bossQuest,
    notifications,
    refreshBoard,
    acceptQuest,
    randomAccept,
    completeQuest,
    failQuest,
    skipQuest,
    completeBoss,
    failBoss,
    buyItem,
    resetPlayer,
    expProgress,
    hpPercent,
    currentRankConfig,
  }
}
