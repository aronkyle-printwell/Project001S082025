#Created By: Aron Kyle D. Suarnaba - System Analyst Programmer Trainee
#Date: August 2025 
#Site: Printwell, Inc.


# setup-and-run.ps1

# Function to check if Node.js is installed
function Is-NodeInstalled {
    return (Get-Command node -ErrorAction SilentlyContinue) -ne $null
}

if (-not (Is-NodeInstalled)) {
    Write-Host "Node.js not found. Installing Node.js v18.18.0..."
    
    $installerUrl = "https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi"
    $installerPath = "$env:TEMP\nodejs.msi"

    # Download the Node.js installer
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath

    # Install silently
    Start-Process msiexec.exe -Wait -ArgumentList "/i `"$installerPath`" /quiet /norestart"

    # Remove installer file
    Remove-Item $installerPath

    Write-Host "Node.js installation completed."
} else {
    Write-Host "Node.js is already installed."
}

# Navigate to the script directory (assumes script and project files are in same folder)
Set-Location -Path $PSScriptRoot

# Install npm dependencies
Write-Host "Installing dependencies..."
npm install

# Start the Node.js server in a new PowerShell window
Write-Host "Starting the server in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

# Open default browser at localhost:3000
Write-Host "Opening browser at http://localhost:3000..."
Start-Process "http://localhost:3000"
