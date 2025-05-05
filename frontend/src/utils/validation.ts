import { MAX_NAME_LENGTH, MAX_SYMBOL_LENGTH, MAX_DESCRIPTION_LENGTH, MIN_COIN_SUPPLY, MAX_COIN_SUPPLY } from '../config/constants';

/**
 * Validate a coin name
 * @param name - The coin name to validate
 * @returns Error message or null if valid
 */
export const validateCoinName = (name: string): string | null => {
  if (!name || name.trim() === '') {
    return 'Coin name is required';
  }
  
  if (name.length > MAX_NAME_LENGTH) {
    return `Coin name must be ${MAX_NAME_LENGTH} characters or less`;
  }
  
  // Check for special characters (allow letters, numbers, spaces, and basic punctuation)
  if (!/^[a-zA-Z0-9 .,!?-]+$/.test(name)) {
    return 'Coin name contains invalid characters';
  }
  
  return null;
};

/**
 * Validate a coin symbol
 * @param symbol - The coin symbol to validate
 * @returns Error message or null if valid
 */
export const validateCoinSymbol = (symbol: string): string | null => {
  if (!symbol || symbol.trim() === '') {
    return 'Coin symbol is required';
  }
  
  if (symbol.length > MAX_SYMBOL_LENGTH) {
    return `Coin symbol must be ${MAX_SYMBOL_LENGTH} characters or less`;
  }
  
  // Check for special characters (allow only uppercase letters and numbers)
  if (!/^[A-Z0-9]+$/.test(symbol)) {
    return 'Coin symbol must contain only uppercase letters and numbers';
  }
  
  return null;
};

/**
 * Validate a coin description
 * @param description - The coin description to validate
 * @returns Error message or null if valid
 */
export const validateCoinDescription = (description?: string): string | null => {
  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
  }
  
  return null;
};

/**
 * Validate a coin supply
 * @param supply - The coin supply to validate
 * @returns Error message or null if valid
 */
export const validateCoinSupply = (supply: string): string | null => {
  if (!supply || supply.trim() === '') {
    return 'Coin supply is required';
  }
  
  const numSupply = Number(supply);
  
  if (isNaN(numSupply)) {
    return 'Coin supply must be a number';
  }
  
  if (numSupply < Number(MIN_COIN_SUPPLY)) {
    return `Coin supply must be at least ${MIN_COIN_SUPPLY}`;
  }
  
  if (numSupply > Number(MAX_COIN_SUPPLY)) {
    return `Coin supply must be less than ${MAX_COIN_SUPPLY}`;
  }
  
  if (!Number.isInteger(numSupply)) {
    return 'Coin supply must be a whole number';
  }
  
  return null;
};

/**
 * Validate an image file
 * @param file - The image file to validate
 * @param maxSize - Maximum file size in bytes
 * @returns Error message or null if valid
 */
export const validateImageFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): string | null => {
  if (!file) {
    return 'Image file is required';
  }
  
  if (file.size > maxSize) {
    return `Image file must be smaller than ${maxSize / (1024 * 1024)}MB`;
  }
  
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Image must be JPEG, PNG, GIF, or WebP format';
  }
  
  return null;
};

/**
 * Validate a wallet address
 * @param address - The wallet address to validate
 * @returns Error message or null if valid
 */
export const validateWalletAddress = (address: string): string | null => {
  if (!address || address.trim() === '') {
    return 'Wallet address is required';
  }
  
  // Basic Sui address validation (starts with 0x and has 64 hex chars after)
  if (!/^0x[a-fA-F0-9]{64}$/.test(address)) {
    return 'Invalid Sui wallet address format';
  }
  
  return null;
};

export default {
  validateCoinName,
  validateCoinSymbol,
  validateCoinDescription,
  validateCoinSupply,
  validateImageFile,
  validateWalletAddress,
};
