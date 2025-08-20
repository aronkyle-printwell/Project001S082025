# setup-and-run.ps1

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Installing..."
    Invoke-WebRequest "https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi" -OutFile "nodejs.msi"
    Start-Process msiexec.exe -Wait -ArgumentList '/I nodejs.msi /quiet'
    Remove-Item "nodejs.msi"
} else {
    Write-Host "Node.js is already installed."
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Start the server
Write-Host "Starting the server..."
npm start
