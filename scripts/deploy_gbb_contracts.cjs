// scripts/deploy_gbb_contracts.js
// Run with: node scripts/deploy_gbb_contracts.js
// Phase 1: Deploy contracts + log addresses to deployments/mainnet.json
// Phase 2: Verify on Basescan (run independently if Phase 1 fails)

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
  const receipt = await tx.wait();
  if (receipt.status !== 1) {
    throw new Error("approveLender transaction failed");
  }
  console.log(`✅ Genesis Bank approved`);

  // ── Phase 1 Complete: Log addresses ─────────────────────────────────────
  const deployment = {
    network: "basemainnet",
    chainId: 8453,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      GBBAllocationInscription: inscriptionAddress,
      LenderRegistry: registryAddress,
    },
    genesisBankApproved: GENESIS_BANK_ADDRESS,
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  fs.writeFileSync(
    path.join(deploymentsDir, "mainnet.json"),
    JSON.stringify(deployment, null, 2)
  );

  console.log("\n📋 Deployment summary saved to deployments/mainnet.json");
  console.log(JSON.stringify(deployment, null, 2));

  // ── Phase 2: Basescan Verification ──────────────────────────────────────
  console.log("\n🔍 Phase 2: Basescan Verification");
  console.log("Run these commands if verification is needed:");
  console.log(`  npx hardhat verify --network basemainnet ${inscriptionAddress}`);
  console.log(`  npx hardhat verify --network basemainnet ${registryAddress}`);
  console.log("(Both contracts have no constructor arguments)");
}

main().catch((err) => {
  console.error("\n❌ Deployment failed:", err.message);
  process.exit(1);
});
