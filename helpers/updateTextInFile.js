const fs = require('fs');

module.exports = function updateTextInFile(path, searchValue, replaceValue) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const updatedData = data.replace(new RegExp(searchValue, 'g'), replaceValue);

        fs.writeFile(path, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            // console.log('File updated successfully!');
        });
    });
};