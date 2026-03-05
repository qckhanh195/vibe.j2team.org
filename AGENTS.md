# AGENTS.md

## Project Overview

vibe.j2team.dev - A collaborative vibe coding project by J2TEAM Community. The homepage acts as a launcher linking to sub-pages, where each community member creates their own page.

## Tech Stack

- Vue 3 (Composition API with `<script setup>`)
- TypeScript (strict mode)
- Vite
- Tailwind CSS v4
- Vue Router
- Pinia

## Setup & Build

```sh
pnpm install
pnpm dev          # Dev server
pnpm build        # Type-check + production build
pnpm test:unit    # Unit tests with Vitest
pnpm lint         # Lint with oxlint + ESLint
pnpm format       # Format with oxfmt
```

## Project Structure

```
src/
  main.ts                    # App entry point
  App.vue                    # Root component (only contains <RouterView />)
  assets/main.css            # Tailwind CSS entry
  router/index.ts            # Vue Router configuration
  stores/                    # Pinia stores
  views/
    HomePage.vue             # Landing page / launcher
    <app-name>/index.vue     # Each sub-page is a directory with index.vue
```

## Design System

**IMPORTANT**: All UI work MUST follow the design system documented in `docs/DESIGN_SYSTEM.md`.

Key rules:
- Use the custom color tokens defined in `src/assets/main.css` (`@theme` block) — never use raw Tailwind grays or default colors
- DO NOT use purple, green-cyan gradients, or cold grays (`gray-950`, `gray-900`)
- Fonts: `font-display` (Anybody) for headings, `font-body` (Be Vietnam Pro) for body text
- Cards use sharp corners (no `rounded-xl` or `rounded-lg`)
- Use `bg-bg-deep` as page background, `bg-bg-surface` for cards, `bg-bg-elevated` for hover states
- Accent colors: coral (`accent-coral`) as primary, amber (`accent-amber`) as secondary, sky (`accent-sky`) as tertiary
- Section headings use `//` marker prefix with accent color
- Use `animate-fade-up` with `animate-delay-{1-7}` for page load animations

Read `docs/DESIGN_SYSTEM.md` before making any visual changes.

## Code Conventions

- Use `<script setup lang="ts">` for all Vue components
- Do not use `class` in TypeScript unless absolutely necessary
- Do not use `any` or `unknown` types
- Use Composition API (not Options API)
- Use `pnpm` as package manager (not npm/yarn)
- Vietnamese text must use diacritics (tieng Viet co dau)

## Rules / Nguyên tắc

1. **Không có database** — dự án không sử dụng database dưới bất kỳ hình thức nào
2. **Luôn có link về trang chủ** — mỗi trang con phải có link dẫn người dùng quay lại trang chủ (`/`)
3. **Ngôn ngữ: tiếng Việt (ưu tiên) hoặc tiếng Anh** — nội dung hiển thị trên trang dùng tiếng Việt hoặc tiếng Anh
4. **Không trùng ứng dụng con đã có** — kiểm tra danh sách `pages` trong `HomePage.vue` trước khi tạo trang mới
5. **Mỗi trang con hoạt động độc lập (self-contained)** — không sửa các file dùng chung (`App.vue`, `main.css`) ngoài việc thêm route vào `router/index.ts` và thêm entry vào `HomePage.vue`
6. **Responsive** — trang phải hiển thị tốt trên mobile
7. **Không thêm dependency mới** vào `package.json` trừ khi thật sự cần và được approve
8. **Ghi rõ tên tác giả** — mỗi trang phải có trường `author` trong mảng `pages` ở `HomePage.vue`

## Adding a New Page

1. Create a new directory under `src/views/<your-page-name>/`
2. Add `index.vue` as the main component inside that directory
3. Add the route in `src/router/index.ts`
4. Add the page entry to the `pages` array in `src/views/HomePage.vue`

## Path Aliases

- `@/` resolves to `src/`

## Testing

- Framework: Vitest + Vue Test Utils + JSDOM
- Test files: `src/__tests__/`

## Linting & Formatting

- ESLint + eslint-plugin-vue + @vue/eslint-config-typescript
- Oxlint (Rust-based linter, runs before ESLint)
- Oxfmt for formatting
- Prettier config exists for compatibility (eslint-config-prettier)
