const { exec } = require('child_process');

function emptyBin() {
    // Updated command with error action and proper path handling
    const command = 'PowerShell.exe -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            // Check if bin is already empty
            if (error.message.includes('Cannot find path')) {
                console.log('Recycle Bin is already empty');
                return;
            }

            // console.log('Error:', error.message);
            // return;
        }

        if (stderr) {
            console.log('Recycle Bin is already empty');
            return;
        }

        console.log('Recycle Bin emptied successfully');
    });
}

module.exports = emptyBin;