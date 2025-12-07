window.Wallet = (function () {
  const { ethers } = window;
  const CONFIG = window.APP_CONFIG;

  let provider = null;
  let signer = null;
  let address = null;

  async function connectWallet() {
    if (!window.ethereum) {
      Utils.showToast("ไม่พบกระเป๋า Web3 (MetaMask / Bitget)");
      return null;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    const reqAccounts = await provider.send("eth_requestAccounts", []);
    address = reqAccounts[0];
    signer = provider.getSigner();

    await ensureCorrectNetwork();

    // listen เปลี่ยน account / network
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    return address;
  }

  async function ensureCorrectNetwork() {
    const targetChainId = CONFIG.chainId;
    const network = await provider.getNetwork();
    const currentChainIdHex = "0x" + network.chainId.toString(16);

    if (currentChainIdHex !== targetChainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }]
        });
      } catch (err) {
        Utils.showToast("กรุณาเลือกเครือข่าย BNB Smart Chain (BSC) ในกระเป๋า");
        throw err;
      }
    }
  }

  function getProvider() {
    return provider;
  }

  function getSigner() {
    return signer;
  }

  function getAddress() {
    return address;
  }

  function isConnected() {
    return !!address;
  }

  async function getTokenContract(tokenCfg) {
    if (!provider) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    return new ethers.Contract(tokenCfg.address, tokenCfg.abi, signer || provider);
  }

  async function getStakingContract() {
    if (!provider) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    return new ethers.Contract(CONFIG.staking.address, CONFIG.staking.abi, signer || provider);
  }

  async function getRouterContract() {
    if (!provider) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }
    return new ethers.Contract(CONFIG.router.address, CONFIG.router.abi, signer || provider);
  }

  return {
    connectWallet,
    getProvider,
    getSigner,
    getAddress,
    isConnected,
    getTokenContract,
    getStakingContract,
    getRouterContract
  };
})();
