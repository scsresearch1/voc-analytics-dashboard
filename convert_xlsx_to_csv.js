const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DATA_DIR = __dirname;

fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.xlsx'))
  .forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    const workbook = XLSX.readFile(filePath);
    workbook.SheetNames.forEach(sheetName => {
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      // If only one sheet, use original name; if multiple, append sheet name
      const base = file.replace(/\.xlsx$/i, '');
      const outName = workbook.SheetNames.length === 1
        ? `${base}.csv`
        : `${base}_${sheetName.replace(/\W+/g, '_')}.csv`;
      fs.writeFileSync(path.join(DATA_DIR, outName), csv);
      console.log(`Converted ${file} [${sheetName}] -> ${outName}`);
    });
  }); 