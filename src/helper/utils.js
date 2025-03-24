/**
 * @file utils.js
 * @description Utility functions for managing timeline data storage, loading, and file operations
 */

/**
 * @description Saves input rows and chart settings to localStorage
 * @param {Array<{name: string, startTime: string, endTime: string}>} inputRows - Array of timeline data rows
 * @param {string} title - Chart title
 * @param {string} height - Chart height in pixels
 * @param {string} width - Chart width in pixels
 * @returns {void}
 */
export function saveInputRows(inputRows, title, height, width) {
  const inputRowsJSON = JSON.stringify(inputRows);
  localStorage.setItem('inputRows', inputRowsJSON);

  // Save the chart settings, if provided
  saveChartSettings(title, height, width);
}

/**
 * @description Saves chart settings to localStorage
 * @param {string} title - Chart title
 * @param {string} height - Chart height in pixels
 * @param {string} width - Chart width in pixels
 * @returns {void}
 */
export function saveChartSettings(title, height, width) {
  if (title !== undefined) localStorage.setItem('chartTitle', title);
  if (height !== undefined) localStorage.setItem('chartHeight', height);
  if (width !== undefined) localStorage.setItem('chartWidth', width);
}

/**
 * @description Loads input rows from localStorage into a reactive reference
 * @param {import('vue').Ref<Array<{name: string, startTime: string, endTime: string}>>} inputRows - Reactive reference to update with loaded data
 * @returns {void}
 */
export function loadInputRows(inputRows) {
  const inputRowsJSON = localStorage.getItem('inputRows');
  if (inputRowsJSON) {
    const loadedInputRows = JSON.parse(inputRowsJSON);
    inputRows.value.splice(0, inputRows.value.length, ...loadedInputRows);
  } else {
    console.log('Input rows local storage is empty or JSON is undefined');
  }
}

/**
 * @description Loads chart settings from localStorage
 * @returns {Object} Object containing chart title, height, and width with default values if not found
 */
export function loadChartSettings() {
  const savedTitle = localStorage.getItem('chartTitle');
  const savedHeight = localStorage.getItem('chartHeight');
  const savedWidth = localStorage.getItem('chartWidth');

  return {
    title: savedTitle || 'Timeline',
    height: savedHeight || '400',
    width: savedWidth || '900'
  };
}

/**
 * @description Removes input rows data from localStorage
 * @returns {void}
 */
export function clearInputRows() {
  localStorage.removeItem('inputRows');
}

/**
 * @description Removes chart settings from localStorage
 * @returns {void}
 */
export function clearChartSettings() {
  localStorage.removeItem('chartTitle');
  localStorage.removeItem('chartHeight');
  localStorage.removeItem('chartWidth');
}

/**
 * @description Removes all timeline-related data from localStorage
 * @returns {void}
 */
export function clearAllData() {
  clearInputRows();
  clearChartSettings();
}

/**
 * @description Handles file selection and initiates file reading
 * @param {HTMLInputElement} input - File input element
 * @param {import('vue').Ref<Array<{name: string, startTime: string, endTime: string}>>} inputRows - Reactive reference to update with loaded data
 * @returns {void}
 */
export function handleFileSelect(input, inputRows) {
  const file = input.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (event) => handleFileLoad(event, inputRows);
      reader.readAsText(file);
  }
}

/**
 * @description Processes loaded CSV file data and extracts timeline information
 * @param {Event} event - File reader load event
 * @param {import('vue').Ref<Array<{name: string, startTime: string, endTime: string}>>} inputRows - Reactive reference to update with loaded data
 * @returns {Object|null} Object containing chart metadata and row data, or null if parsing failed
 */
export function handleFileLoad(event, inputRows) {
  const csvData = event.target.result;
  const rows = csvData.trim().split('\n');

  // Check if there is at least one row
  if (rows.length === 0) return null;

  // Parse chart metadata from the first row
  const chartMetadata = rows[0].replace(/\r/g, '').split(',');

  // Extract metadata (assuming the first row always contains metadata)
  const chartTitle = chartMetadata[0] || 'Timeline';
  const chartHeight = chartMetadata[1] || '400';
  const chartWidth = chartMetadata[2] || '900';

  // Process remaining rows as data rows
  const dataRows = rows.slice(1).map(row => {
    const [name, start, end] = row.replace(/\r/g, '').split(',');
    const startTime = toMMYYYY(start);
    const endTime = toMMYYYY(end);
    return {
      name,
      startTime,
      endTime
    };
  });

  // Return chart metadata and data rows
  return {
    chartTitle,
    chartHeight,
    chartWidth,
    rows: dataRows
  };
}

/**
 * @description Converts date string to MM.YYYY format
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date string in MM.YYYY format or empty string if input is invalid
 * @private
 */
function toMMYYYY(dateStr) {
  // Check if the string is empty or undefined
  if (!dateStr) return '';

  const [month, year] = dateStr.split('.');
  const monthStr = (month.length === 1 ? '0' : '') + month;
  return `${monthStr}.${year}`;
}