const fs = require("fs-extra");
const path = require("path");
const nunjucks = require("nunjucks");
const { minify } = require("html-minifier-terser");
const yaml = require('js-yaml');

// Get company name from command line arguments
const companyName = process.argv[2] || 'default';

const srcDir = path.join(__dirname, "..", "src", "views");
const outDir = path.join(__dirname, "..", ".tmp");
const dataDir = path.join(__dirname, "..", "src", "data");
const stylesDir = path.join(srcDir, "styles");

// Configure Nunjucks
nunjucks.configure(srcDir, { autoescape: true });

// Ensure the output directory exists
fs.ensureDirSync(outDir);

// Determine which CV file to use based on company name
const cvFileName = `cv${companyName !== 'default' ? `-${companyName}` : ''}.yaml`;
const cvFilePath = path.join(dataDir, cvFileName);

// Check if the company-specific CV file exists, otherwise use default
let actualCvFilePath = cvFilePath;
if (!fs.existsSync(cvFilePath) && companyName !== 'default') {
    console.warn(`Warning: CV file for company "${companyName}" not found at ${cvFilePath}. Using default cv.yaml instead.`);
    actualCvFilePath = path.join(dataDir, "cv.yaml");
}

// Read YAML data
const cvData = yaml.load(
	fs.readFileSync(actualCvFilePath, "utf8")
);
const siteData = yaml.load(
	fs.readFileSync(path.join(dataDir, "site.yaml"), "utf8")
);

// Имя компании используется только для выбора YAML файла

// Merge private data if exists
const privateDataPath = path.join(dataDir, "cv.private.yaml");
if (fs.existsSync(privateDataPath)) {
	const privateData = yaml.load(fs.readFileSync(privateDataPath, "utf8"));
	// Deep merge: private data overrides public data
	Object.assign(cvData.personal, privateData.personal);
}

// Combine data
const data = {
	cv: cvData,
	site: siteData,
};

// Minification options
const minifyOptions = {
	collapseWhitespace: true,
	removeComments: true,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeTagWhitespace: true,
	useShortDoctype: true,
	minifyCSS: true,
};

// Compile and minify a template
async function compileAndMinifyTemplate(templatePath, outputPath) {
	const renderedHtml = nunjucks.render(path.basename(templatePath), {
		cv: cvData,
		site: siteData,
	});
	// Skip minification in dev mode for Vite compatibility
	const isDev = process.env.NODE_ENV !== "production";
	const html = isDev ? renderedHtml : await minify(renderedHtml, minifyOptions);
	fs.writeFileSync(outputPath, html);
	console.log(`Compiled ${isDev ? "" : "and minified "}${outputPath}`);
}

// Copy styles to output directory
function copyStyles() {
	const outStylesDir = path.join(outDir, "styles");
	fs.ensureDirSync(outStylesDir);
	fs.copySync(stylesDir, outStylesDir, { overwrite: true });
	console.log(`Copied styles to: ${outStylesDir}`);
}

// Compile and minify index.njk
(async () => {
	copyStyles();
	await compileAndMinifyTemplate(
		path.join(srcDir, "index.njk"),
		path.join(outDir, "index.html"),
		data
	);
	// Add more templates if you need
})();
