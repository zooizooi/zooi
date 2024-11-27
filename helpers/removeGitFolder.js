const fs = require('fs');

module.exports = function removeGitFolder(projectName) {
    fs.rmSync(`./${projectName}/.git`, { recursive: true, force: true }, (err) => {
        if (err) console.error('Error removing folder:', err);
    });
};