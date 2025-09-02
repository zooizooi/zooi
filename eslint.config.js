import config from '@zooizooi/eslint-config';
import globals from 'globals';

export default [
    ...config.vanilla,
    {
        languageOptions: {
            globals: {
              ...globals.node,  // Add Node.js globals
            },
        }
    },
];