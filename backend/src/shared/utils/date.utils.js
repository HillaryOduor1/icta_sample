/**
 * Get start date based on range string
 * @param {string} range - '1d', '7d', '30d', '90d', 'current_month'
 * @returns {Date}
 */
export const getStartDate = (range) => {
  const now = new Date();
  switch (range) {
    case '1d':
      return new Date(now.setDate(now.getDate() - 1));
    case '7d':
      return new Date(now.setDate(now.getDate() - 7));
    case '30d':
      return new Date(now.setDate(now.getDate() - 30));
    case '90d':
      return new Date(now.setDate(now.getDate() - 90));
    case 'current_month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return new Date(now.setDate(now.getDate() - 30));
  }
};