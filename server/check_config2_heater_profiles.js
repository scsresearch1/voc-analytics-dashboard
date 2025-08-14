const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function checkConfig2HeaterProfiles() {
  const baselineDir = path.join(__dirname, '..', 'dashboard_local', 'public', 'Baseline');
  
  // Read the merged Config 2 file
  const mergedPath = path.join(baselineDir, 'config_2_both_dates_merged.csv');
  const mergedContent = fs.readFileSync(mergedPath, 'utf8');
  const mergedData = parse(mergedContent, { skip_empty_lines: true });
  
  console.log('Config 2 Heater Profile Analysis:');
  console.log('Total rows:', mergedData.length);
  console.log('Headers:', mergedData[0]);
  console.log('');
  
  const heaterProfileIndex = mergedData[0].findIndex(h => h === 'HeaterProfile');
  const dateIndex = mergedData[0].findIndex(h => h === 'Date');
  
  if (heaterProfileIndex !== -1) {
    console.log('HeaterProfile column index:', heaterProfileIndex);
    console.log('');
    
    // Get unique heater profiles
    const uniqueProfiles = new Set();
    mergedData.slice(1).forEach(row => {
      if (row[heaterProfileIndex]) uniqueProfiles.add(row[heaterProfileIndex]);
    });
    
    console.log('Total unique heater profiles:', uniqueProfiles.size);
    console.log('');
    
    // Analyze profiles by date
    const profilesByDate = {};
    mergedData.slice(1).forEach(row => {
      const date = row[dateIndex];
      const profile = row[heaterProfileIndex];
      
      if (date && profile) {
        if (!profilesByDate[date]) profilesByDate[date] = new Set();
        profilesByDate[date].add(profile);
      }
    });
    
    console.log('Heater profiles by date:');
    Object.keys(profilesByDate).sort().forEach(date => {
      const profiles = Array.from(profilesByDate[date]).sort();
      console.log(`  ${date}: ${profiles.length} profiles - ${profiles.slice(0, 10).join(', ')}${profiles.length > 10 ? '...' : ''}`);
    });
    console.log('');
    
    // Check if profiles are actually numeric IDs or something else
    const sampleProfiles = Array.from(uniqueProfiles).slice(0, 20);
    console.log('Sample heater profile values:');
    sampleProfiles.forEach(profile => {
      const isNumeric = !isNaN(parseFloat(profile)) && isFinite(profile);
      const isInteger = Number.isInteger(parseFloat(profile));
      console.log(`  "${profile}" - Numeric: ${isNumeric}, Integer: ${isInteger}`);
    });
    console.log('');
    
    // Check if these might be temperature or resistance values
    const numericProfiles = sampleProfiles.filter(p => !isNaN(parseFloat(p))).map(p => parseFloat(p));
    if (numericProfiles.length > 0) {
      const min = Math.min(...numericProfiles);
      const max = Math.max(...numericProfiles);
      const avg = numericProfiles.reduce((a, b) => a + b, 0) / numericProfiles.length;
      
      console.log('Numeric profile statistics:');
      console.log(`  Min: ${min}`);
      console.log(`  Max: ${max}`);
      console.log(`  Average: ${avg.toFixed(2)}`);
      console.log(`  Range: ${(max - min).toFixed(2)}`);
      console.log('');
      
      // If the range is small and values are around 17-26, these might be temperature values
      if (min >= 15 && max <= 30) {
        console.log('⚠️  WARNING: These values look like temperature readings (15-30°C range)');
        console.log('   The "HeaterProfile" column might actually contain temperature data, not profile IDs!');
      }
    }
  }
}

checkConfig2HeaterProfiles();
