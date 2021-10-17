export const maskWalletAddress = walletAddress => {
  const length = walletAddress.length;
  return (
    walletAddress.substring(0, 10) +
    '...' +
    walletAddress.substring(length - 10, length)
  );
};
