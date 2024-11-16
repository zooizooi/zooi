const prompts = require('prompts');
const simpleGit = require('simple-git');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const boilerplates = require('./boilerplates');
const scripts = require('./scripts');

const emptyBin = require('./scripts/empty-bin');

(async() => {
    const response = await prompts([
        {
            type: 'select',
            name: 'main',
            message: 'What do you want?',
            choices: [
                {
                    title: 'Boilerplates',
                    value: 'boilerplates',
                },
                {
                    title: 'Scripts',
                    value: 'scripts',
                },
            ],
        },
        {
            type: prev => prev == 'boilerplates' ? 'select' : null,
            name: 'boilerplate',
            message: 'Choose a boilerplate',
            choices: boilerplates,
        },
        {
            type: (prev) => boilerplates.find((element) => element.value === prev) ? 'text' : null,
            name: 'projectName',
            message: 'Project name',
        },
        {
            type: prev => prev == 'scripts' ? 'select' : null,
            name: 'scripts',
            message: 'Choose a script',
            choices: scripts,
        },
    ]);

    // console.log(response);

    if (response.boilerplate && response.projectName) {
        setupBoilerplate(response.boilerplate, response.projectName);
    }

    if (response.scripts) {
        switch(response.scripts) {
            case 'empty-bin': emptyBin();
        }
    }

    async function setupBoilerplate(name, projectName) {
        switch(name) {
            case 'basic':
                createBoilerPlate({
                    name,
                    projectName,
                    repo: 'https://github.com/zooizooi/boilerplate-basic',
                });
                break;
            case 'threejs-experiment':
                createBoilerPlate({
                    name,
                    projectName,
                    repo: 'https://github.com/zooizooi/boilerplate-experiments-threejs',
                });
                break;
        }
    }

    async function createBoilerPlate({ name, projectName, repo }) {
        const git = simpleGit();
        await git.clone(repo, projectName);
        console.log('1. Repo cloned:', chalk.bold(name));

        removeGitFolder(projectName);
        updateTextInFile(`./${projectName}/package.json`, 'boilerplate-experiments-threejs', projectName);
        updateTextInFile(`./${projectName}/index.html`, 'Boilerplate Experiments ThreeJS', projectName);
        updateTextInFile(`./${projectName}/src/Globals.ts`, 'boilerplate-experiments-threejs', projectName);
        console.log('2. Files updated');

        console.log('3. Installing packages:');
        console.log('───────────────────────');
        runNi(`./${projectName}/`);
    }

    function removeGitFolder(projectName) {
        fs.rmSync(`./${projectName}/.git`, { recursive: true, force: true }, (err) => {
            if (err) console.error('Error removing folder:', err);
        });
    }

    function updateTextInFile(path, searchValue, replaceValue) {
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
    }

    /**
     * Runs ni (from @antfu/ni) in the specified directory
     * @param {string} targetDir - The directory where ni should be run
     * @returns {Promise<void>}
     */
    function runNi(targetDir) {
        return new Promise((resolve, reject) => {
            // Normalize the path
            const normalizedPath = path.resolve(targetDir);

            // Determine the ni command based on the platform
            const niCmd = process.platform === 'win32' ? 'ni.cmd' : 'ni';

            // Spawn ni process
            const niProcess = spawn(niCmd, [], {
                cwd: normalizedPath,
                stdio: 'inherit', // This will pipe the output to the parent process
                env: {
                    ...process.env,
                    // Ensure PATH includes global npm binaries
                    PATH: `${process.env.PATH}:${process.env.npm_config_prefix}/bin`,
                },
            });

            niProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`ni failed with code ${code}`));
                } else {
                    resolve();
                }
            });

            niProcess.on('error', (error) => {
                if (error.code === 'ENOENT') {
                    reject(new Error('ni not found. Please install @antfu/ni first using: npm i -g @antfu/ni'));
                } else {
                    reject(new Error(`Failed to start ni: ${error.message}`));
                }
            });
        });
    }
})();