import path from 'path';
import { spawn } from 'child_process';

/**
 * Runs ni (from @antfu/ni) in the specified directory
 * @param {string} targetDir - The directory where ni should be run
 * @returns {Promise<void>}
 */
export default function runNi(targetDir) {
    return new Promise((resolve, reject) => {
        // Normalize the path
        const normalizedPath = path.resolve(targetDir);

        // On Windows, use npx to run ni, which handles .cmd files properly
        // On other platforms, use npx as well for consistency
        const niProcess = spawn('npx', ['-y', '@antfu/ni'], {
            cwd: normalizedPath,
            stdio: 'inherit', // This will pipe the output to the parent process
            shell: process.platform === 'win32', // Use shell on Windows for better compatibility
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