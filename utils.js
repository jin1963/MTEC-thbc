window.Utils = (function () {
  const { ethers } = window;

  function shortenAddress(addr) {
    if (!addr) return "";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  function formatNumber(num, decimals = 4) {
    if (num === null || num === undefined) return "-";
    return Number(num).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  }

  function formatTimestamp(ts) {
    if (!ts || ts === "0") return "-";
    const d = new Date(Number(ts) * 1000);
    return d.toLocaleString();
  }

  function secondsToCountdown(seconds) {
    if (seconds <= 0) return "ครบกำหนดแล้ว";
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d} วัน ${h} ชม. ${m} นาที`;
  }

  function copyToClipboard(text) {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function showToast(message) {
    alert(message); // แบบง่าย ๆ ก่อน ถ้าจะเอา popup สวย ๆ ค่อยเพิ่ม
  }

  function parseUnits(amount, decimals) {
    return ethers.utils.parseUnits(String(amount || "0"), decimals);
  }

  function formatUnits(bn, decimals) {
    return ethers.utils.formatUnits(bn || 0, decimals);
  }

  return {
    shortenAddress,
    formatNumber,
    formatTimestamp,
    secondsToCountdown,
    copyToClipboard,
    showToast,
    parseUnits,
    formatUnits
  };
})();
