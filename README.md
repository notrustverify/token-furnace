# Token Furnace dApp

A decentralized application built on Alephium that allows users to burn their tokens. The dApp features a simple interface for selecting and burning both listed and custom tokens.

## Features

- Connect with Alephium wallet
- Select from available tokens in your wallet
- Burn custom tokens by entering token ID
- Quick amount selection (10%, 50%, Max)
- Real-time balance display
- Safety check preventing ALPH burns

## Getting Started

### Prerequisites

- Node.js
- Yarn
- Alephium wallet
- Access to Alephium network (devnet, testnet, or mainnet)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
yarn install
```

3. Compile and deploy contracts:
```bash
yarn compile
yarn deploy
yarn build:contracts
```

4. Start the development server:
```bash
yarn dev
```

### Configuration

Set your Alephium node URL in the environment variables:
```
NEXT_PUBLIC_NODE_URL=<your-node-url>
NEXT_PUBLIC_NETWORK=<devnet|testnet|mainnet>
```

## Development

The project is structured as a monorepo with two main parts:
- `app/`: Next.js frontend
- `contracts/`: Alephium smart contracts

### Running Tests

```bash
yarn test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]
