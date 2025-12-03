const fs = require('fs');
const { spawn } = require('child_process');
const { promptYamlFileName, generateHtml, generatePdf, formatFileName, getYamlFilePath } = require('./_utils');

// Build CV function
async function buildCv(yamlFileName, options = {}) {
  const outputDir = options.public ? 'public' : 'dist';
  const customPdfName = options.pdfName;

  // Generate HTML
  await generateHtml(yamlFileName);
  
  // Generate PDF
  await generatePdf(yamlFileName, outputDir, customPdfName);
  
  // For console output, use the filename (custom or default)
  const pdfFileName = customPdfName ? `${customPdfName}.pdf` : formatFileName(yamlFileName);
  console.log(`CV created successfully! File: ${outputDir}/${pdfFileName}`);
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
    // Determine operation mode and parse args
    const args = process.argv.slice(2);
    const mode = args[0] || 'build';
    
    // Parse options
    const options = {
      public: args.includes('public')
    };
    
    // Process the pdf-name=value parameter
    const pdfNameParam = args.find(arg => arg.startsWith('pdf-name='));
    if (pdfNameParam) {
      // Extract the value after the equals sign
      const value = pdfNameParam.substring(pdfNameParam.indexOf('=') + 1);
      
      // Handle the case with quotes ("my name with spaces")
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith('\'') && value.endsWith('\'')))
      {
        options.pdfName = value.substring(1, value.length - 1);
      } else {
        options.pdfName = value;
      }
    }
    
    // Remove option flags from args
    const filteredArgs = args.filter(arg => 
      arg !== 'public' && 
      !arg.startsWith('pdf-name=')
    );
    
    // Get YAML file name from args or prompt
    let yamlFileName;
    if (filteredArgs.length > 1 && filteredArgs[1]) {
      yamlFileName = filteredArgs[1];
      console.log(`Using YAML file: ${yamlFileName}`);
    } else {
      yamlFileName = await promptYamlFileName('YAML file name: ');
    }
    
    // Run appropriate mode
    if (mode === 'build') {
      await buildCv(yamlFileName, options);
    } else if (mode === 'dev') {
      await devMode(yamlFileName);
    } else {
      console.error(`Unknown mode: ${mode}`);
      console.log('Available modes: build, dev');
      console.log('Usage: node scripts/build.js [mode] [yaml-file-name] [options]');
      console.log('Options:');
      console.log('  public                Save PDF to public directory instead of dist');
      console.log('  pdf-name=NAME         Set custom name for output PDF file');
      process.exit(1);
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

main();
