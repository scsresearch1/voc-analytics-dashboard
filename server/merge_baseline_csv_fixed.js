const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Function to read and parse CSV file
function readCSV(filePath) {
  try {
    const csvString = fs.readFileSync(filePath, 'utf8');
    return parse(csvString, { skip_empty_lines: true });
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Function to write CSV file
function writeCSV(filePath, data) {
  try {
    const csvContent = data.map(row => row.join(',')).join('\n');
    fs.writeFileSync(filePath, csvContent, 'utf8');
    console.log(`Successfully wrote ${filePath}`);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
  }
}

// Function to merge CSV files with proper validation
function mergeCSVFiles() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  console.log('Starting CSV merge process...\n');
  
  // Read all CSV files
  const config1_13 = readCSV(path.join(baselineDir, 'config_1 13_aug.csv'));
  const config1_14 = readCSV(path.join(baselineDir, 'config_1 14_aug.csv'));
  const config2_13 = readCSV(path.join(baselineDir, 'config_2 13_aug.csv'));
  const config2_14 = readCSV(path.join(baselineDir, 'config_2 14_aug.csv'));
  
  if (!config1_13 || !config1_14 || !config2_13 || !config2_14) {
    console.error('Failed to read one or more CSV files');
    return;
  }
  
  console.log('Original file statistics:');
  console.log('Config 1 (13 Aug):', config1_13.length, 'rows');
  console.log('Config 1 (14 Aug):', config1_14.length, 'rows');
  console.log('Config 2 (13 Aug):', config2_13.length, 'rows');
  console.log('Config 2 (14 Aug):', config2_14.length, 'rows');
  console.log('');
  
  // Validate headers match
  if (config1_13[0].join(',') !== config1_14[0].join(',')) {
    console.error('Config 1 headers do not match between 13 Aug and 14 Aug files!');
    console.log('13 Aug headers:', config1_13[0]);
    console.log('14 Aug headers:', config1_14[0]);
    return;
  }
  
  if (config2_13[0].join(',') !== config2_14[0].join(',')) {
    console.error('Config 2 headers do not match between 13 Aug and 14 Aug files!');
    console.log('13 Aug headers:', config2_13[0]);
    console.log('14 Aug headers:', config2_14[0]);
    return;
  }
  
  console.log('Headers validation passed ✓');
  console.log('');
  
  // Merge Config 1 files
  const mergedConfig1 = [
    config1_13[0], // Header from first file
    ...config1_13.slice(1), // Data from 13 Aug
    ...config1_14.slice(1)  // Data from 14 Aug
  ];
  
  // Merge Config 2 files
  const mergedConfig2 = [
    config2_13[0], // Header from first file
    ...config2_13.slice(1), // Data from 13 Aug
    ...config2_14.slice(1)  // Data from 14 Aug
  ];
  
  console.log('Merged file statistics:');
  console.log('Merged Config 1:', mergedConfig1.length, 'rows (expected:', config1_13.length + config1_14.length - 1, ')');
  console.log('Merged Config 2:', mergedConfig2.length, 'rows (expected:', config2_13.length + config2_14.length - 1, ')');
  console.log('');
  
  // Validate merge results
  if (mergedConfig1.length !== config1_13.length + config1_14.length - 1) {
    console.error('Config 1 merge failed: row count mismatch!');
    return;
  }
  
  if (mergedConfig2.length !== config2_13.length + config2_14.length - 1) {
    console.error('Config 2 merge failed: row count mismatch!');
    return;
  }
  
  console.log('Merge validation passed ✓');
  console.log('');
  
  // Verify dates in merged files
  const dateIndex1 = mergedConfig1[0].findIndex(h => h === 'Date');
  const dateIndex2 = mergedConfig2[0].findIndex(h => h === 'Date');
  
  if (dateIndex1 !== -1) {
    const config1Dates = new Set();
    mergedConfig1.slice(1).forEach(row => {
      if (row[dateIndex1]) config1Dates.add(row[dateIndex1]);
    });
    console.log('Config 1 merged dates:', Array.from(config1Dates).sort());
  }
  
  if (dateIndex2 !== -1) {
    const config2Dates = new Set();
    mergedConfig2.slice(1).forEach(row => {
      if (row[dateIndex2]) config2Dates.add(row[dateIndex2]);
    });
    console.log('Config 2 merged dates:', Array.from(config2Dates).sort());
  }
  console.log('');
  
  // Write merged files
  writeCSV(path.join(baselineDir, 'config_1_both_dates_merged.csv'), mergedConfig1);
  writeCSV(path.join(baselineDir, 'config_2_both_dates_merged.csv'), mergedConfig2);
  
  console.log('CSV merging completed successfully! ✓');
}

// Run the merge
mergeCSVFiles();
