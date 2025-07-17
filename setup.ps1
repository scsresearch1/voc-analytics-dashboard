# PowerShell setup script for dashboard project
Write-Host "Installing root dependencies..."
npm install
Write-Host "Installing frontend dependencies..."
npm install --prefix dashboard_final
Write-Host "Installing backend dependencies..."
npm install --prefix server
Write-Host "Starting both frontend and backend servers..."
Start-Process powershell -ArgumentList 'npm start --prefix server'
Start-Process powershell -ArgumentList 'npm start --prefix dashboard_final'
Start-Sleep -Seconds 5
Start-Process http://localhost:3000 