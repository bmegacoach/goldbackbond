# GoldBackBond - Digital Gold-Backed Stablecoin Platform

## Overview
GoldBackBond is a revolutionary digital stablecoin platform backed by US federal reserve Gold Certificates with a face value of 250 billion, pegged 1:1 to USD.

## Key Features
- **Gold Certificate Backing**: Backed by US federal reserve Gold Certificates with face value of 250 billion
- **1:1 USD Peg**: Stable value backed by real gold assets
- **Staking Incentives**: 12-month staking provides 3:1 gold certificate value leverage
- **Multi-Chain Support**: LayerZero integration for seamless access to 100+ blockchains
- **Institutional Lending**: Built-in lender integration with up to 70% LTV

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Web3**: Wagmi + Reown AppKit (formerly Web3Modal)
- **UI Components**: Radix UI + Custom Components

## Deployment

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Deployment

#### Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

#### Railway
1. Push code to GitHub
2. Connect repository to Railway
3. Configure build settings:
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

#### Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy with provided configuration

## Configuration Files
- `vercel.json` - Vercel deployment configuration
- `railway.toml` - Railway deployment configuration  
- `netlify.toml` - Netlify deployment configuration
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore rules

## Environment Variables
All environment variables are configured for production deployment. No additional setup required.

## License
Private - All rights reserved

## Support
For technical support and questions, please contact the development team.
