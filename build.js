import esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isWatch = process.argv.includes('--watch');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy all files from root to dist except those that will be processed
const excludeFiles = ['script.js', 'styles.css', 'node_modules', 'dist', '.git'];

function copyStaticFiles() {
  const files = fs.readdirSync(__dirname);
  files.forEach(file => {
    if (!excludeFiles.includes(file)) {
      const srcPath = path.join(__dirname, file);
      const destPath = path.join(distDir, file);
      
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        // Skip copying directories for now to avoid recursion
      } else if (!file.endsWith('.js') && !file.endsWith('.css')) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
}

// Minify and bundle JavaScript
async function buildJS() {
  await esbuild.build({
    entryPoints: ['script.js'],
    bundle: true,
    minify: true,
    target: 'es2020',
    outfile: 'dist/script.min.js',
    sourcemap: !isWatch,
    watch: isWatch ? {
      onRebuild(error) {
        if (error) console.error('Build failed:', error);
        else console.log('Build succeeded');
      }
    } : false,
  });
}

// Minify CSS
async function buildCSS() {
  await esbuild.build({
    entryPoints: ['styles.css'],
    minify: true,
    outfile: 'dist/styles.min.css',
    watch: isWatch ? {
      onRebuild(error) {
        if (error) console.error('CSS build failed:', error);
        else console.log('CSS build succeeded');
      }
    } : false,
  });
}

// Update HTML files to reference minified assets
function updateHTML() {
  const htmlFiles = ['index.html', '404.html'];
  
  htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace script.js with minified version
      content = content.replace(
        /<script\s+[^>]*src=["'](?!https?\:\/\/)([^"']+\.js)["'][^>]*>\s*<\/script>/g,
        (match, src) => {
          if (src === 'script.js') {
            return '<script defer src="script.min.js"></script>';
          }
          return match;
        }
      );
      
      // Replace styles.css with minified version
      content = content.replace(
        /<link\s+[^>]*href=["'](?!https?\:\/\/)([^"']+\.css)["'][^>]*>/g,
        (match, href) => {
          if (href === 'styles.css') {
            return '<link rel="stylesheet" href="styles.min.css">';
          }
          return match;
        }
      );
      
      // Write to dist directory
      fs.writeFileSync(path.join(distDir, file), content);
    }
  });
}

// Main build function
async function build() {
  try {
    console.log('Starting build process...');
    
    // Copy static files first
    console.log('Copying static files...');
    copyStaticFiles();
    
    // Build JavaScript and CSS in parallel
    console.log('Building JavaScript and CSS...');
    await Promise.all([buildJS(), buildCSS()]);
    
    // Update HTML files
    console.log('Updating HTML files...');
    updateHTML();
    
    console.log('Build completed successfully!');
    
    if (isWatch) {
      console.log('Watching for changes...');
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();
