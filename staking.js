window.Staking = (function () {
  const { ethers } = window;
  const CONFIG = window.APP_CONFIG;

  let thbcDecimals = 18;
  let mtecDecimals = 18;

  async function initTokenDecimals() {
    const thbc = await Wallet.getTokenContract(CONFIG.thbc);
    const mtec = await Wallet.getTokenContract(CONFIG.mtec);
    thbcDecimals = await thbc.decimals();
    mtecDecimals = await mtec.decimals();
  }

  // ---------- Swap THBC → MTEC ผ่านสัญญา Swap ภายใน ----------

  async function updateMtecEstimate() {
    if (!Wallet.isConnected()) return;

    const amountStr = document.getElementById("inputThbcAmount").value;
    if (!amountStr || Number(amountStr) <= 0) {
      document.getElementById("outputMtecEstimate").value = "";
      return;
    }

    try {
      await initTokenDecimals();
      const swap = await Wallet.getSwapContract();
      const amountIn = Utils.parseUnits(amountStr, thbcDecimals);

      const mtecOutBN = await swap.previewMtecOut(amountIn);
      const out = Utils.formatUnits(mtecOutBN, mtecDecimals);

      document.getElementById("outputMtecEstimate").value = out;
    } catch (e) {
      console.error(e);
      document.getElementById("outputMtecEstimate").value = "Error";
    }
  }

  async function swapThbcToMtec() {
    if (!Wallet.isConnected()) {
      await Wallet.connectWallet();
    }
    await initTokenDecimals();

    const amountStr = document.getElementById("inputThbcAmount").value;
    if (!amountStr || Number(amountStr) <= 0) {
      Utils.showToast("กรุณากรอกจำนวน THBC");
      return;
    }

    const thbc = await Wallet.getTokenContract(CONFIG.thbc);
    const swap = await Wallet.getSwapContract();

    const amountIn = Utils.parseUnits(amountStr, thbcDecimals);
    const addr = Wallet.getAddress();

    // ตรวจ allowance ให้สัญญา swap
    const allowance = await thbc.allowance(addr, CONFIG.swap.address);
    if (allowance.lt(amountIn)) {
      Utils.showToast("กำลัง Approve THBC ให้ contract swap...");
      const txAppr = await thbc.approve(CONFIG.swap.address, amountIn);
      await txAppr.wait();
    }

    Utils.showToast("กำลัง Swap THBC → MTEC (Fixed Rate)...");
    const tx = await swap.swapTHBCForMTEC(amountIn);
    await tx.wait();

    Utils.showToast("Swap สำเร็จแล้ว ✅");
  }

  // ---------- Staking MTEC ----------

  async function approveMtecForStaking() {
    if (!Wallet.isConnected()) {
      await Wallet.connectWallet();
    }
    await initTokenDecimals();

    const amountStr = document.getElementById("inputStakeAmount").value;
    if (!amountStr || Number(amountStr) <= 0) {
      Utils.showToast("กรุณากรอกจำนวน MTEC");
      return;
    }

    const mtec = await Wallet.getTokenContract(CONFIG.mtec);
    const amount = Utils.parseUnits(amountStr, mtecDecimals);

    const addr = Wallet.getAddress();
    const allowance = await mtec.allowance(addr, CONFIG.staking.address);

    if (allowance.gte(amount)) {
      Utils.showToast("Approve ครบแล้ว ไม่ต้องทำซ้ำ");
      return;
    }

    Utils.showToast("กำลัง Approve MTEC...");
    const tx = await mtec.approve(CONFIG.staking.address, amount);
    await tx.wait();
    Utils.showToast("Approve สำเร็จ ✅");
  }

  async function stakeMtec(refAddressFromApp) {
    if (!Wallet.isConnected()) {
      await Wallet.connectWallet();
    }
    await initTokenDecimals();

    const amountStr = document.getElementById("inputStakeAmount").value;
    if (!amountStr || Number(amountStr) <= 0) {
      Utils.showToast("กรุณากรอกจำนวน MTEC");
      return;
    }

    const inputRef = document.getElementById("inputReferrer").value.trim();
    let referrer = inputRef || refAddressFromApp || ethers.constants.AddressZero;

    const userAddr = Wallet.getAddress();
    if (referrer.toLowerCase() === userAddr.toLowerCase()) {
      referrer = ethers.constants.AddressZero;
    }

    const mtec = await Wallet.getTokenContract(CONFIG.mtec);
    const staking = await Wallet.getStakingContract();

    const amount = Utils.parseUnits(amountStr, mtecDecimals);

    const allowance = await mtec.allowance(userAddr, CONFIG.staking.address);
    if (allowance.lt(amount)) {
      Utils.showToast("กรุณา Approve MTEC ให้ contract ก่อน");
      return;
    }

    Utils.showToast("กำลังส่งธุรกรรม Stake...");
    const tx = await staking.stake(amount, referrer);
    await tx.wait();

    Utils.showToast("Stake สำเร็จแล้ว ✅");
  }

  async function claim() {
    if (!Wallet.isConnected()) {
      await Wallet.connectWallet();
    }
    const staking = await Wallet.getStakingContract();

    Utils.showToast("กำลัง Claim...");
    const tx = await staking.claim();
    await tx.wait();
    Utils.showToast("Claim สำเร็จแล้ว ✅");
  }

  // ---------- Load Info ----------

  async function loadBalances() {
    if (!Wallet.isConnected()) return;
    await initTokenDecimals();

    const thbc = await Wallet.getTokenContract(CONFIG.thbc);
    const mtec = await Wallet.getTokenContract(CONFIG.mtec);

    const addr = Wallet.getAddress();
    const [bThbc, bMtec] = await Promise.all([
      thbc.balanceOf(addr),
      mtec.balanceOf(addr)
    ]);

    document.getElementById("thbcBalance").textContent =
      Utils.formatNumber(Utils.formatUnits(bThbc, thbcDecimals), 4) + " THBC";
    document.getElementById("mtecBalance").textContent =
      Utils.formatNumber(Utils.formatUnits(bMtec, mtecDecimals), 4) + " MTEC";
  }

  async function loadStakingInfo() {
    if (!Wallet.isConnected()) return;
    await initTokenDecimals();

    const staking = await Wallet.getStakingContract();
    const addr = Wallet.getAddress();

    const [stakeInfo, pending, canClaimFlag, apyBP, refBP, lockDur] = await Promise.all([
      staking.getStake(addr),
      staking.pendingRewards(addr),
      staking.canClaim(addr),
      staking.apyBasisPoints(),
      staking.referralBasisPoints(),
      staking.lockDuration()
    ]);

    const amount = stakeInfo.amount;
    const startTime = stakeInfo.startTime.toNumber
      ? stakeInfo.startTime.toNumber()
      : Number(stakeInfo.startTime);
    const claimed = stakeInfo.claimed;
    const lockSeconds = lockDur.toNumber ? lockDur.toNumber() : Number(lockDur);
    const endTime = startTime ? startTime + lockSeconds : 0;

    const nowSec = Math.floor(Date.now() / 1000);
    const secondsLeft = endTime > nowSec ? endTime - nowSec : 0;

    document.getElementById("infoStakedAmount").textContent =
      amount && amount.toString() !== "0"
        ? Utils.formatNumber(Utils.formatUnits(amount, mtecDecimals), 4) + " MTEC"
        : "-";

    document.getElementById("infoStartTime").textContent = startTime ? Utils.formatTimestamp(startTime) : "-";
    document.getElementById("infoEndTime").textContent = endTime ? Utils.formatTimestamp(endTime) : "-";
    document.getElementById("infoApy").textContent = (Number(apyBP) / 100).toFixed(2) + " %";
    document.getElementById("infoReferral").textContent = (Number(refBP) / 100).toFixed(2) + " %";

    const stakingRewardBN = pending.stakingReward || pending[0] || 0;
    const referralRewardBN = pending.referralReward || pending[1] || 0;

    document.getElementById("infoStakingReward").textContent =
      Utils.formatNumber(Utils.formatUnits(stakingRewardBN, mtecDecimals), 4) + " MTEC";

    document.getElementById("infoReferralReward").textContent =
      Utils.formatNumber(Utils.formatUnits(referralRewardBN, mtecDecimals), 4) + " MTEC";

    let statusText = claimed ? "เคลมแล้ว" : canClaimFlag ? "พร้อมเคลม" : "ยังล็อกอยู่";
    document.getElementById("infoClaimStatus").textContent = statusText;
    document.getElementById("infoCountdown").textContent = Utils.secondsToCountdown(secondsLeft);
  }

  return {
    updateMtecEstimate,
    swapThbcToMtec,
    approveMtecForStaking,
    stakeMtec,
    claim,
    loadBalances,
    loadStakingInfo
  };
})();
