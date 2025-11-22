// Vendor
import prompts from 'prompts';
import simpleGit from 'simple-git';
import chalk from 'chalk';

// Helpers
import removeGitFolder from './helpers/removeGitFolder.js';
import updateTextInFile from './helpers/updateTextInFile.js';
import removeFile from './helpers/removeFile.js';
import runNi from './helpers/runNi.js';

// Options
import boilerplates from './boilerplates.js';
import scripts from './scripts.js';
import emptyBin from './scripts/empty-bin.js';

(async () => {
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
        switch (response.scripts) {
            case 'empty-bin': emptyBin();
        }
    }

    async function setupBoilerplate(name, projectName) {
        switch (name) {
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
        updateTextInFile(`./${projectName}/src/modules/Globals.ts`, 'boilerplate-experiments-threejs', projectName);
        removeFile(`./${projectName}/README.md`);
        console.log('2. Files updated');

        console.log('3. Installing packages:');
        console.log('───────────────────────');
        runNi(`./${projectName}/`);
    }
})();