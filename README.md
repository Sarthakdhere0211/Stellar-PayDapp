# 🌟 Stellar PayDapp

A modern, production-ready payment dApp built on the Stellar blockchain network. Send XLM payments instantly with Freighter wallet integration.

![Stellar PayDapp](https://img.shields.io/badge/Stellar-Network-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **🔐 Freighter Wallet Integration** - Secure wallet connection with Freighter browser extension
- **💰 Real-time Balance Display** - View your XLM balance fetched directly from Horizon
- **⚡ Instant Payments** - Send XLM to any Stellar address with 3-5 second settlement
- **📝 Transaction Memos** - Add optional text memos to your payments
- **🔍 Transaction Tracking** - View transaction hashes with links to Stellar Explorer
- **🎨 Modern UI/UX** - Beautiful, responsive design with smooth animations
- **🌐 Testnet Support** - Safely test on Stellar Testnet before going live

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- [Freighter Wallet](https://www.freighter.app/) browser extension
- A funded Stellar Testnet account ([Get testnet XLM](https://laboratory.stellar.org/#account-creator?network=test))

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd stellar-payment-dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
stellar-payment-dapp/
├── public/
│   └── stellar-logo.svg        # App favicon
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx   # Wallet connection UI
│   │   ├── Balance.tsx         # XLM balance display
│   │   └── SendPayment.tsx     # Payment form & submission
│   ├── hooks/
│   │   └── useWallet.ts        # Wallet state management
│   ├── utils/
│   │   ├── stellar.ts          # Stellar SDK utilities
│   │   └── constants.ts        # Network configuration
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Blockchain**: Stellar SDK (`@stellar/stellar-sdk`)
- **Wallet**: Freighter API integration
- **Build Tool**: Vite
- **Network**: Stellar Testnet (configurable)

## 📱 Usage

### 1. Connect Wallet
- Click "Connect Freighter" button
- Approve the connection in your Freighter wallet
- Your public key and balance will be displayed

### 2. View Balance
- Your XLM balance is automatically fetched from Horizon
- Click the refresh icon to update your balance

### 3. Send Payment
- Enter the destination Stellar address (starts with 'G')
- Specify the amount in XLM
- Optionally add a memo (max 28 characters)
- Click "Send XLM" and approve in Freighter
- View the transaction hash and explore on Stellar Expert

## 🌐 Network Configuration

The app is configured to use **Stellar Testnet** by default. To switch to Public Network:

1. Open `src/utils/constants.ts`
2. Change `CURRENT_NETWORK` from `testnet` to `public`:
   ```typescript
   export const CURRENT_NETWORK = NETWORK_CONFIG.public;
   ```

> ⚠️ **Warning**: Use Public Network only when you're ready for real transactions with actual XLM.

<<<<<<< HEAD
## 🎨 Customization

### Modify Theme Colors

Edit `tailwind.config.js` to customize the Stellar color palette:

```javascript
theme: {
  extend: {
    colors: {
      stellar: {
        // Your custom colors
      },
    },
  },
}
```

=======
>>>>>>> 09e8932c8ef55edd6b83add7225c49b73f9b3050
### Adjust Transaction Settings

Modify transaction timeout and fees in `src/utils/constants.ts`:

```typescript
export const TX_CONFIG = {
<<<<<<< HEAD
  timeout: 180,
  baseFee: '100',
=======
  timeout: 180,        // seconds
  baseFee: '100',      // stroops
>>>>>>> 09e8932c8ef55edd6b83add7225c49b73f9b3050
};
```

## 🔐 Security Best Practices

- ✅ Never share your secret key
- ✅ Always verify destination addresses
- ✅ Test on Testnet before using Public Network
- ✅ Transactions are signed locally in Freighter
- ✅ No private keys are stored or transmitted

## 📚 Resources

- [Stellar Documentation](https://developers.stellar.org)
- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Laboratory](https://laboratory.stellar.org)
- [Stellar Expert Explorer](https://stellar.expert/explorer/testnet)

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run type-check
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🌟 Acknowledgments

Built with ❤️ using:
- [Stellar Network](https://stellar.org)
- [Freighter Wallet](https://www.freighter.app/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
<<<<<<< HEAD
=======

>>>>>>> 09e8932c8ef55edd6b83add7225c49b73f9b3050
