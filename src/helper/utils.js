// utils.js - исправленная версия

// Сохранение строк ввода в localStorage
export function saveInputRows(inputRows, title, height, width) {
  const inputRowsJSON = JSON.stringify(inputRows);
  localStorage.setItem('inputRows', inputRowsJSON);

  // Сохраняем настройки графика, если они предоставлены
  saveChartSettings(title, height, width);
}

// Сохранение настроек графика
export function saveChartSettings(title, height, width) {
  if (title !== undefined) localStorage.setItem('chartTitle', title);
  if (height !== undefined) localStorage.setItem('chartHeight', height);
  if (width !== undefined) localStorage.setItem('chartWidth', width);
}

// Загрузка строк ввода из localStorage
export function loadInputRows(inputRows) {
  const inputRowsJSON = localStorage.getItem('inputRows');
  if (inputRowsJSON) {
    const loadedInputRows = JSON.parse(inputRowsJSON);
    inputRows.value.splice(0, inputRows.value.length, ...loadedInputRows);
  } else {
    console.log('Input rows local storage is empty or JSON is undefined');
  }
}

// Загрузка настроек графика из localStorage
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

// Очистка строк ввода в localStorage
export function clearInputRows() {
  localStorage.removeItem('inputRows');
}

// Очистка настроек графика в localStorage
export function clearChartSettings() {
  localStorage.removeItem('chartTitle');
  localStorage.removeItem('chartHeight');
  localStorage.removeItem('chartWidth');
}

// Очистка всех данных в localStorage
export function clearAllData() {
  clearInputRows();
  clearChartSettings();
}

// Обработка выбора файла
export function handleFileSelect(input, inputRows) {
  const file = input.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (event) => handleFileLoad(event, inputRows);
      reader.readAsText(file);
  }
}

// Обработка загрузки файла
export function handleFileLoad(event, inputRows) {
  const csvData = event.target.result;
  const rows = csvData.trim().split('\n');

  // Проверяем, есть ли хотя бы одна строка
  if (rows.length === 0) return null;

  // Парсим метаданные графика из первой строки
  const chartMetadata = rows[0].replace(/\r/g, '').split(',');

  // Извлекаем метаданные (предполагаем, что в первой строке всегда метаданные)
  const chartTitle = chartMetadata[0] || 'Timeline';
  const chartHeight = chartMetadata[1] || '400';
  const chartWidth = chartMetadata[2] || '900';

  // Обрабатываем оставшиеся строки как строки данных
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

  // Возвращаем метаданные и строки данных
  return {
    chartTitle,
    chartHeight,
    chartWidth,
    rows: dataRows
  };
}

// Преобразование даты в формат ММ.ГГГГ
function toMMYYYY(dateStr) {
  // Проверяем, является ли строка пустой или неопределенной
  if (!dateStr) return '';

  const [month, year] = dateStr.split('.');
  const monthStr = (month.length === 1 ? '0' : '') + month;
  return `${monthStr}.${year}`;
}