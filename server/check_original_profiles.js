const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function checkOriginalProfiles() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  const files = [
    'config_1 13_aug.csv',
    'config_1 14_aug.csv', 
    'config_2 13_aug.csv',
    'config_2 14_aug.csv'
  ];
  
  files.forEach(filename => {
    const filePath = path.join(baselineDir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = parse(content, { skip_empty_lines: true });
      
      // Get unique heater profiles
      const profiles = new Set();
      data.slice(1).forEach(row => {
        if (row[4]) { // Heater_Profile is at index 4
          profiles.add(row[4]);
        }
      });
      
      console.log(`${filename}:`);
      console.log(`  Total rows: ${data.length - 1}`);
      console.log(`  Unique heater profiles: ${profiles.size}`);
      console.log(`  Profiles: ${Array.from(profiles).sort().join(', ')}`);
      console.log('');
    } else {
      console.log(`${filename}: FILE NOT FOUND`);
    }
  });
}

checkOriginalProfiles();
