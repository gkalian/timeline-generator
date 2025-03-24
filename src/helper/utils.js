// utils.js - corrected version

// Saving input rows to localStorage
export function saveInputRows(inputRows, title, height, width) {
  const inputRowsJSON = JSON.stringify(inputRows);
  localStorage.setItem('inputRows', inputRowsJSON);

  // Save the chart settings, if provided
  saveChartSettings(title, height, width);
}

// Saving chart settings
export function saveChartSettings(title, height, width) {
  if (title !== undefined) localStorage.setItem('chartTitle', title);
  if (height !== undefined) localStorage.setItem('chartHeight', height);
  if (width !== undefined) localStorage.setItem('chartWidth', width);
}

// Loading input rows from localStorage
export function loadInputRows(inputRows) {
  const inputRowsJSON = localStorage.getItem('inputRows');
  if (inputRowsJSON) {
    const loadedInputRows = JSON.parse(inputRowsJSON);
    inputRows.value.splice(0, inputRows.value.length, ...loadedInputRows);
  } else {
    console.log('Input rows local storage is empty or JSON is undefined');
  }
}

// Loading chart settings from localStorage
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

// Clearing input rows in localStorage
export function clearInputRows() {
  localStorage.removeItem('inputRows');
}

// Clearing chart settings in localStorage
export function clearChartSettings() {
  localStorage.removeItem('chartTitle');
  localStorage.removeItem('chartHeight');
  localStorage.removeItem('chartWidth');
}

// Clearing all data in localStorage
export function clearAllData() {
  clearInputRows();
  clearChartSettings();
}

// Handling file selection
export function handleFileSelect(input, inputRows) {
  const file = input.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (event) => handleFileLoad(event, inputRows);
      reader.readAsText(file);
  }
}

// Handling file upload
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

//  Convert date to MM.YYYY format
function toMMYYYY(dateStr) {
  // Check if the string is empty or undefined
  if (!dateStr) return '';

  const [month, year] = dateStr.split('.');
  const monthStr = (month.length === 1 ? '0' : '') + month;
  return `${monthStr}.${year}`;
}