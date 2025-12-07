// THBC / MTEC DApp Config

// ✅ ที่อยู่เหรียญหลัก THBC
const THBC_TOKEN_ADDRESS = "0xe8d4687b77B5611eF1828FDa7428034FA12a1Beb";

// ✅ ที่อยู่เหรียญ Reward MTEC
const MTEC_TOKEN_ADDRESS = "0x2D36AC3c4D4484aC60dcE5f1D4d2B69A826F52A4";

// ✅ ที่อยู่สัญญา Staking (MTECStaking365)
const STAKING_CONTRACT_ADDRESS = "0xe823519CcD5Fc0547Bc3bC498366F791479B2AE7";

// ✅ PancakeSwap Router V2 (BSC Mainnet)
const PANCAKE_ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

// ✅ Minimal ERC20 ABI (ใช้สำหรับ THBC และ MTEC)
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// ✅ Pancake Router ABI (เฉพาะฟังก์ชันที่เราใช้)
const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] calldata path) view returns (uint[] memory amounts)",
  "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external"
];

// ✅ Staking contract ABI (ตามสัญญา MTECStaking365 ที่ deploy แล้ว)
const STAKING_ABI = [
  "function stake(uint256 amount, address referrer) external",
  "function claim() external",
  "function getStake(address user) external view returns (uint256 amount,uint256 startTime,bool claimed,address referrer)",
  "function pendingRewards(address user) external view returns (uint256 stakingReward,uint256 referralReward)",
  "function canClaim(address user) external view returns (bool)",
  "function apyBasisPoints() external view returns (uint256)",
  "function referralBasisPoints() external view returns (uint256)",
  "function lockDuration() external view returns (uint256)"
];

window.APP_CONFIG = {
  // ✅ BNB Smart Chain (BSC Mainnet)
  chainId: "0x38",

  thbc: {
    address: THBC_TOKEN_ADDRESS,
    abi: ERC20_ABI
  },

  mtec: {
    address: MTEC_TOKEN_ADDRESS,
    abi: ERC20_ABI
  },

  staking: {
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI
  },

  router: {
    address: PANCAKE_ROUTER_ADDRESS,
    abi: ROUTER_ABI
  }
};
