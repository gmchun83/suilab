/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param decimals - The number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | string,
  currency = 'USD',
  decimals = 2
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
};

/**
 * Format a number with commas
 * @param value - The number to format
 * @param decimals - The number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | string,
  decimals = 2
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
};

/**
 * Format a wallet address to a shortened form
 * @param address - The wallet address
 * @param startChars - Number of characters to show at the start (default: 6)
 * @param endChars - Number of characters to show at the end (default: 4)
 * @returns Shortened address string
 */
export const formatAddress = (
  address: string,
  startChars = 6,
  endChars = 4
): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;

  return `${address.substring(0, startChars)}...${address.substring(
    address.length - endChars
  )}`;
};

/**
 * Format a date to a readable string
 * @param date - The date to format (Date object or ISO string)
 * @param format - The format to use (default: 'medium')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Format a date and time to a readable string
 * @param date - The date to format (Date object or ISO string)
 * @param format - The format to use (default: 'medium')
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: Date | string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: format === 'long' ? 'numeric' : undefined,
  };

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Format a SUI amount (converting from MIST to SUI)
 * @param amount - The amount in MIST (10^9 MIST = 1 SUI)
 * @param decimals - The number of decimal places (default: 4)
 * @returns Formatted SUI amount
 */
export const formatSUI = (
  amount: string | number,
  decimals = 4
): string => {
  // Convert to number if it's a string
  const amountNum = typeof amount === 'string' ? BigInt(amount) : BigInt(amount.toString());

  // Convert from MIST to SUI (1 SUI = 10^9 MIST)
  const suiAmount = Number(amountNum) / 1_000_000_000;

  return formatNumber(suiAmount, decimals);
};

export default {
  formatCurrency,
  formatNumber,
  formatAddress,
  formatDate,
  formatDateTime,
  formatSUI,
};
