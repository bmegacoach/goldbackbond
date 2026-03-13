# GBB Day-1 Launch Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy GBBAllocationInscription + LenderRegistry to Base Mainnet, register Genesis Bank and Trust as the first approved lender, and build the Genesis Bank Coming Soon frontend module — making the system live for the 48-hour launch window.

**Architecture:** Two Solidity contracts deployed to Base Mainnet via ethers.js deploy script. Deployed addresses written to `deployments/mainnet.json` before verification (fail-safe). Frontend updated with new route (`/app/genesis-bank`), navbar entry, and a rich Genesis Bank module component. Contract addresses propagated to `contractAddresses.ts` after deployment.

**Tech Stack:** Solidity 0.8.20, Hardhat 3 + hardhat-toolbox v6, ethers.js v6, React + TypeScript, wagmi, framer-motion, lucide-react v0.364, Tailwind CSS, Base Mainnet (chainId 8453)

---

## Key Addresses

| Role | Address |
|---|---|
| GBB Deployer | `0xb349037166ad22103E3c7c40642DEEF6f16e4759` |
| Genesis Bank and Trust | `0xc2FF845095ADC1EE93c93Bec0c33a538D0208407` |
| Etherscan API Key | `KMHTI9GSEJZ9NT8Z8A29BPP58VJV7D6GTK` |

---

## Chunk 1: Contracts + Hardhat Config

### Task 1: Write LenderRegistry.sol

**Files:**
- Create: `contracts/LenderRegistry.sol`

**CRITICAL:** The ABI at `src/lib/abis/LenderRegistry.json` is the source of truth. The compiled contract must expose **exactly these 5 functions and no others** as public/external. Do NOT add constructor events, `transferOwnership`, `owner()` getter, or any additional public/external functions. Do NOT regenerate or overwrite `LenderRegistry.json`.

- [ ] **Step 1: Create the contract**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LenderRegistry
 * @notice Tracks approved lenders for the GoldBackBond ecosystem.
 * @dev ABI is fixed at src/lib/abis/LenderRegistry.json — 5 functions, no additions.
 */
contract LenderRegistry {
    address private _owner;
    mapping(address => bool) private _approvedLenders;

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "LenderRegistry: caller is not owner");
        _;
    }

    function isApprovedLender(address lender) external view returns (bool) {
        return _approvedLenders[lender];
    }

    function approveLender(address lender) external onlyOwner {
        _approvedLenders[lender] = true;
    }

    function revokeLender(address lender) external onlyOwner {
        _approvedLenders[lender] = false;
    }

    function batchApproveLenders(address[] calldata lenders) external onlyOwner {
        for (uint256 i = 0; i < lenders.length; i++) {
            _approvedLenders[lenders[i]] = true;
        }
    }

    function batchRevokeLenders(address[] calldata lenders) external onlyOwner {
        for (uint256 i = 0; i < lenders.length; i++) {
            _approvedLenders[lenders[i]] = false;
        }
    }
}
```

- [ ] **Step 2: Verify compile**

```bash
npx hardhat compile
```

Expected: `Compiled 2 Solidity files successfully` (GBBAllocationInscription + LenderRegistry)

- [ ] **Step 3: Commit**

```bash
git add contracts/LenderRegistry.sol
git commit -m "feat(contracts): add LenderRegistry — ABI-matched, 5 functions only"
```

---

### Task 2: Update hardhat.config.cjs

**Files:**
- Modify: `hardhat.config.cjs`

**CRITICAL plugin note:** `@nomicfoundation/hardhat-toolbox` v6.1.2 is already installed and bundles `hardhat-verify` internally. Do NOT add a standalone `require('@nomicfoundation/hardhat-verify')` — this will cause a double-registration conflict. Replace the existing `require("@nomicfoundation/hardhat-ethers")` with `require("@nomicfoundation/hardhat-toolbox")`. The legacy `@nomiclabs/hardhat-etherscan` is also installed but must NOT be required — it will conflict.

- [ ] **Step 1: Replace the config entirely**

Replace `hardhat.config.cjs` with:

```js
require("@nomicfoundation/hardhat-toolbox");
// NOTE: Do NOT require("@nomicfoundation/hardhat-verify") — it's bundled in toolbox v6.
// NOTE: Do NOT require("@nomiclabs/hardhat-etherscan") — legacy, causes conflicts.

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // matches pragma ^0.8.20 in both contracts
  networks: {
    hardhat: {
      type: "edr-simulated", // Hardhat 3 EDR default — kept as-is
      chainId: 31337,
      forking: {
        url: "https://sepolia.base.org"
      }
    },
    basemainnet: {
      url: "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY.replace(/^0x/, '')}`] : [],
      chainId: 8453
    }
  },
  etherscan: {
    apiKey: {
      // Key name must match the network name defined above
      basemainnet: process.env.ETHERSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "basemainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",  // Basescan, not Etherscan mainnet
          browserURL: "https://basescan.org"
        }
      }
    ]
  }
};
```

- [ ] **Step 2: Verify compile still works**

```bash
npx hardhat compile
```

Expected: `Nothing to compile` (artifacts already built) or `Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add hardhat.config.cjs
git commit -m "feat(hardhat): add basemainnet network + Basescan verify via hardhat-toolbox"
```

---

## Chunk 2: Deploy Script + .env Template

### Task 3: Create .env template and deployments directory

**Files:**
- Create: `.env.example`
- Create: `deployments/.gitkeep`

- [ ] **Step 1: Create .env.example**

```bash
# GBB Mainnet Deployment
# Copy to .env and fill in real values — NEVER commit .env

# Private key for deployer wallet 0xb349037166ad22103E3c7c40642DEEF6f16e4759
# Create in MetaMask → Copy Private Key → paste WITHOUT the 0x prefix
PRIVATE_KEY=your_deployer_private_key_without_0x_prefix

# Genesis Bank and Trust wallet address (pre-approved lender on deploy)
GENESIS_BANK_ADDRESS=0xc2FF845095ADC1EE93c93Bec0c33a538D0208407

# Basescan API key for contract verification
ETHERSCAN_API_KEY=your_basescan_api_key_here
```

- [ ] **Step 2: Create deployments directory**

```bash
mkdir -p deployments
touch deployments/.gitkeep
```

- [ ] **Step 3: Verify .env is in .gitignore**

```bash
grep "^\.env$" .gitignore || echo ".env" >> .gitignore
```

- [ ] **Step 4: Commit**

```bash
git add .env.example deployments/.gitkeep .gitignore
git commit -m "chore: add .env.example, deployments dir, verify .env gitignored"
```

---

### Task 4: Write deploy script (two-phase: deploy + verify)

**Files:**
- Create: `scripts/deploy_gbb_contracts.js`

Phase 1 deploys contracts and logs addresses to `deployments/mainnet.json` before verification. If Phase 2 (Basescan verification) fails, addresses are already safe. Verification can be re-run independently:
```bash
npx hardhat verify --network basemainnet <address>
```

- [ ] **Step 1: Create the deploy script**

```js
// scripts/deploy_gbb_contracts.js
// Phase 1: Deploy contracts + log addresses
// Phase 2: Verify on Basescan (independent — can re-run if it fails)

require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// ── Guards ──────────────────────────────────────────────────────────────────
if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY not set in .env — aborting before any deployment");
}
if (!process.env.GENESIS_BANK_ADDRESS) {
  throw new Error("GENESIS_BANK_ADDRESS not set in .env — aborting before any deployment");
}
if (!process.env.ETHERSCAN_API_KEY) {
  console.warn("⚠️  ETHERSCAN_API_KEY not set — Phase 2 verification will fail");
}

const GENESIS_BANK_ADDRESS = process.env.GENESIS_BANK_ADDRESS;
const RPC_URL = "https://mainnet.base.org";

// Load compiled artifacts (run `npx hardhat compile` first)
function loadArtifact(contractName) {
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    `${contractName}.sol`,
    `${contractName}.json`
  );
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found: ${artifactPath}\nRun: npx hardhat compile`);
  }
  return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
}

async function main() {
  console.log("🚀 GBB Mainnet Deployment — Phase 1: Deploy + Log\n");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const privateKey = process.env.PRIVATE_KEY.startsWith("0x")
    ? process.env.PRIVATE_KEY
    : `0x${process.env.PRIVATE_KEY}`;
  const deployer = new ethers.Wallet(privateKey, provider);

  console.log(`Deployer:     ${deployer.address}`);
  const balance = await provider.getBalance(deployer.address);
  console.log(`Balance:      ${ethers.formatEther(balance)} ETH`);

  if (balance < ethers.parseEther("0.005")) {
    throw new Error("Insufficient ETH — need at least 0.005 ETH on Base Mainnet for gas");
  }

  // ── Deploy GBBAllocationInscription ─────────────────────────────────────
  console.log("\n📜 Deploying GBBAllocationInscription...");
  const inscriptionArtifact = loadArtifact("GBBAllocationInscription");
  const InscriptionFactory = new ethers.ContractFactory(
    inscriptionArtifact.abi,
    inscriptionArtifact.bytecode,
    deployer
  );
  const inscription = await InscriptionFactory.deploy();
  await inscription.waitForDeployment();
  const inscriptionAddress = await inscription.getAddress();
  console.log(`✅ GBBAllocationInscription: ${inscriptionAddress}`);

  // ── Deploy LenderRegistry ────────────────────────────────────────────────
  console.log("\n📜 Deploying LenderRegistry...");
  const registryArtifact = loadArtifact("LenderRegistry");
  const RegistryFactory = new ethers.ContractFactory(
    registryArtifact.abi,
    registryArtifact.bytecode,
    deployer
  );
  const registry = await RegistryFactory.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`✅ LenderRegistry: ${registryAddress}`);

  // ── Confirm LenderRegistry is live before approving ──────────────────────
  const code = await provider.getCode(registryAddress);
  if (code === "0x") {
    throw new Error("LenderRegistry bytecode not found at deployed address — node may be lagging");
  }

  // ── Approve Genesis Bank ─────────────────────────────────────────────────
  console.log(`\n🏦 Approving Genesis Bank: ${GENESIS_BANK_ADDRESS}...`);
  const tx = await registry.approveLender(GENESIS_BANK_ADDRESS);
  await tx.wait();
  console.log(`✅ Genesis Bank approved. Tx: ${tx.hash}`);

  // ── Save addresses ───────────────────────────────────────────────────────
  const deployment = {
    network: "basemainnet",
    chainId: 8453,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      GBBAllocationInscription: inscriptionAddress,
      LenderRegistry: registryAddress
    },
    initialLenders: {
      GenesisBankAndTrust: GENESIS_BANK_ADDRESS
    }
  };

  const outPath = path.join(__dirname, "..", "deployments", "mainnet.json");
  fs.writeFileSync(outPath, JSON.stringify(deployment, null, 2));
  console.log(`\n💾 Addresses saved to deployments/mainnet.json`);

  console.log("\n─────────────────────────────────────────────");
  console.log("Phase 1 complete. Update contractAddresses.ts:");
  console.log(`  ALLOCATION_INSCRIPTION: '${inscriptionAddress}'`);
  console.log(`  LENDER_REGISTRY:        '${registryAddress}'`);
  console.log("─────────────────────────────────────────────");
  console.log("\nPhase 2 — Run verification separately:");
  console.log(`  npx hardhat verify --network basemainnet ${inscriptionAddress}`);
  console.log(`  npx hardhat verify --network basemainnet ${registryAddress}`);
}

main().catch((err) => {
  console.error("\n❌ Deployment failed:", err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Verify dotenv is installed**

```bash
ls node_modules/dotenv 2>/dev/null && echo "dotenv installed" || npm install dotenv
```

- [ ] **Step 3: Commit**

```bash
git add scripts/deploy_gbb_contracts.js
git commit -m "feat(deploy): two-phase GBB mainnet deploy script — log-before-verify"
```

---

### ⛽ MANUAL DEPLOYMENT STEP (Troy only)

Before proceeding to Chunk 3, Troy must:

1. Add your private key to `.env`:
   ```
   PRIVATE_KEY=<your_key_without_0x>
   GENESIS_BANK_ADDRESS=0xc2FF845095ADC1EE93c93Bec0c33a538D0208407
   ETHERSCAN_API_KEY=KMHTI9GSEJZ9NT8Z8A29BPP58VJV7D6GTK
   ```

2. Fund deployer `0xb349037166ad22103E3c7c40642DEEF6f16e4759` with **0.01 ETH** on Base Mainnet

3. Compile:
   ```bash
   npx hardhat compile
   ```

4. Deploy (Phase 1) — run with **`node`**, NOT `npx hardhat run`:
   ```bash
   node scripts/deploy_gbb_contracts.js
   ```
   This uses ethers.js directly with your `.env` PRIVATE_KEY. Running via `npx hardhat run` would ignore the `.env` and fail.

5. Verify (Phase 2 — run even if Phase 1 printed errors at the verify step):
   ```bash
   npx hardhat verify --network basemainnet <GBBAllocationInscription_address>
   npx hardhat verify --network basemainnet <LenderRegistry_address>
   ```
   No `--constructor-args` needed — both contracts have zero-argument constructors (`constructor() { owner = msg.sender; }`).

6. Share the two deployed addresses so Chunk 3 can be completed.

---

## Chunk 3: contractAddresses.ts Update

### Task 5: Update addresses and fix stale comment

**Files:**
- Modify: `src/lib/contractAddresses.ts`

**Note:** This task requires the deployed addresses from the deployment step above. Placeholder values below — replace with actual addresses from `deployments/mainnet.json`.

- [ ] **Step 1: Fix stale header comment (line 5)**

Old:
```ts
 * NETWORK: Base Sepolia (Testnet) — deployed and audited by InterFi
```

New:
```ts
 * NETWORK: Base Mainnet — production deployment
```

- [ ] **Step 2: Update ALLOCATION_INSCRIPTION**

Old:
```ts
    ALLOCATION_INSCRIPTION: '0x0000000000000000000000000000000000000001' as `0x${string}`, // TODO: Deploy and replace
```

New (replace address with actual from deployments/mainnet.json):
```ts
    ALLOCATION_INSCRIPTION: '<deployed_inscription_address>' as `0x${string}`,
```

- [ ] **Step 3: Update LENDER_REGISTRY**

Old:
```ts
    LENDER_REGISTRY: '0x0000000000000000000000000000000000000000' as `0x${string}`, // TODO: Deploy and replace
```

New:
```ts
    LENDER_REGISTRY: '<deployed_registry_address>' as `0x${string}`,
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/contractAddresses.ts
git commit -m "feat(config): update ALLOCATION_INSCRIPTION + LENDER_REGISTRY mainnet addresses"
```

---

## Chunk 4: GenesisBankPage Component

### Task 6: Create GenesisBankPage.tsx

**Files:**
- Create: `src/components/pages/GenesisBankPage.tsx`

Design system: amber/slate palette, framer-motion animations, lucide-react icons. Matches the existing app design language seen in `ComingSoonPage.tsx` and other dApp pages.

- [ ] **Step 1: Create the component**

```tsx
/**
 * GenesisBankPage — Genesis Bank and Trust institutional lender module
 * Shows active on-chain registration + Coming Soon functionality
 */

import { motion } from 'framer-motion'
import { Building2, Shield, CheckCircle2, Clock, ExternalLink, ArrowLeft, Landmark, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CONTRACTS, getContractUrl } from '../../lib/contractAddresses'

const GENESIS_BANK_ADDRESS = '0xc2FF845095ADC1EE93c93Bec0c33a538D0208407'

const features = [
  {
    icon: Landmark,
    title: 'Institutional Lending',
    description: 'High-volume USDGB token lending with bespoke terms and dedicated relationship management.',
    status: 'coming-soon',
  },
  {
    icon: Shield,
    title: 'Compliance Dashboard',
    description: 'Real-time KYC/AML status, transaction monitoring, and regulatory reporting tools.',
    status: 'coming-soon',
  },
  {
    icon: Lock,
    title: 'Collateral Management',
    description: 'On-chain collateral tracking, automated margin calls, and liquidation protection.',
    status: 'coming-soon',
  },
]

const GenesisBankPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-4 mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Genesis Bank and Trust</h1>
            <p className="text-amber-400 text-sm font-medium mt-0.5">Institutional Lender — Base Mainnet</p>
          </div>
        </div>
      </motion.div>

      {/* On-chain registration status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-slate-800/60 border border-amber-500/20 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">On-Chain Registration Active</span>
            </div>
            <h2 className="text-white font-bold text-lg">LenderRegistry</h2>
            <p className="text-gray-400 text-sm mt-1">
              Genesis Bank and Trust is an approved lender in the GoldBackBond protocol, verified on Base Mainnet.
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <a
              href={`https://basescan.org/address/${CONTRACTS.LENDER_REGISTRY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 transition-colors text-sm"
            >
              <span>View Registry</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://basescan.org/address/${GENESIS_BANK_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-gray-400 hover:text-gray-300 transition-colors text-xs"
            >
              <span>{GENESIS_BANK_ADDRESS.slice(0, 6)}...{GENESIS_BANK_ADDRESS.slice(-4)}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/50">
          {[
            { label: 'Status', value: 'Approved', color: 'text-green-400' },
            { label: 'Network', value: 'Base Mainnet', color: 'text-amber-400' },
            { label: 'Lender Type', value: 'Institutional', color: 'text-blue-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <div className={`font-bold text-sm ${color}`}>{value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Coming Soon features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wide">Coming Soon</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 relative overflow-hidden"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-xs text-amber-500/70 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Soon
                  </span>
                </div>
                <div className="w-10 h-10 bg-slate-700/60 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-amber-400/70" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10 p-6 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/20 rounded-2xl text-center"
      >
        <h3 className="text-white font-bold text-lg mb-2">Institutional Access</h3>
        <p className="text-gray-400 text-sm mb-4">
          Genesis Bank and Trust institutional lending features are in active development. Contact us for priority access.
        </p>
        <a
          href="https://goldbackbond.com/contact"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          <span>Request Early Access</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  )
}

export default GenesisBankPage
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pages/GenesisBankPage.tsx
git commit -m "feat(ui): add GenesisBankPage — on-chain status + Coming Soon module"
```

---

## Chunk 5: Routing + Navbar

### Task 7: Update App.tsx

**Files:**
- Modify: `src/App.tsx`

Add the import and route inside the **nested `<Routes>` block within `<AppLayout>`** — after the `allocations` route, before the closing `</Routes>`. Do NOT add at the top-level Routes block.

- [ ] **Step 1: Add import** (after the existing `BuyWizardPage` import)

```tsx
import GenesisBankPage from './components/pages/GenesisBankPage'
```

- [ ] **Step 2: Add route** (inside AppLayout's nested `<Routes>`, after the `allocations` route)

```tsx
{/* Admin / Issuance routes */}
<Route path="allocations" element={<AllocationApprovalPage />} />
<Route path="genesis-bank" element={<GenesisBankPage />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat(routing): add /app/genesis-bank route inside AppLayout"
```

---

### Task 8: Update AppNavbar.tsx

**Files:**
- Modify: `src/components/layout/AppNavbar.tsx`

Add `Building2` to the lucide-react import, add a `badge` optional field to the navigation item type, append Genesis Bank entry to the `navigation` array, and render the badge in the nav link map.

- [ ] **Step 1: Update lucide-react import**

Old:
```tsx
import {
  Menu,
  X,
  Home,
  Lock,
  DollarSign,
  BarChart3,
  Settings,
  ArrowLeft,
  Wallet,
  Shield
} from 'lucide-react'
```

New:
```tsx
import {
  Menu,
  X,
  Home,
  Lock,
  DollarSign,
  BarChart3,
  Settings,
  ArrowLeft,
  Wallet,
  Shield,
  Building2
} from 'lucide-react'
```

- [ ] **Step 2: Update navigation array** (add `badge` field to type + Genesis Bank entry)

Old:
```tsx
  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Stake', href: '/app/asset-management?tab=staking', icon: Lock },
    { name: 'Lending', href: '/app/asset-management?tab=lending', icon: DollarSign },
    { name: 'Analytics', href: '/app/asset-management?tab=analytics', icon: BarChart3 }
  ]
```

New:
```tsx
  const navigation: { name: string; href: string; icon: React.ElementType; badge?: string }[] = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Stake', href: '/app/asset-management?tab=staking', icon: Lock },
    { name: 'Lending', href: '/app/asset-management?tab=lending', icon: DollarSign },
    { name: 'Analytics', href: '/app/asset-management?tab=analytics', icon: BarChart3 },
    { name: 'Genesis Bank', href: '/app/genesis-bank', icon: Building2, badge: 'Soon' }
  ]
```

- [ ] **Step 3: Update nav link render to show badge**

Find the desktop navigation map. Old inner content:
```tsx
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
```

New:
```tsx
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-xs text-amber-500 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 leading-none">
                      {item.badge}
                    </span>
                  )}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppNavbar.tsx
git commit -m "feat(nav): add Genesis Bank entry with Coming Soon badge"
```

---

## Chunk 6: Build Verification

### Task 9: Full build + route smoke test

**Files:** None modified — verification only.

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: `✓ built in Xs` with no errors. Note any warnings (type warnings are non-blocking; import errors are blocking).

- [ ] **Step 3: Start preview server**

```bash
npm run preview
```

Open browser to the preview URL (typically `http://localhost:4173`).

- [ ] **Step 4: Smoke test checklist**

Navigate to each route and confirm it loads without errors:

| Route | Expected |
|---|---|
| `http://localhost:4173/app` | AppDashboard renders |
| `http://localhost:4173/app/genesis-bank` | GenesisBankPage renders with on-chain status card |
| AppNavbar | "Genesis Bank" entry visible with "Soon" badge |
| Basescan links | Point to correct LenderRegistry + Genesis Bank addresses |

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: GBB Day-1 launch complete — contracts deployed, Genesis Bank module live"
git push
```

---

## Success Criteria

- [ ] `GBBAllocationInscription` deployed + verified on Basescan at non-zero address
- [ ] `LenderRegistry` deployed + verified on Basescan at non-zero address
- [ ] Genesis Bank address `0xc2FF845095ADC1EE93c93Bec0c33a538D0208407` returns `true` on `isApprovedLender()` call
- [ ] `contractAddresses.ts` line 5 comment says "Base Mainnet" (not Base Sepolia)
- [ ] `/app/genesis-bank` loads correctly inside AppLayout with wallet context
- [ ] AppNavbar shows "Genesis Bank" with amber "Soon" badge
- [ ] `npm run build` exits 0 with no errors
- [ ] `deployments/mainnet.json` committed with both addresses

---

## Out of Scope (this plan)

- CAMP contract suite deployment (this weekend — separate plan)
- CCA Uniswap V4 LBP auction setup
- Onboarding/sales system build
- Marketing site updates
- OpenChief orchestrator integration
