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

// Function to merge CSV files
function mergeCSVFiles() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  // Read all CSV files
  const config1_13 = readCSV(path.join(baselineDir, 'config_1 13_aug.csv'));
  const config1_14 = readCSV(path.join(baselineDir, 'config_1 14_aug.csv'));
  const config2_13 = readCSV(path.join(baselineDir, 'config_2 13_aug.csv'));
  const config2_14 = readCSV(path.join(baselineDir, 'config_2 14_aug.csv'));
  
  if (!config1_13 || !config1_14 || !config2_13 || !config2_14) {
    console.error('Failed to read one or more CSV files');
    return;
  }
  
  console.log('Config 1 (13 Aug):', config1_13.length, 'rows');
  console.log('Config 1 (14 Aug):', config1_14.length, 'rows');
  console.log('Config 2 (13 Aug):', config2_13.length, 'rows');
  console.log('Config 2 (14 Aug):', config2_14.length, 'rows');
  
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
  
  console.log('Merged Config 1:', mergedConfig1.length, 'rows');
  console.log('Merged Config 2:', mergedConfig2.length, 'rows');
  
  // Write merged files
  writeCSV(path.join(baselineDir, 'config_1_both_dates_merged.csv'), mergedConfig1);
  writeCSV(path.join(baselineDir, 'config_2_both_dates_merged.csv'), mergedConfig2);
  
  console.log('CSV merging completed!');
}

// Run the merge
mergeCSVFiles();
