const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function checkConfig2Structure() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  // Check Config 2 13 Aug file
  const config2_13_path = path.join(baselineDir, 'config_2 13_aug.csv');
  const config2_13_content = fs.readFileSync(config2_13_path, 'utf8');
  const config2_13_data = parse(config2_13_content, { skip_empty_lines: true });
  
  console.log('Config 2 13 Aug Structure:');
  console.log('Headers:', config2_13_data[0]);
  console.log('First 5 data rows:');
  config2_13_data.slice(1, 6).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, row.slice(0, 10).join(', '));
  });
  console.log('');
  
  // Check Config 2 14 Aug file
  const config2_14_path = path.join(baselineDir, 'config_2 14_aug.csv');
  const config2_14_content = fs.readFileSync(config2_14_path, 'utf8');
  const config2_14_data = parse(config2_14_content, { skip_empty_lines: true });
  
  console.log('Config 2 14 Aug Structure:');
  console.log('Headers:', config2_14_data[0]);
  console.log('First 5 data rows:');
  config2_14_data.slice(1, 6).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, row.slice(0, 10).join(', '));
  });
  console.log('');
  
  // Check if there are other columns that might be heater profiles
  console.log('Looking for potential heater profile columns in Config 2:');
  const headers = config2_13_data[0];
  headers.forEach((header, index) => {
    if (header.toLowerCase().includes('heater') || header.toLowerCase().includes('profile')) {
      console.log(`Column ${index}: "${header}"`);
      
      // Show unique values in this column
      const uniqueValues = new Set();
      config2_13_data.slice(1, 100).forEach(row => {
        if (row[index]) uniqueValues.add(row[index]);
      });
      console.log(`  Sample unique values: ${Array.from(uniqueValues).slice(0, 10).join(', ')}`);
    }
  });
}

checkConfig2Structure();
