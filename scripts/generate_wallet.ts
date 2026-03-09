import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Generating new wallet...');

    // Create random wallet
    const wallet = ethers.Wallet.createRandom();

    console.log('\n--- New Wallet Details ---');
    console.log(`Address: ${wallet.address}`);
    console.log('--------------------------');

    // Save PRIVATE_KEY to .env
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = `PRIVATE_KEY=${wallet.privateKey}\n`;

    try {
        fs.writeFileSync(envPath, envContent);
        console.log(`Success! and Private Key saved to: ${envPath}`);
        console.log('Keep this file private. Do not commit to git.');
    } catch (error) {
        console.error('Error writing .env file:', error);
    }
}

main().catch(console.error);
