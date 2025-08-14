const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function countHeaterProfiles() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  // Read Config 1 merged file
  const config1Path = path.join(baselineDir, 'config_1_both_dates_merged.csv');
  const config1Content = fs.readFileSync(config1Path, 'utf8');
  const config1Data = parse(config1Content, { skip_empty_lines: true });
  
  // Read Config 2 merged file
  const config2Path = path.join(baselineDir, 'config_2_both_dates_merged.csv');
  const config2Content = fs.readFileSync(config2Path, 'utf8');
  const config2Data = parse(config2Content, { skip_empty_lines: true });
  
  // Get unique heater profiles for Config 1
  const config1Profiles = new Set();
  config1Data.slice(1).forEach(row => {
    if (row[4]) { // Heater_Profile is at index 4
      config1Profiles.add(row[4]);
    }
  });
  
  // Get unique heater profiles for Config 2
  const config2Profiles = new Set();
  config2Data.slice(1).forEach(row => {
    if (row[4]) { // Heater_Profile is at index 4
      config2Profiles.add(row[4]);
    }
  });
  
  console.log('Config 1 Heater Profiles:');
  console.log('Total unique profiles:', config1Profiles.size);
  console.log('Profiles:', Array.from(config1Profiles).sort());
  console.log('');
  
  console.log('Config 2 Heater Profiles:');
  console.log('Total unique profiles:', config2Profiles.size);
  console.log('Profiles:', Array.from(config2Profiles).sort());
  console.log('');
  
  // Show sample data for each profile
  console.log('Config 1 Profile Details:');
  config1Profiles.forEach(profile => {
    const sampleRows = config1Data.slice(1).filter(row => row[4] === profile).slice(0, 3);
    console.log(`Profile ${profile}: ${sampleRows.length} rows, Sample: ${sampleRows[0]?.slice(0, 5).join(', ')}`);
  });
}

countHeaterProfiles();
