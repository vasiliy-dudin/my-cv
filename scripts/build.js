const fs = require('fs');
const { spawn } = require('child_process');
const { promptYamlFileName, generateHtml, generatePdf, formatFileName, getYamlFilePath } = require('./_utils');

// Build CV function
async function buildCv(yamlFileName) {
  // Generate HTML
  await generateHtml(yamlFileName);
  
  // Generate PDF
  await generatePdf(yamlFileName);
  
  const outputFileName = formatFileName(yamlFileName);
  console.log(`CV created successfully! File: dist/${outputFileName}`);
}

// Development mode function
async function devMode(yamlFileName) {
  // Generate HTML
  await generateHtml(yamlFileName);
  
  console.log('Starting Vite preview server...');
  
  // Start Vite preview
  const viteProcess = spawn('pnpm', ['exec', 'vite'], {stdio: 'inherit'});
  
  // Get YAML file path
  const yamlFilePath = getYamlFilePath(yamlFileName);
  console.log(`Watching for changes in: ${yamlFilePath}`);
  
  // Watch for changes in YAML file
  fs.watch(yamlFilePath, async (eventType) => {
    if (eventType === 'change') {
      console.log(`Changes detected in ${yamlFilePath}, regenerating HTML...`);
      try {
        await generateHtml(yamlFileName);
        console.log('HTML updated successfully');
      } catch (err) {
        console.error(`Error updating HTML: ${err.message}`);
      }
    }
  });
  
  // Handle Vite process termination
  viteProcess.on('close', (code) => {
    console.log('Vite server stopped');
    process.exit(code);
  });
}

// Main function
async function main() {
  try {
    // Determine operation mode
    const args = process.argv.slice(2);
    const mode = args[0] || 'build';
    
    // Get YAML file name from args or prompt
    let yamlFileName;
    if (args.length > 1 && args[1]) {
      yamlFileName = args[1];
      console.log(`Using YAML file: cv-${yamlFileName}`);
    } else {
      yamlFileName = await promptYamlFileName('YAML file name: cv-');
    }
    
    // Run appropriate mode
    if (mode === 'build') {
      await buildCv(yamlFileName);
    } else if (mode === 'dev') {
      await devMode(yamlFileName);
    } else {
      console.error(`Unknown mode: ${mode}`);
      console.log('Available modes: build, dev');
      console.log('Usage: node scripts/build.js [mode] [yaml-file-name]');
      process.exit(1);
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

main();
