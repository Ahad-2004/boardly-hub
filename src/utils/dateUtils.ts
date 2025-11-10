/**
 * Formats a date string or Date object into a human-readable string
 * @param date - Date string or Date object
 * @param format - Format string (default: 'MMM d, yyyy')
 * @returns Formatted date string or empty string for invalid dates
 */
export const formatDate = (date: string | Date, format = 'MMM d, yyyy'): string => {
  if (!date) return '';
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return '';
  }

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  // Handle different format patterns
  if (format === 'yyyy-MM-dd') {
    return dateObj.toISOString().split('T')[0];
  } else if (format === 'MM/dd/yyyy') {
    options.month = '2-digit';
    options.day = '2-digit';
    options.year = 'numeric';
    return dateObj.toLocaleDateString('en-US', options);
  }

  // Default format: 'MMM d, yyyy'
  return dateObj.toLocaleDateString('en-US', options);
};
