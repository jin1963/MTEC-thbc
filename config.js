// THBC / MTEC DApp Config (ใช้สัญญา Swap ภายใน)

// ✅ ที่อยู่เหรียญ THBC
const THBC_TOKEN_ADDRESS = "0xe8d4687b77B5611eF1828FDa7428034FA12a1Beb";

// ✅ ที่อยู่เหรียญ Reward MTEC
const MTEC_TOKEN_ADDRESS = "0x2D36AC3c4D4484aC60dcE5f1D4d2B69A826F52A4";

// ✅ สัญญา Staking (MTECStaking365)
const STAKING_CONTRACT_ADDRESS = "0xe823519CcD5Fc0547Bc3bC498366F791479B2AE7";

// ✅ สัญญา Swap THBC → MTEC (Fixed Rate)
const SWAP_CONTRACT_ADDRESS = "0x6FADA34FDEe30aE48a542DF36c6fF5f2f9178F42";

// ✅ Minimal ERC20 ABI
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// ✅ Swap Contract ABI (จากที่คุณส่งมา)
const SWAP_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_thbc", "type": "address" },
      { "internalType": "address", "name": "_mtec", "type": "address" },
      { "internalType": "uint256", "name": "_rateNumerator", "type": "uint256" },
      { "internalType": "uint256", "name": "_rateDenominator", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "EmergencyWithdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnerUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "numerator", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "denominator", "type": "uint256" }
    ],
    "name": "RateUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "thbcIn", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "mtecOut", "type": "uint256" }
    ],
    "name": "Swapped",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mtec",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "thbcAmount", "type": "uint256" }],
    "name": "previewMtecOut",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rateDenominator",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rateNumerator",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_newOwner", "type": "address" }],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_num", "type": "uint256" },
      { "internalType": "uint256", "name": "_denom", "type": "uint256" }
    ],
    "name": "setRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "thbcAmount", "type": "uint256" }],
    "name": "swapTHBCForMTEC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "thbc",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ✅ Staking ABI (แบบสั้น ๆ พอใช้ใน DApp)
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
  chainId: "0x38", // BSC mainnet

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

  swap: {
    address: SWAP_CONTRACT_ADDRESS,
    abi: SWAP_ABI
  }
};
