#!/usr/bin/env node

/**
 * PWA Manifest Validator
 *
 * Validates manifest.json against all PWA installability requirements.
 * Run with: node validate-pwa.js
 *
 * Checks:
 * - Required fields: name, short_name, icons, start_url, display
 * - Icon sizes include 192x192 and 512x512
 * - All icon files exist on filesystem
 * - start_url is valid format
 * - display mode is appropriate
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
};

const checkmark = '\u2705';
const crossmark = '\u274c';

class PWAValidator {
  constructor(manifestPath = './manifest.json', projectRoot = '.') {
    this.manifestPath = manifestPath;
    this.projectRoot = projectRoot;
    this.manifest = null;
    this.results = [];
    this.passCount = 0;
    this.failCount = 0;
  }

  /**
   * Main validation entry point
   */
  validate() {
    console.log(`${colors.bold}PWA Manifest Validation Report${colors.reset}`);
    console.log('='.repeat(48));

    // Step 1: Load and parse manifest
    if (!this.loadManifest()) {
      return this.printResults();
    }

    // Step 2: Run validation checks
    this.checkName();
    this.checkShortName();
    this.checkIcons();
    this.checkStartUrl();
    this.checkDisplay();

    this.printResults();
    return this.failCount === 0;
  }

  /**
   * Load and parse manifest.json
   */
  loadManifest() {
    try {
      const absolutePath = path.resolve(this.manifestPath);
      const content = fs.readFileSync(absolutePath, 'utf-8');
      this.manifest = JSON.parse(content);
      return true;
    } catch (error) {
      console.error(`${crossmark} ${colors.red}Failed to load manifest.json${colors.reset}`);
      console.error(`   Error: ${error.message}`);
      this.failCount++;
      return false;
    }
  }

  /**
   * Check if 'name' field exists and is non-empty
   */
  checkName() {
    const name = this.manifest?.name;
    if (name && typeof name === 'string' && name.trim().length > 0) {
      this.addPass(`name: "${name}"`);
    } else {
      this.addFail('name: Missing or empty');
    }
  }

  /**
   * Check if 'short_name' field exists and is non-empty
   */
  checkShortName() {
    const shortName = this.manifest?.short_name;
    if (shortName && typeof shortName === 'string' && shortName.trim().length > 0) {
      this.addPass(`short_name: "${shortName}"`);
    } else {
      this.addFail('short_name: Missing or empty');
    }
  }

  /**
   * Check icons array and required sizes (192x192 and 512x512)
   */
  checkIcons() {
    const icons = this.manifest?.icons;

    // Check if icons array exists and has items
    if (!Array.isArray(icons) || icons.length === 0) {
      this.addFail('icons: Missing or empty array');
      return;
    }

    this.addPass(`icons: ${icons.length} ${icons.length === 1 ? 'icon' : 'icons'} defined`);

    // Check for required 192x192
    const has192 = this.checkIconSize(icons, '192x192', 192);
    if (has192) {
      this.addPass('Required icon 192x192: EXISTS');
    } else {
      this.addFail('Required icon 192x192: MISSING');
    }

    // Check for required 512x512
    const has512 = this.checkIconSize(icons, '512x512', 512);
    if (has512) {
      this.addPass('Required icon 512x512: EXISTS');
    } else {
      this.addFail('Required icon 512x512: MISSING');
    }
  }

  /**
   * Verify icon of specific size exists in array and file exists
   */
  checkIconSize(icons, sizeString, pixelSize) {
    const icon = icons.find((i) => i.sizes === sizeString);

    if (!icon) {
      return false;
    }

    // Verify file exists
    if (!this.fileExists(icon.src)) {
      return false;
    }

    return true;
  }

  /**
   * Check if file exists on filesystem
   */
  fileExists(filePath) {
    try {
      // Remove leading slash if present to make path relative to project root
      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const absolutePath = path.resolve(this.projectRoot, cleanPath);
      return fs.existsSync(absolutePath);
    } catch {
      return false;
    }
  }

  /**
   * Check if start_url is valid
   */
  checkStartUrl() {
    const startUrl = this.manifest?.start_url;

    if (!startUrl || typeof startUrl !== 'string') {
      this.addFail('start_url: Missing or invalid type');
      return;
    }

    // Valid start_url should be a path (starts with / or ./)
    if (/^(\/|\.\/|https?:\/\/)/.test(startUrl)) {
      this.addPass(`start_url: "${startUrl}"`);
    } else {
      this.addFail(`start_url: Invalid format "${startUrl}"`);
    }
  }

  /**
   * Check if display mode is appropriate for PWA
   */
  checkDisplay() {
    const display = this.manifest?.display;
    const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];

    if (!display || typeof display !== 'string') {
      this.addFail('display: Missing or invalid type');
      return;
    }

    if (validDisplayModes.includes(display)) {
      this.addPass(`display: "${display}"`);
    } else {
      this.addFail(`display: Invalid mode "${display}"`);
    }
  }

  /**
   * Record a passing check
   */
  addPass(message) {
    this.results.push({ status: 'pass', message });
    this.passCount++;
  }

  /**
   * Record a failing check
   */
  addFail(message) {
    this.results.push({ status: 'fail', message });
    this.failCount++;
  }

  /**
   * Print validation results to console
   */
  printResults() {
    // Print all results
    for (const result of this.results) {
      const icon = result.status === 'pass' ? checkmark : crossmark;
      const color = result.status === 'pass' ? colors.green : colors.red;
      console.log(`${color}${icon} ${result.message}${colors.reset}`);
    }

    // Print summary
    const totalChecks = this.passCount + this.failCount;
    const summaryIcon = this.failCount === 0 ? checkmark : crossmark;
    const summaryColor = this.failCount === 0 ? colors.green : colors.red;
    const overallStatus = this.failCount === 0 ? 'PASS' : 'FAIL';

    console.log('');
    console.log(`${colors.bold}Overall: ${summaryColor}${summaryIcon} ${overallStatus} (${this.passCount}/${totalChecks} checks)${colors.reset}`);

    // Exit with appropriate code
    process.exit(this.failCount === 0 ? 0 : 1);
  }
}

// Parse command-line arguments
// Usage: node validate-pwa.js [manifest-path] [project-root]
const args = process.argv.slice(2);
const manifestPath = args[0] || './manifest.json';
const projectRoot = args[1] || '.';

// Run validator
const validator = new PWAValidator(manifestPath, projectRoot);
validator.validate();
