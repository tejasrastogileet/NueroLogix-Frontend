<div align="center">

# NeuroLogix

### AI-assisted logistics, with shipment workflows and Solana-powered escrow.

A React frontend for managing shipment records, viewing risk insights, and connecting a Solana wallet to shipment payment flows.

[Features](#-features) · [Getting Started](#-getting-started) · [Configuration](#-configuration) · [Project Structure](#-project-structure)

</div>

---

## Overview

NeuroLogix is a logistics project exploring how AI-assisted risk insights and blockchain escrow can support shipment workflows. The frontend provides a landing page, shipment dashboard, shipment creation and detail views, and wallet connection through Solana's Devnet.

> **Project status:** This repository contains the frontend application. It depends on a separately running API for shipment data. Blockchain functionality is configured for Solana Devnet; this project is not audited or intended to manage production funds.

## ✨ Features

- **Shipment management** — Create shipments and view shipment details and statuses.
- **Risk insights UI** — Dashboard components for presenting shipment risk information.
- **Solana wallet connection** — Connect a Phantom wallet using Solana Wallet Adapter.
- **Escrow workflow interface** — Initiate shipment-related fund locking and release flows on Devnet.
- **Responsive interface** — React components styled with Tailwind CSS, with motion effects on the landing page.

AI predictions, shipment records, and transaction behavior may depend on backend services and Solana configuration that are not included in this repository.

## 🧰 Tech Stack

- React 18 and React Router
- JavaScript
- Tailwind CSS
- Solana Web3.js and Solana Wallet Adapter
- Axios
- Framer Motion and React Icons
- Create React App with `react-app-rewired`

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A compatible Solana wallet, such as Phantom, for wallet features
- The NeuroLogix backend/API, when using shipment features that require server data

### Install and run

```bash
git clone https://github.com/tejasrastogileet/NueroLogix-Frontend.git
cd NueroLogix-Frontend
npm install
cp .env.example .env
npm start
```

The development server is available at [http://localhost:3000](http://localhost:3000).

### Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the development server. |
| `npm test` | Run the test suite. |
| `npm run build` | Create an optimized production build in `build/`. |

## ⚙️ Configuration

Copy `.env.example` to `.env` and set values for your environment:

```dotenv
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PROGRAM_ID=your-program-id
REACT_APP_NETWORK=https://api.devnet.solana.com
REACT_APP_ESCROW_ACCOUNT=your-escrow-account-id
```

- Run the backend API separately and make sure it is available at the configured API URL.
- The current frontend API helper uses `http://localhost:5000/api` directly; update `src/api/shipmentAPI.js` if your backend runs elsewhere.
- The wallet adapter currently connects to Solana Devnet. Use only Devnet wallets and test SOL while developing.
- Never commit `.env` files, private keys, seed phrases, or other credentials. Frontend environment variables are bundled into the client and must not contain secrets.

## 🗺️ Application Routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/login` | Login page |
| `/dashboard` | Shipment dashboard and risk insights |
| `/add-shipment` | Create a shipment |
| `/shipment/:id` | Shipment details and status workflow |

## 📁 Project Structure

```text
src/
├── api/          # API client and shipment requests
├── components/   # Reusable UI components
├── context/      # Shared application context
├── solana/       # Wallet and Solana transaction utilities
├── AddShipment.js
├── Dashboard.js
├── Landing.js
├── Login.js
└── ShipmentDetails.js
```

## 🛡️ Safety & Limitations

This repository is a frontend project and does not include the backend or smart-contract source. Verify the backend, program, transaction details, and wallet prompts independently before signing any transaction. Do not use this prototype with real funds or production shipment data.

## 🤝 Contributing

Contributions and suggestions are welcome. For substantial changes, open an issue first to discuss the proposed work. Please avoid committing credentials or environment-specific configuration.

## 📄 License

No license is currently specified in this repository. Contact the repository owner before redistributing or reusing the code.
