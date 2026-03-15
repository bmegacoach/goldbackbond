const { ethers } = require('ethers');

const RPC_URL = 'https://mainnet.base.org';
const USDGB_TOKEN = '0x1b12fdbda1d6709e189fe16e1a76469e05ce8a5e';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  try {
    const code = await provider.getCode(USDGB_TOKEN);
    console.log('Contract code length:', code.length);
    if (code === '0x') {
      console.log('NO CONTRACT FOUND AT THIS ADDRESS ON BASE MAINNET.');
    } else {
      console.log('Contract exists!');
      
      // Try calling totalSupply (standard ERC20)
      const data = '0x18160ddd'; // totalSupply()
      const result = await provider.call({
        to: USDGB_TOKEN,
        data: data
      });
      console.log('totalSupply result:', result);
      console.log('totalSupply parsed:', BigInt(result).toString());
    }
  } catch (error) {
    console.error('RPC Error:', error.message);
  }
}

main();
