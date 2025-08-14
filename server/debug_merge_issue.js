const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function debugMergeIssue() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  // Check the merged file structure
  const mergedPath = path.join(baselineDir, 'config_2_both_dates_merged.csv');
  const mergedContent = fs.readFileSync(mergedPath, 'utf8');
  const mergedData = parse(mergedContent, { skip_empty_lines: true });
  
  console.log('Merged Config 2 Structure:');
  console.log('Headers:', mergedData[0]);
  console.log('Total rows:', mergedData.length);
  console.log('');
  
  // Check first few rows from different sections
  console.log('First 5 rows:');
  mergedData.slice(1, 6).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, row.join(', '));
  });
  console.log('');
  
  // Check around row 1000 (should be from 14 Aug data)
  console.log('Around row 1000 (should be 14 Aug data):');
  mergedData.slice(1000, 1005).forEach((row, index) => {
    console.log(`Row ${1000 + index}:`, row.join(', '));
  });
  console.log('');
  
  // Check the HeaterProfile column specifically
  const heaterProfileIndex = mergedData[0].findIndex(h => h === 'HeaterProfile');
  console.log(`HeaterProfile column index: ${heaterProfileIndex}`);
  
  if (heaterProfileIndex !== -1) {
    console.log('Sample HeaterProfile values from different sections:');
    
    // First 10 values
    console.log('First 10 values:');
    mergedData.slice(1, 11).forEach((row, index) => {
      console.log(`Row ${index + 1}: ${row[heaterProfileIndex]}`);
    });
    
    // Values around row 1000
    console.log('Values around row 1000:');
    mergedData.slice(995, 1005).forEach((row, index) => {
      console.log(`Row ${995 + index}: ${row[heaterProfileIndex]}`);
    });
  }
  
  // Check if there are any empty or corrupted rows
  console.log('\nChecking for corrupted rows...');
  let corruptedRows = 0;
  mergedData.slice(1).forEach((row, index) => {
    if (row.length !== mergedData[0].length) {
      console.log(`Row ${index + 1} has ${row.length} columns instead of ${mergedData[0].length}`);
      corruptedRows++;
    }
  });
  console.log(`Total corrupted rows: ${corruptedRows}`);
}

debugMergeIssue();
