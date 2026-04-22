# Pengu Mini App

Telegram Mini App: генератор персонажей, коллекции, профиль. Интеграция с TON через TonConnect.

## Технологии

- React 19 + TypeScript + Vite 7
- Material UI 7 (+ кастомные `variant="glass"`/`glassBottom` через theme)
- Redux Toolkit (без RTK Query) + свой persist-middleware
- `@tma.js/sdk-react` (launch params, back button, viewport)
- `@tonconnect/ui-react` (TON wallet)
- `react-router-dom` v7 (HashRouter)
- `react-i18next` (ru / en)
- `@sentry/react` (опционально, по DSN)

## Структура (упрощённый FSD)

```
src/
├── app/              # инициализация, providers, sentry, router
│   ├── providers/    # Redux/Theme/TonConnect/HashRouter/ErrorBoundary
│   ├── router/       # AppRoutes + guards (RequireWallet)
│   ├── App.tsx
│   ├── init.ts       # SDK + store-meta bootstrap
│   └── sentry.ts
├── pages/            # CollectionsPage / GeneratePage / ProfilePage
├── widgets/Layout/   # Outlet + BottomNavigation
├── features/
│   ├── connect-wallet/       # TonConnectButton + WalletStatusListener
│   └── generate-character/   # GenerateActions + SettingsDialog
├── entities/
│   ├── app/          # метаданные TMA, initDataRaw
│   ├── user/         # slice + thunk authenticateUser + mock authApi
│   ├── wallet/       # slice для TonConnect-состояния
│   ├── collection/   # slice + mocks + CollectionCard
│   └── character/    # slice с черновиком + моки партов
├── shared/
│   ├── config/       # env, routes, theme (tokens + MUI theme)
│   ├── store/        # store, rootReducer, hooks, types, persist
│   ├── ui/           # CardSlider, ColorPicker, Loader, Page, PageHeader, SearchBar, ScrollToTop, ErrorBoundary, LottieAnimation
│   ├── lib/          # backButtonManager, publicUrl
│   ├── hooks/        # useIsMobile, useTelegramBackButton
│   ├── styles/       # reset.css, global.css (CSS-переменные), tokens.scss
│   └── i18n/         # init + locales
└── assets/           # images, lottie
```

Зависимости идут **только вниз**: `pages → widgets → features → entities → shared`. Импорты через алиасы: `@app/*`, `@shared/*`, `@entities/*`, `@features/*`, `@widgets/*`, `@pages/*`, `@assets/*`.

## Установка и запуск

```bash
npm install
cp .env.example .env    # подправь под себя
npm run dev
```

Dev-сервер поднимается на `https://localhost:5173` (mkcert).

### Сборка и деплой

```bash
npm run build    # sourcemap 'hidden' — карты есть, но не линкуются из JS
npm run deploy   # gh-pages (настроено в package.json)
```

## Переменные окружения

Все читаются через `src/shared/config/env.ts` — не обращайся к `import.meta.env.*` напрямую в коде.

| Variable | Описание |
|---|---|
| `VITE_TONCONNECT_MANIFEST_URL` | **Публичный** HTTPS URL манифеста TonConnect. В dev указывай тот же, что в prod (см. раздел TonConnect ниже) |
| `VITE_API_URL` | URL бэкенда |
| `VITE_API_TIMEOUT_MS` | Таймаут запросов |
| `VITE_TON_NETWORK` | `mainnet` / `testnet` |
| `VITE_COLLECTION_MASTER_ADDRESS` | Адрес master-контракта коллекции |
| `VITE_RECEIVER_WALLET_ADDRESS` | Адрес-получатель тестовых транзакций |
| `VITE_SENTRY_DSN` | Пусто — Sentry выключен |
| `VITE_SENTRY_ENVIRONMENT` | Environment в Sentry |
| `VITE_DEBUG` | `true` — включает eruda на mobile и расширенный лог |

## TonConnect и manifest

**Важно:** кошелёк пользователя (Tonkeeper и др.) сам скачивает `tonconnect-manifest.json` по указанному URL. Поэтому он должен быть:

- доступен по **публичному HTTPS** (не `localhost`, не self-signed через mkcert),
- валидным JSON,
- `iconUrl` должен открываться (желательно PNG, многие кошельки не принимают SVG),
- `url` должен совпадать с origin, с которого открывается приложение.

Если при попытке подключить кошелёк появляется **"manifest content error"** — значит проверь эти пункты по порядку.

**Для локальной разработки** используй тот же публичный manifest, что и в продакшене (он уже настроен в `.env.example`):

```
VITE_TONCONNECT_MANIFEST_URL=https://noliq.github.io/pengu-new/tonconnect-manifest.json
```

Если нужен свой dev-manifest — прокинь сервер через ngrok/cloudflare tunnel и указывай туда.

## Redux

- `configureStore` + стандартные слайсы в `entities/*/model/slice.ts`.
- Селекторы типизированы через `RootState` (вычисляется из `rootReducer`).
- Хуки: `useAppDispatch` / `useAppSelector` из `@shared/store`.
- Персист: **простой свой middleware** (`shared/store/persist.ts`) — сохраняет только `character` (черновик генератора) в `localStorage` с debounce 300ms. Увеличивай `VERSION` при ломающих изменениях схемы.
- Мок-бэкенды живут в `entities/*/api/*.ts` и автоматически включаются, если `VITE_API_URL` не задан.

## Back-кнопка Telegram

Используй хук:

```tsx
import { useTelegramBackButton } from '@shared/hooks';
useTelegramBackButton(enabled, handler);
```

Он опирается на `backButtonManager` со стеком обработчиков: последний зарегистрировавшийся обрабатывает back первым (как в нативных приложениях).

## Стили

- **Приоритет:** SCSS Modules.
- Общие токены — `@shared/styles/tokens` (есть `.scss` и `.ts` версии, держим синхронно).
- Стеклянные стили — через MUI variants: `<Card variant="glass">`, `<Paper variant="glassBottom">`, `<Button variant="glass"|"glassPrimary">`. Добавляй новые варианты в `shared/config/theme/theme.ts`.
- `sx` — только там, где нужен динамический стиль или одноразовая настройка.

## i18n

- `react-i18next` + browser language detector.
- Локали — `shared/i18n/locales/*.ts`.
- Типизирован через `shared/i18n/types.d.ts` — `t('...')` строго проверяется.

## ESLint / TypeScript

- Path aliases + `noImplicitReturns`.
- Линт: `npx eslint .`
- Типы: `npx tsc -b`
