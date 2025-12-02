/**
 * Utility functions for managing localStorage with quota handling
 */

/**
 * Get the current localStorage usage in bytes
 */
export const getLocalStorageSize = (): number => {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

/**
 * Get localStorage usage as a percentage (assuming 5MB limit)
 */
export const getLocalStorageUsagePercent = (): number => {
  const size = getLocalStorageSize();
  const limit = 5 * 1024 * 1024; // 5MB typical limit
  return (size / limit) * 100;
};

/**
 * Safely set item to localStorage with quota handling
 */
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.error('localStorage quota exceeded');
      // Try to free up space
      cleanupOldData();
      
      // Try again
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('Still cannot save to localStorage after cleanup');
        return false;
      }
    }
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Clean up old data from localStorage to free up space
 */
export const cleanupOldData = (): void => {
  console.log('🧹 Cleaning up localStorage...');
  
  // Remove old orders (keep only last 20)
  try {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 20) {
      const recentOrders = orders.slice(-20);
      localStorage.setItem('orders', JSON.stringify(recentOrders));
      console.log(`Removed ${orders.length - 20} old orders`);
    }
  } catch (e) {
    console.error('Error cleaning orders:', e);
  }
  
  // Remove old custom designs (keep only last 30)
  try {
    const designs = JSON.parse(localStorage.getItem('customDesigns') || '[]');
    if (designs.length > 30) {
      const recentDesigns = designs.slice(-30);
      localStorage.setItem('customDesigns', JSON.stringify(recentDesigns));
      console.log(`Removed ${designs.length - 30} old custom designs`);
    }
  } catch (e) {
    console.error('Error cleaning custom designs:', e);
  }
  
  // Remove old catalog designs if too many
  try {
    const catalog = JSON.parse(localStorage.getItem('catalogDesigns') || '[]');
    if (catalog.length > 50) {
      const recentCatalog = catalog.slice(-50);
      localStorage.setItem('catalogDesigns', JSON.stringify(recentCatalog));
      console.log(`Removed ${catalog.length - 50} old catalog designs`);
    }
  } catch (e) {
    console.error('Error cleaning catalog designs:', e);
  }
  
  console.log('✅ Cleanup complete');
};

/**
 * Get localStorage info for debugging
 */
export const getStorageInfo = () => {
  const size = getLocalStorageSize();
  const percent = getLocalStorageUsagePercent();
  
  return {
    sizeBytes: size,
    sizeKB: (size / 1024).toFixed(2),
    sizeMB: (size / (1024 * 1024)).toFixed(2),
    usagePercent: percent.toFixed(2),
    items: Object.keys(localStorage).length
  };
};

/**
 * Log storage info to console
 */
export const logStorageInfo = () => {
  const info = getStorageInfo();
  console.log('📊 localStorage Info:', {
    size: `${info.sizeMB} MB (${info.usagePercent}%)`,
    items: info.items
  });
};

