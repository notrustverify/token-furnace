# Token Furnace UI

The deployed website lives in `appv2`. It uses Next.js 16, React 19, Alephium Web3 3, and Tailwind CSS 3. Desktop and mobile layouts support English, French, and light/dark themes.

## Development

Use Node.js 22.22.0 (also used by the Pages workflow) and Yarn 1.22.22:

```sh
cd appv2
nvm use
corepack enable
yarn install --frozen-lockfile
yarn dev
```

Open http://localhost:3000. Configure `NEXT_PUBLIC_NETWORK` and `NEXT_PUBLIC_NODE_URL` in `.env` for the intended Alephium network. Contract addresses are loaded from the existing files under `deployments/`.

## Verification and deployment

```sh
yarn lint
yarn typecheck
yarn build
```

The build creates a static website in `out/`, deployed by `.github/workflows/nextjs.yml`. Google Fonts needs network access during the build. Webpack is explicitly selected for compatibility with the wallet SDK's browser fallbacks in `next.config.js`. Next.js 16 no longer provides `next lint`, so lint runs through ESLint's flat configuration.

Wallet connections, balances, and history require access to the configured Alephium node. Burning tokens is irreversible; verify transactions using a test wallet on testnet or devnet before using mainnet.
