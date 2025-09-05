const fs = require('fs');
const path = require('path');

// Function to parse CSV and extract BME values
function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
        }
    }
    return data;
}

// Function to analyze BME values
function analyzeBMEValues(data, configName) {
    let tempValues = [];
    let humValues = [];
    let gasResValues = [];
    
    data.forEach(row => {
        // Handle different column names between configs
        let temp, hum, gasRes;
        
        if (row['BME1_Temp']) {
            temp = parseFloat(row['BME1_Temp']);
            hum = parseFloat(row['BME1_Hum']);
            gasRes = parseFloat(row['BME1_HeaterRes']);
        } else if (row['BME_Temp']) {
            temp = parseFloat(row['BME_Temp']);
            hum = parseFloat(row['BME_Hum']);
            gasRes = parseFloat(row['BME_GasResistance']);
        }
        
        if (!isNaN(temp)) tempValues.push(temp);
        if (!isNaN(hum)) humValues.push(hum);
        if (!isNaN(gasRes)) gasResValues.push(gasRes);
    });
    
    const stats = {
        config: configName,
        temperature: {
            count: tempValues.length,
            min: Math.min(...tempValues),
            max: Math.max(...tempValues),
            avg: tempValues.reduce((a, b) => a + b, 0) / tempValues.length,
            range: Math.max(...tempValues) - Math.min(...tempValues)
        },
        humidity: {
            count: humValues.length,
            min: Math.min(...humValues),
            max: Math.max(...humValues),
            avg: humValues.reduce((a, b) => a + b, 0) / humValues.length,
            range: Math.max(...humValues) - Math.min(...humValues)
        },
        gasResistance: {
            count: gasResValues.length,
            min: Math.min(...gasResValues),
            max: Math.max(...gasResValues),
            avg: gasResValues.reduce((a, b) => a + b, 0) / gasResValues.length,
            range: Math.max(...gasResValues) - Math.min(...gasResValues)
        }
    };
    
    return stats;
}

// Function to analyze BME values by heater profile
function analyzeBMEByHeaterProfile(data, configName) {
    const profileStats = {};
    
    data.forEach(row => {
        let heaterProfile, temp, hum, gasRes;
        
        // Handle different column names between configs
        if (row['Heater_Profile']) {
            heaterProfile = row['Heater_Profile'];
            temp = parseFloat(row['BME1_Temp']);
            hum = parseFloat(row['BME1_Hum']);
            gasRes = parseFloat(row['BME1_HeaterRes']);
        } else if (row['HeaterProfile']) {
            heaterProfile = row['HeaterProfile'];
            temp = parseFloat(row['BME_Temp']);
            hum = parseFloat(row['BME_Hum']);
            gasRes = parseFloat(row['BME_GasResistance']);
        }
        
        if (heaterProfile && !isNaN(temp) && !isNaN(hum) && !isNaN(gasRes)) {
            if (!profileStats[heaterProfile]) {
                profileStats[heaterProfile] = {
                    tempValues: [],
                    humValues: [],
                    gasResValues: [],
                    count: 0
                };
            }
            
            profileStats[heaterProfile].tempValues.push(temp);
            profileStats[heaterProfile].humValues.push(hum);
            profileStats[heaterProfile].gasResValues.push(gasRes);
            profileStats[heaterProfile].count++;
        }
    });
    
    // Calculate statistics for each profile
    const results = {};
    Object.keys(profileStats).forEach(profile => {
        const stats = profileStats[profile];
        results[profile] = {
            count: stats.count,
            temperature: {
                min: Math.min(...stats.tempValues),
                max: Math.max(...stats.tempValues),
                avg: stats.tempValues.reduce((a, b) => a + b, 0) / stats.tempValues.length,
                range: Math.max(...stats.tempValues) - Math.min(...stats.tempValues)
            },
            humidity: {
                min: Math.min(...stats.humValues),
                max: Math.max(...stats.humValues),
                avg: stats.humValues.reduce((a, b) => a + b, 0) / stats.humValues.length,
                range: Math.max(...stats.humValues) - Math.min(...stats.humValues)
            },
            gasResistance: {
                min: Math.min(...stats.gasResValues),
                max: Math.max(...stats.gasResValues),
                avg: stats.gasResValues.reduce((a, b) => a + b, 0) / stats.gasResValues.length,
                range: Math.max(...stats.gasResValues) - Math.min(...stats.gasResValues)
            }
        };
    });
    
    return results;
}

// Main analysis
function main() {
    const baselinePath = path.join(__dirname, 'public', 'Baseline');
    
    console.log('=== BME Values Analysis: Config 1 vs Config 2 ===\n');
    
    // Analyze August 13 data
    console.log('--- August 13, 2025 ---');
    try {
        const config1_13aug = parseCSV(path.join(baselinePath, 'config_1 13_aug.csv'));
        const config2_13aug = parseCSV(path.join(baselinePath, 'config_2 13_aug.csv'));
        
        const stats1_13 = analyzeBMEValues(config1_13aug, 'Config 1');
        const stats2_13 = analyzeBMEValues(config2_13aug, 'Config 2');
        
        console.log('Config 1 (13 Aug):');
        console.log(`  Temperature: ${stats1_13.temperature.avg.toFixed(2)}°C (${stats1_13.temperature.min.toFixed(2)}°C - ${stats1_13.temperature.max.toFixed(2)}°C)`);
        console.log(`  Humidity: ${stats1_13.humidity.avg.toFixed(2)}% (${stats1_13.humidity.min.toFixed(2)}% - ${stats1_13.humidity.max.toFixed(2)}%)`);
        console.log(`  Gas Resistance: ${stats1_13.gasResistance.avg.toFixed(0)} Ω (${stats1_13.gasResistance.min.toFixed(0)} Ω - ${stats1_13.gasResistance.max.toFixed(0)} Ω)`);
        
        console.log('\nConfig 2 (13 Aug):');
        console.log(`  Temperature: ${stats2_13.temperature.avg.toFixed(2)}°C (${stats2_13.temperature.min.toFixed(2)}°C - ${stats2_13.temperature.max.toFixed(2)}°C)`);
        console.log(`  Humidity: ${stats2_13.humidity.avg.toFixed(2)}% (${stats2_13.humidity.min.toFixed(2)}% - ${stats2_13.humidity.max.toFixed(2)}%)`);
        console.log(`  Gas Resistance: ${stats2_13.gasResistance.avg.toFixed(0)} Ω (${stats2_13.gasResistance.min.toFixed(0)} Ω - ${stats2_13.gasResistance.max.toFixed(0)} Ω)`);
        
        // Calculate differences
        const tempDiff = Math.abs(stats1_13.temperature.avg - stats2_13.temperature.avg);
        const humDiff = Math.abs(stats1_13.humidity.avg - stats2_13.humidity.avg);
        const gasDiff = Math.abs(stats1_13.gasResistance.avg - stats2_13.gasResistance.avg);
        
        console.log('\nDifferences (13 Aug):');
        console.log(`  Temperature: ${tempDiff.toFixed(2)}°C`);
        console.log(`  Humidity: ${humDiff.toFixed(2)}%`);
        console.log(`  Gas Resistance: ${gasDiff.toFixed(0)} Ω`);
        
    } catch (error) {
        console.log(`Error analyzing August 13 data: ${error.message}`);
    }
    
    console.log('\n--- August 14, 2025 ---');
    try {
        const config1_14aug = parseCSV(path.join(baselinePath, 'config_1 14_aug.csv'));
        const config2_14aug = parseCSV(path.join(baselinePath, 'config_2 14_aug.csv'));
        
        const stats1_14 = analyzeBMEValues(config1_14aug, 'Config 1');
        const stats2_14 = analyzeBMEValues(config2_14aug, 'Config 2');
        
        console.log('Config 1 (14 Aug):');
        console.log(`  Temperature: ${stats1_14.temperature.avg.toFixed(2)}°C (${stats1_14.temperature.min.toFixed(2)}°C - ${stats1_14.temperature.max.toFixed(2)}°C)`);
        console.log(`  Humidity: ${stats1_14.humidity.avg.toFixed(2)}% (${stats1_14.humidity.min.toFixed(2)}% - ${stats1_14.humidity.max.toFixed(2)}%)`);
        console.log(`  Gas Resistance: ${stats1_14.gasResistance.avg.toFixed(0)} Ω (${stats1_14.gasResistance.min.toFixed(0)} Ω - ${stats1_14.gasResistance.max.toFixed(0)} Ω)`);
        
        console.log('\nConfig 2 (14 Aug):');
        console.log(`  Temperature: ${stats2_14.temperature.avg.toFixed(2)}°C (${stats2_14.temperature.min.toFixed(2)}°C - ${stats2_14.temperature.max.toFixed(2)}°C)`);
        console.log(`  Humidity: ${stats2_14.humidity.avg.toFixed(2)}% (${stats2_14.humidity.min.toFixed(2)}% - ${stats2_14.humidity.max.toFixed(2)}%)`);
        console.log(`  Gas Resistance: ${stats2_14.gasResistance.avg.toFixed(0)} Ω (${stats2_14.gasResistance.min.toFixed(0)} Ω - ${stats2_14.gasResistance.max.toFixed(0)} Ω)`);
        
        // Calculate differences
        const tempDiff = Math.abs(stats1_14.temperature.avg - stats2_14.temperature.avg);
        const humDiff = Math.abs(stats1_14.humidity.avg - stats2_14.humidity.avg);
        const gasDiff = Math.abs(stats1_14.gasResistance.avg - stats2_14.gasResistance.avg);
        
        console.log('\nDifferences (14 Aug):');
        console.log(`  Temperature: ${tempDiff.toFixed(2)}°C`);
        console.log(`  Humidity: ${humDiff.toFixed(2)}%`);
        console.log(`  Gas Resistance: ${gasDiff.toFixed(0)} Ω`);
        
    } catch (error) {
        console.log(`Error analyzing August 14 data: ${error.message}`);
    }
    
    // Analyze heater profile variations
    console.log('\n=== Heater Profile Analysis ===');
    
    console.log('\n--- August 13, 2025 - Heater Profile Variations ---');
    try {
        const config1_13aug = parseCSV(path.join(baselinePath, 'config_1 13_aug.csv'));
        const config2_13aug = parseCSV(path.join(baselinePath, 'config_2 13_aug.csv'));
        
        const profileStats1_13 = analyzeBMEByHeaterProfile(config1_13aug, 'Config 1');
        const profileStats2_13 = analyzeBMEByHeaterProfile(config2_13aug, 'Config 2');
        
        console.log('\nConfig 1 (13 Aug) - Heater Profile 322:');
        if (profileStats1_13['322']) {
            const stats = profileStats1_13['322'];
            console.log(`  Sample Count: ${stats.count}`);
            console.log(`  Temperature: ${stats.temperature.avg.toFixed(2)}°C (${stats.temperature.min.toFixed(2)}°C - ${stats.temperature.max.toFixed(2)}°C)`);
            console.log(`  Humidity: ${stats.humidity.avg.toFixed(2)}% (${stats.humidity.min.toFixed(2)}% - ${stats.humidity.max.toFixed(2)}%)`);
            console.log(`  Gas Resistance: ${stats.gasResistance.avg.toFixed(0)} Ω (${stats.gasResistance.min.toFixed(0)} Ω - ${stats.gasResistance.max.toFixed(0)} Ω)`);
        }
        
        console.log('\nConfig 2 (13 Aug) - Heater Profile 322:');
        if (profileStats2_13['322']) {
            const stats = profileStats2_13['322'];
            console.log(`  Sample Count: ${stats.count}`);
            console.log(`  Temperature: ${stats.temperature.avg.toFixed(2)}°C (${stats.temperature.min.toFixed(2)}°C - ${stats.temperature.max.toFixed(2)}°C)`);
            console.log(`  Humidity: ${stats.humidity.avg.toFixed(2)}% (${stats.humidity.min.toFixed(2)}% - ${stats.humidity.max.toFixed(2)}%)`);
            console.log(`  Gas Resistance: ${stats.gasResistance.avg.toFixed(0)} Ω (${stats.gasResistance.min.toFixed(0)} Ω - ${stats.gasResistance.max.toFixed(0)} Ω)`);
        }
        
    } catch (error) {
        console.log(`Error analyzing August 13 heater profiles: ${error.message}`);
    }
    
    console.log('\n--- August 14, 2025 - Heater Profile Variations ---');
    try {
        const config1_14aug = parseCSV(path.join(baselinePath, 'config_1 14_aug.csv'));
        const config2_14aug = parseCSV(path.join(baselinePath, 'config_2 14_aug.csv'));
        
        const profileStats1_14 = analyzeBMEByHeaterProfile(config1_14aug, 'Config 1');
        const profileStats2_14 = analyzeBMEByHeaterProfile(config2_14aug, 'Config 2');
        
        console.log('\nConfig 1 (14 Aug) - Heater Profile 402:');
        if (profileStats1_14['402']) {
            const stats = profileStats1_14['402'];
            console.log(`  Sample Count: ${stats.count}`);
            console.log(`  Temperature: ${stats.temperature.avg.toFixed(2)}°C (${stats.temperature.min.toFixed(2)}°C - ${stats.temperature.max.toFixed(2)}°C)`);
            console.log(`  Humidity: ${stats.humidity.avg.toFixed(2)}% (${stats.humidity.min.toFixed(2)}% - ${stats.humidity.max.toFixed(2)}%)`);
            console.log(`  Gas Resistance: ${stats.gasResistance.avg.toFixed(0)} Ω (${stats.gasResistance.min.toFixed(0)} Ω - ${stats.gasResistance.max.toFixed(0)} Ω)`);
        }
        
        console.log('\nConfig 2 (14 Aug) - Heater Profile 418:');
        if (profileStats2_14['418']) {
            const stats = profileStats2_14['418'];
            console.log(`  Sample Count: ${stats.count}`);
            console.log(`  Temperature: ${stats.temperature.avg.toFixed(2)}°C (${stats.temperature.min.toFixed(2)}°C - ${stats.temperature.max.toFixed(2)}°C)`);
            console.log(`  Humidity: ${stats.humidity.avg.toFixed(2)}% (${stats.humidity.min.toFixed(2)}% - ${stats.humidity.max.toFixed(2)}%)`);
            console.log(`  Gas Resistance: ${stats.gasResistance.avg.toFixed(0)} Ω (${stats.gasResistance.min.toFixed(0)} Ω - ${stats.gasResistance.max.toFixed(0)} Ω)`);
        }
        
        // Show all available heater profiles
        console.log('\nAvailable Heater Profiles:');
        console.log('Config 1 (14 Aug):', Object.keys(profileStats1_14).join(', '));
        console.log('Config 2 (14 Aug):', Object.keys(profileStats2_14).join(', '));
        
    } catch (error) {
        console.log(`Error analyzing August 14 heater profiles: ${error.message}`);
    }
    
}

main();
