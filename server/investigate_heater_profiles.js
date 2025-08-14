const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function investigateHeaterProfiles() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  console.log('=== INVESTIGATING HEATER PROFILE DISCREPANCY ===\n');
  
  // Read the merged files
  const config1Path = path.join(baselineDir, 'config_1_both_dates_merged.csv');
  const config2Path = path.join(baselineDir, 'config_2_both_dates_merged.csv');
  
  const config1Data = parse(fs.readFileSync(config1Path, 'utf8'), { skip_empty_lines: true });
  const config2Data = parse(fs.readFileSync(config2Path, 'utf8'), { skip_empty_lines: true });
  
  console.log('File Structures:');
  console.log('Config 1 headers:', config1Data[0]);
  console.log('Config 2 headers:', config2Data[0]);
  console.log('');
  
  // Find heater profile columns
  const config1HeaterCol = config1Data[0].findIndex(h => h.toLowerCase().includes('heater'));
  const config2HeaterCol = config2Data[0].findIndex(h => h.toLowerCase().includes('heater'));
  
  console.log('Heater Profile Column Indices:');
  console.log('Config 1:', config1HeaterCol, `("${config1Data[0][config1HeaterCol]}")`);
  console.log('Config 2:', config2HeaterCol, `("${config2Data[0][config2HeaterCol]}")`);
  console.log('');
  
  if (config1HeaterCol !== -1 && config2HeaterCol !== -1) {
    // Get unique values from both files
    const config1Profiles = new Set();
    const config2Profiles = new Set();
    
    config1Data.slice(1).forEach(row => {
      if (row[config1HeaterCol]) config1Profiles.add(row[config1HeaterCol]);
    });
    
    config2Data.slice(1).forEach(row => {
      if (row[config2HeaterCol]) config2Profiles.add(row[config2HeaterCol]);
    });
    
    console.log('Unique Heater Profile Values:');
    console.log('Config 1:', Array.from(config1Profiles).sort());
    console.log('Config 2:', Array.from(config2Profiles).sort());
    console.log('');
    
    console.log('Profile Counts:');
    console.log('Config 1:', config1Profiles.size, 'profiles');
    console.log('Config 2:', config2Profiles.size, 'profiles');
    console.log('');
    
    // Check if they should be the same
    if (config1Profiles.size !== config2Profiles.size) {
      console.log('⚠️  DISCREPANCY DETECTED!');
      console.log('Both configurations should have the same number of heater profiles.');
      console.log('');
      
      // Check if Config 2 has the same profiles as Config 1
      const config1Array = Array.from(config1Profiles).sort();
      const config2Array = Array.from(config2Profiles).sort();
      
      console.log('Analysis:');
      console.log('Config 1 profiles:', config1Array.join(', '));
      console.log('Config 2 profiles:', config2Array.join(', '));
      console.log('');
      
      // Find missing profiles
      const missingInConfig2 = config1Array.filter(p => !config2Array.includes(p));
      const missingInConfig1 = config2Array.filter(p => !config1Array.includes(p));
      
      if (missingInConfig2.length > 0) {
        console.log('Profiles missing in Config 2:', missingInConfig2.join(', '));
      }
      if (missingInConfig1.length > 0) {
        console.log('Profiles missing in Config 1:', missingInConfig1.join(', '));
      }
      console.log('');
      
      // Check if this is a data structure issue
      console.log('Possible Issues:');
      console.log('1. Different column structures between Config 1 and Config 2');
      console.log('2. Different data formats (e.g., one uses integers, one uses decimals)');
      console.log('3. Different naming conventions for heater profiles');
      console.log('4. Data corruption during merge process');
    } else {
      console.log('✅ Both configurations have the same number of heater profiles!');
    }
  }
}

investigateHeaterProfiles();
