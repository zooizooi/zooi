const config = require('@zooizooi/eslint-config');
const globals = require('globals');

module.exports = [
    ...config.vanilla,
    {
        languageOptions: {
            globals: {
              ...globals.node,  // Add Node.js globals
            },
        }
    },
];