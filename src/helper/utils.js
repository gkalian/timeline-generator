// save and local data from/to local storage
export function saveInputRows(inputRows) {
    const inputRowsJSON = JSON.stringify(inputRows);
    localStorage.setItem('inputRows', inputRowsJSON);
}

export function loadInputRows(inputRows) {
    const inputRowsJSON = localStorage.getItem('inputRows');
    if (inputRowsJSON) {
        const loadedInputRows = JSON.parse(inputRowsJSON);
        inputRows.value.splice(0, inputRows.value.length, ...loadedInputRows);
    } else {
        console.log('Local storage is empty or JSON is undefined');
    }
}

export function clearInputRows() {
    localStorage.removeItem('inputRows');
}

// handle file upload
export function handleFileSelect(input, inputRows) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => handleFileLoad(event, inputRows);
        reader.readAsText(file);
    }
}

export function handleFileLoad(event, inputRows) {
    const csvData = event.target.result;
    const rows = csvData.trim().split('\n');
    inputRows.value = rows.map(row => {
        const [name, start, end] = row.replace(/\r/g, '').split(',');
        const startTime = toMMYYYY(start);
        const endTime = toMMYYYY(end);
        return {
            name,
            startTime,
            endTime
        };
    });
}

function toMMYYYY(dateStr) {
    const [month, year] = dateStr.split('.');
    const monthStr = (month.length === 1 ? '0' : '') + month;
    return `${monthStr}.${year}`;
}