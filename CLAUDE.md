# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zooi is a CLI toolkit for @zooizooi that provides boilerplates and utility scripts. It's published as an npm package and can be run with `zooi` or `z` commands.

## Development Commands

- **Run the tool**: `node main.js` or `npm run run`
- **Test locally**: Use the bin commands `zooi` or `z` after installation
- **Lint**: The project uses `@zooizooi/eslint-config` - check eslint.config.js for configuration

## Architecture

### Core Structure
- `main.js` - Entry point with interactive prompts using the `prompts` library
- `boilerplates.js` - Configuration for available project boilerplates
- `scripts.js` - Configuration for utility scripts
- `run.cmd` - Windows batch file that serves as the CLI entry point

### Two Main Functions
1. **Boilerplates**: Clones repositories and customizes them for new projects
   - Supports 'basic' and 'threejs-experiment' boilerplates
   - Uses simple-git for cloning
   - Customizes files via helper functions

2. **Scripts**: Utility functions like emptying the recycle bin
   - Currently includes 'empty-bin' script for Windows

### Helper Functions (helpers/)
- `updateTextInFile.js` - Find and replace text in files
- `removeGitFolder.js` - Removes .git directory from cloned repos  
- `removeFile.js` - File deletion utility
- `runNi.js` - Runs package installation

### Boilerplate Process
When creating a boilerplate, the tool:
1. Clones the specified repository
2. Removes the .git folder
3. Updates package.json, index.html, and other files with project name
4. Removes the README.md
5. Installs packages using ni

## Dependencies
- `prompts` - Interactive CLI prompts
- `simple-git` - Git operations
- `chalk` - Terminal styling
- `@zooizooi/eslint-config` - ESLint configuration
- `globals` - Global variable definitions for ESLint