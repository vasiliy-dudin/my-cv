const readline = require('readline');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Prompts the user for YAML file name
 * @param {string} prompt - Prompt text
 * @returns {Promise<string>} YAML file name
 */
function promptYamlFileName(prompt = 'Enter YAML file name: ') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (yamlFile) => {
      rl.close();
      const yamlFileName = yamlFile.trim() || 'default';
      resolve(yamlFileName);
    });
  });
}

/**
 * Runs an external process and returns a Promise
 * @param {string} command - Command to run
 * @param {string[]} args - Command arguments
 * @param {string} errorMessage - Error message
 * @returns {Promise<void>} 
 */
function runProcess(command, args, errorMessage) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code !== 0) {
        console.error(errorMessage);
        reject(new Error(`Process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Formats a filename based on YAML file name
 * @param {string} yamlFileName - YAML file name
 * @param {string} extension - File extension
 * @returns {string} Formatted filename
 */
function formatFileName(yamlFileName, extension = '.pdf') {
  return `${yamlFileName}${extension}`;
}

/**
 * Generates HTML from YAML file
 * @param {string} yamlFileName - YAML file name
 * @returns {Promise<void>}
 */
function generateHtml(yamlFileName) {
  return runProcess('node', ['scripts/_generate_html.js', yamlFileName], 'Error generating HTML');
}

/**
 * Generates PDF from HTML file
 * @param {string} yamlFileName - YAML file name
 * @param {string} outputDir - Output directory (default: dist)
 * @param {string} customPdfName - Custom name for PDF file (optional)
 * @returns {Promise<void>}
 */
function generatePdf(yamlFileName, outputDir = 'dist', customPdfName = null) {
  // If the filename contains spaces, wrap it in quotes
  let pdfNameArg = '';
  if (customPdfName) {
    const escapedName = customPdfName.includes(' ') ? 
      `"${customPdfName.replace(/"/g, '\\"')}"` : 
      customPdfName;
    pdfNameArg = ` ${escapedName}`;
  }
  
  return runProcess(
    'wsl',
    ['bash', '-c', `source venv/bin/activate && python scripts/_generate_pdf.py ${yamlFileName} ${outputDir}${pdfNameArg}`],
    'Error generating PDF'
  );
}

/**
 * Checks if YAML file exists
 * @param {string} yamlFileName - YAML file name
 * @returns {boolean} Whether file exists
 */
function yamlFileExists(yamlFileName) {
  const yamlFileNameFull = formatFileName(yamlFileName, '.yaml');
  const yamlFilePath = path.join(__dirname, '..', 'src', 'data', yamlFileNameFull);
  return fs.existsSync(yamlFilePath);
}

/**
 * Gets path to YAML file
 * @param {string} yamlFileName - YAML file name
 * @returns {string} Path to file
 */
function getYamlFilePath(yamlFileName) {
  const yamlFileNameFull = formatFileName(yamlFileName, '', '.yaml');
  return path.join('src', 'data', yamlFileNameFull);
}

// Export functions
module.exports = {
  promptYamlFileName,
  runProcess,
  formatFileName,
  generateHtml,
  generatePdf,
  yamlFileExists,
  getYamlFilePath
};
