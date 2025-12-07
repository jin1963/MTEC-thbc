window.addEventListener("DOMContentLoaded", () => {
  const btnConnect = document.getElementById("btnConnect");
  const btnMaxThbc = document.getElementById("btnMaxThbc");
  const btnMaxMtec = document.getElementById("btnMaxMtec");
  const btnSwap = document.getElementById("btnSwapThbcMtec");
  const btnApproveMtec = document.getElementById("btnApproveMtec");
  const btnStakeMtec = document.getElementById("btnStakeMtec");
  const btnClaim = document.getElementById("btnClaim");
  const btnCopyReferral = document.getElementById("btnCopyReferral");
  const inputThbcAmount = document.getElementById("inputThbcAmount");
  const selectSlippage = document.getElementById("selectSlippage");

  let referralAddressFromLink = null;

  // ดึง ref จาก URL ถ้ามี
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && ref.startsWith("0x") && ref.length === 42) {
      referralAddressFromLink = ref;
      const inputReferrer = document.getElementById("inputReferrer");
      inputReferrer.value = ref;
    }
  } catch (e) {}

  btnConnect.addEventListener("click", async () => {
    const addr = await Wallet.connectWallet();
    if (addr) {
      document.getElementById("walletAddress").textContent =
        Utils.shortenAddress(addr);
      await Staking.loadBalances();
      await Staking.loadStakingInfo();
      updateReferralLink(addr);
    }
  });

  // Swap
  inputThbcAmount.addEventListener("input", () => {
    Staking.updateMtecEstimate();
  });
  selectSlippage.addEventListener("change", () => {
    Staking.updateMtecEstimate();
  });

  btnSwap.addEventListener("click", async () => {
    try {
      await Staking.swapThbcToMtec();
      await Staking.loadBalances();
      Staking.updateMtecEstimate();
    } catch (e) {
      console.error(e);
      Utils.showToast("Swap ไม่สำเร็จ / ถูกยกเลิก");
    }
  });

  // MAX ปุ่ม
  btnMaxThbc.addEventListener("click", async () => {
    if (!Wallet.isConnected()) {
      await Wallet.connectWallet();
    }
    await Staking.loadBalances(); // เพื่อ update

    // ใช้ค่าจาก DOM
    const balText = document.getElementById("thbcBalance").textContent.split(" ")[0].replace(/,/g, "");
    if (balText && balText !== "-") {
      inputThbcAmount.value = balText;
      Staking.updateMtecEstimate();
    }
  });

  btnMaxMtec.addEventListener("click", async () => {
    if (!Wallet.isConnected()) {
      await Wallet.connectWallet();
    }
    await Staking.loadBalances();
    const balText = document.getElementById("mtecBalance").textContent.split(" ")[0].replace(/,/g, "");
    if (balText && balText !== "-") {
      document.getElementById("inputStakeAmount").value = balText;
    }
  });

  // Approve + Stake
  btnApproveMtec.addEventListener("click", async () => {
    try {
      await Staking.approveMtecForStaking();
    } catch (e) {
      console.error(e);
      Utils.showToast("Approve ไม่สำเร็จ / ถูกยกเลิก");
    }
  });

  btnStakeMtec.addEventListener("click", async () => {
    try {
      await Staking.stakeMtec(referralAddressFromLink);
      await Staking.loadBalances();
      await Staking.loadStakingInfo();
    } catch (e) {
      console.error(e);
      Utils.showToast("Stake ไม่สำเร็จ / ถูกยกเลิก");
    }
  });

  // Claim
  btnClaim.addEventListener("click", async () => {
    try {
      await Staking.claim();
      await Staking.loadBalances();
      await Staking.loadStakingInfo();
    } catch (e) {
      console.error(e);
      Utils.showToast("Claim ไม่สำเร็จ / ถูกยกเลิก");
    }
  });

  // Referral link copy
  btnCopyReferral.addEventListener("click", () => {
    const link = document.getElementById("inputReferralLink").value;
    Utils.copyToClipboard(link);
    Utils.showToast("คัดลอกลิงก์แนะนำแล้ว ✅");
  });

  function updateReferralLink(addr) {
    const url = new URL(window.location.href);
    url.searchParams.set("ref", addr);
    document.getElementById("inputReferralLink").value = url.toString();
  }
});
