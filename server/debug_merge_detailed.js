const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function debugMergeDetailed() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  console.log('=== DETAILED MERGE DEBUGGING ===\n');
  
  // Read all files individually
  const config1_13_path = path.join(baselineDir, 'config_1 13_aug.csv');
  const config1_14_path = path.join(baselineDir, 'config_1 14_aug.csv');
  const config2_13_path = path.join(baselineDir, 'config_2 13_aug.csv');
  const config2_14_path = path.join(baselineDir, 'config_2 14_aug.csv');
  
  console.log('File paths:');
  console.log('Config 1 13 Aug:', config1_13_path);
  console.log('Config 1 14 Aug:', config1_14_path);
  console.log('Config 2 13 Aug:', config2_13_path);
  console.log('Config 2 14 Aug:', config2_14_path);
  console.log('');
  
  // Check if files exist
  console.log('File existence:');
  console.log('Config 1 13 Aug:', fs.existsSync(config1_13_path));
  console.log('Config 1 14 Aug:', fs.existsSync(config1_14_path));
  console.log('Config 2 13 Aug:', fs.existsSync(config2_13_path));
  console.log('Config 2 14 Aug:', fs.existsSync(config2_14_path));
  console.log('');
  
  // Read and analyze each file
  const files = [
    { name: 'Config 1 13 Aug', path: config1_13_path },
    { name: 'Config 1 14 Aug', path: config1_14_path },
    { name: 'Config 2 13 Aug', path: config2_13_path },
    { name: 'Config 2 14 Aug', path: config2_14_path }
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      const content = fs.readFileSync(file.path, 'utf8');
      const data = parse(content, { skip_empty_lines: true });
      
      console.log(`${file.name}:`);
      console.log(`  File size: ${content.length} bytes`);
      console.log(`  Total rows: ${data.length}`);
      console.log(`  Headers: ${data[0].join(', ')}`);
      
      // Check for heater profile column
      const heaterProfileIndex = data[0].findIndex(h => 
        h.toLowerCase().includes('heater') || h.toLowerCase().includes('profile')
      );
      
      if (heaterProfileIndex !== -1) {
        console.log(`  HeaterProfile column: ${heaterProfileIndex} ("${data[0][heaterProfileIndex]}")`);
        
        // Get unique values in first 100 rows
        const uniqueValues = new Set();
        data.slice(1, 101).forEach(row => {
          if (row[heaterProfileIndex]) uniqueValues.add(row[heaterProfileIndex]);
        });
        console.log(`  Sample heater profiles: ${Array.from(uniqueValues).slice(0, 10).join(', ')}`);
      }
      
      // Show sample data
      console.log(`  Sample data (first 3 rows):`);
      data.slice(1, 4).forEach((row, index) => {
        console.log(`    Row ${index + 1}: ${row.slice(0, 5).join(', ')}...`);
      });
      console.log('');
    } else {
      console.log(`${file.name}: FILE NOT FOUND`);
    }
  });
  
  // Now check the merged files
  console.log('=== MERGED FILES ANALYSIS ===\n');
  
  const merged1_path = path.join(baselineDir, 'config_1_both_dates_merged.csv');
  const merged2_path = path.join(baselineDir, 'config_2_both_dates_merged.csv');
  
  if (fs.existsSync(merged1_path)) {
    const merged1_content = fs.readFileSync(merged1_path, 'utf8');
    const merged1_data = parse(merged1_content, { skip_empty_lines: true });
    
    console.log('Merged Config 1:');
    console.log(`  File size: ${merged1_content.length} bytes`);
    console.log(`  Total rows: ${merged1_data.length}`);
    console.log(`  Headers: ${merged1_data[0].join(', ')}`);
    
    // Check for dates
    const dateIndex = merged1_data[0].findIndex(h => h === 'Date');
    if (dateIndex !== -1) {
      const uniqueDates = new Set();
      merged1_data.slice(1, 100).forEach(row => {
        if (row[dateIndex]) uniqueDates.add(row[dateIndex]);
      });
      console.log(`  Sample dates: ${Array.from(uniqueDates).join(', ')}`);
    }
    console.log('');
  }
  
  if (fs.existsSync(merged2_path)) {
    const merged2_content = fs.readFileSync(merged2_path, 'utf8');
    const merged2_data = parse(merged2_content, { skip_empty_lines: true });
    
    console.log('Merged Config 2:');
    console.log(`  File size: ${merged2_content.length} bytes`);
    console.log(`  Total rows: ${merged2_data.length}`);
    console.log(`  Headers: ${merged2_data[0].join(', ')}`);
    
    // Check for dates
    const dateIndex = merged2_data[0].findIndex(h => h === 'Date');
    if (dateIndex !== -1) {
      const uniqueDates = new Set();
      merged2_data.slice(1, 100).forEach(row => {
        if (row[dateIndex]) uniqueDates.add(row[dateIndex]);
      });
      console.log(`  Sample dates: ${Array.from(uniqueDates).join(', ')}`);
      
      // Check around the transition point
      const transitionRow = Math.floor(merged2_data.length / 2);
      console.log(`  Date around row ${transitionRow}: ${merged2_data[transitionRow]?.[dateIndex]}`);
      console.log(`  Date around row ${transitionRow + 100}: ${merged2_data[transitionRow + 100]?.[dateIndex]}`);
    }
    console.log('');
  }
}

debugMergeDetailed();
