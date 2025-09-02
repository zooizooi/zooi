import fs from 'fs';

export default function removeFile(file) {
    fs.rmSync(file, { force: true }, (err) => {
        if (err) console.error('Error removing file:', err);
    });
}