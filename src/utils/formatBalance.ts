export const formatBalance = (balance: string, decimals = 4): string => {
  const num = parseFloat(balance)
  if (isNaN(num)) return '0.0000'
  return num.toFixed(decimals)
}
