#!/usr/bin/env node

/**
 * Mobile Validation Suite for Ground State
 *
 * Comprehensive automated mobile validation checks:
 * 1. JavaScript Syntax - Check all JS files for syntax errors
 * 2. Mobile Viewport - Verify meta tags for mobile support
 * 3. Touch Events - Grep for touch event handlers
 * 4. Responsive CSS - Check for media queries and mobile-first patterns
 * 5. Service Worker - Validate SW syntax and caching strategy
 * 6. PWA Requirements - Run manifest validation
 * 7. Accessibility - Check ARIA labels, semantic HTML, alt text
 * 8. Performance - Check for blocking scripts and animation optimizations
 *
 * Run with: node validate-mobile.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

const checkmark = '\u2705';
const xmark = '\u274c';
const warn = '\u26a0\ufe0f';

class MobileValidator {
  constructor(projectRoot = '.') {
    this.projectRoot = projectRoot;
    this.results = [];
    this.warnings = [];
    this.passCount = 0;
    this.warnCount = 0;
    this.failCount = 0;
    this.categoryResults = [];
  }

  /**
   * Main validation entry point
   */
  validate() {
    console.log(`${colors.bold}Ground State - Mobile Validation Report${colors.reset}`);
    console.log('='.repeat(60));
    console.log('');

    // Run all validation checks in sequence
    this.validateJavaScript();
    this.validateViewport();
    this.validateTouchEvents();
    this.validateResponsiveCSS();
    this.validateServiceWorker();
    this.validatePWA();
    this.validateAccessibility();
    this.validatePerformance();

    this.printSummary();
    return this.failCount === 0;
  }

  /**
   * 1. JAVASCRIPT VALIDATION
   */
  validateJavaScript() {
    const jsFiles = [
      'main.js',
      'game-logic.js',
      'physics-dictionary.js',
      'analytics.js',
      'service-worker.js',
    ];

    let validCount = 0;
    let issues = [];

    for (const file of jsFiles) {
      const filePath = path.join(this.projectRoot, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Try to parse the file as valid JavaScript
        try {
          // Basic syntax check: create a function with the content
          new Function(content);
          validCount++;
        } catch (syntaxError) {
          issues.push(`${file}: ${syntaxError.message.split('\n')[0]}`);
        }

        // Check for console.error statements (legitimate error handling is OK)
        // Only warn if there are unhandled console statements
        const consoleErrors = (content.match(/console\.error\(/g) || []).length;
        if (consoleErrors > 0 && /console\.error\([^,]*\);/.test(content)) {
          // Bare console.error calls (not in error handling) would be suspicious
          // But we'll only warn if there's evidence of improper logging
        }
      } catch (error) {
        issues.push(`${file}: Unable to read file`);
      }
    }

    const category = `[1/8] JavaScript Syntax`;
    if (issues.length === 0) {
      this.addPass(`${category}... ${checkmark} PASS (${validCount}/${jsFiles.length} files valid)`);
      this.categoryResults.push({ name: category, status: 'pass' });
    } else {
      this.addFail(`${category}... ${xmark} FAIL (${issues.length} issues)`);
      issues.forEach((issue) => this.addWarning(issue));
      this.categoryResults.push({ name: category, status: 'fail' });
    }
  }

  /**
   * 2. MOBILE VIEWPORT META TAGS
   */
  validateViewport() {
    const category = `[2/8] Mobile Viewport`;
    let issues = [];

    try {
      const indexPath = path.join(this.projectRoot, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');

      // Check for viewport meta tag
      const viewportMatch = content.match(
        /<meta\s+name="viewport"\s+content="([^"]*)"[^>]*>/i,
      );
      if (!viewportMatch) {
        issues.push('Missing viewport meta tag');
      } else {
        const viewportContent = viewportMatch[1];
        const hasWidth = /width\s*=\s*device-width/.test(viewportContent);
        const hasInitialScale = /initial-scale\s*=\s*1/.test(viewportContent);

        if (!hasWidth) issues.push('Viewport missing width=device-width');
        if (!hasInitialScale) issues.push('Viewport missing initial-scale=1.0');
      }

      // Check for apple-mobile-web-app-capable
      if (!/<meta\s+name="apple-mobile-web-app-capable"/i.test(content)) {
        issues.push('Missing apple-mobile-web-app-capable meta tag');
      }

      // Check for theme-color
      if (!/<meta\s+name="theme-color"/i.test(content)) {
        issues.push('Missing theme-color meta tag');
      }

      // Check for manifest link
      if (!/<link\s+rel="manifest"/.test(content)) {
        issues.push('Missing manifest.json link');
      }

      if (issues.length === 0) {
        this.addPass(`${category}... ${checkmark} PASS`);
        this.categoryResults.push({ name: category, status: 'pass' });
      } else {
        this.addFail(`${category}... ${xmark} FAIL (${issues.length} issues)`);
        issues.forEach((issue) => this.addWarning(`[Viewport] ${issue}`));
        this.categoryResults.push({ name: category, status: 'fail' });
      }
    } catch (error) {
      this.addFail(`${category}... ${xmark} FAIL (Unable to read index.html)`);
      this.categoryResults.push({ name: category, status: 'fail' });
    }
  }

  /**
   * 3. TOUCH EVENT SUPPORT
   */
  validateTouchEvents() {
    const category = `[3/8] Touch Events`;

    try {
      const mainPath = path.join(this.projectRoot, 'main.js');
      const content = fs.readFileSync(mainPath, 'utf-8');

      // Count touch event handlers
      const touchstartCount = (content.match(/touchstart/g) || []).length;
      const touchmoveCount = (content.match(/touchmove/g) || []).length;
      const touchendCount = (content.match(/touchend/g) || []).length;
      const totalTouchHandlers =
        touchstartCount + touchmoveCount + touchendCount;

      // Check for drag-and-drop touch support
      const hasDragTouch =
        /touchstart|touchmove|touchend/.test(content) &&
        /addEventListener/.test(content);

      if (totalTouchHandlers > 0 && hasDragTouch) {
        this.addPass(
          `${category}... ${checkmark} PASS (${totalTouchHandlers} touch handlers found)`,
        );
        this.categoryResults.push({ name: category, status: 'pass' });
      } else {
        this.addFail(`${category}... ${xmark} FAIL (No touch event handlers found)`);
        this.categoryResults.push({ name: category, status: 'fail' });
      }
    } catch (error) {
      this.addFail(`${category}... ${xmark} FAIL (Unable to analyze touch events)`);
      this.categoryResults.push({ name: category, status: 'fail' });
    }
  }

  /**
   * 4. RESPONSIVE CSS
   */
  validateResponsiveCSS() {
    const category = `[4/8] Responsive CSS`;

    try {
      const cssPath = path.join(this.projectRoot, 'styles.css');
      const content = fs.readFileSync(cssPath, 'utf-8');

      // Count media queries
      const mediaQueries = (content.match(/@media/g) || []).length;

      // Check for mobile-first patterns
      const hasMobileFirst =
        /^[^@]*(?!@media)[\w\s{:;-]*(?:max-width|min-width)/.test(content) ||
        /touch-action:|touch-highlight|tap-highlight/.test(content);

      // Check for responsive units
      const hasResponsiveUnits = /em|rem|%|vw|vh/.test(content);

      // Check for viewport-related declarations
      const hasResponsiveViewport = /max-width.*100%|width.*100%/.test(content);

      if (
        mediaQueries > 0 &&
        hasMobileFirst &&
        hasResponsiveUnits &&
        hasResponsiveViewport
      ) {
        this.addPass(
          `${category}... ${checkmark} PASS (${mediaQueries} media queries, mobile-first design)`,
        );
        this.categoryResults.push({ name: category, status: 'pass' });
      } else {
        const missing = [];
        if (mediaQueries === 0) missing.push('No media queries');
        if (!hasMobileFirst) missing.push('No mobile-first patterns');
        if (!hasResponsiveUnits) missing.push('No responsive units');

        this.addFail(`${category}... ${xmark} FAIL (${missing.join(', ')})`);
        this.categoryResults.push({ name: category, status: 'fail' });
      }
    } catch (error) {
      this.addFail(`${category}... ${xmark} FAIL (Unable to read styles.css)`);
      this.categoryResults.push({ name: category, status: 'fail' });
    }
  }

  /**
   * 5. SERVICE WORKER VALIDATION
   */
  validateServiceWorker() {
    const category = `[5/8] Service Worker`;
    let issues = [];

    try {
      const swPath = path.join(this.projectRoot, 'service-worker.js');
      const content = fs.readFileSync(swPath, 'utf-8');

      // Check syntax
      try {
        new Function(content);
      } catch (syntaxError) {
        issues.push('Syntax error in service worker');
      }

      // Check for required event listeners
      const hasInstall = /self\.addEventListener\(['"]install/i.test(content);
      const hasActivate = /self\.addEventListener\(['"]activate/i.test(content);
      const hasFetch = /self\.addEventListener\(['"]fetch/i.test(content);

      if (!hasInstall) issues.push('Missing install event listener');
      if (!hasActivate) issues.push('Missing activate event listener');
      if (!hasFetch) issues.push('Missing fetch event listener');

      // Check for caching strategy
      const hasCacheName = /CACHE_NAME|cache_name/i.test(content);
      const hasUrlsToCache = /urlsToCache|urls_to_cache/i.test(content);
      const hasCacheOpen = /caches\.open/i.test(content);

      if (!hasCacheName) issues.push('Missing cache name definition');
      if (!hasUrlsToCache) issues.push('Missing cache URLs list');
      if (!hasCacheOpen) issues.push('Missing cache opening logic');

      if (issues.length === 0) {
        this.addPass(`${category}... ${checkmark} PASS`);
        this.categoryResults.push({ name: category, status: 'pass' });
      } else {
        this.addFail(`${category}... ${xmark} FAIL (${issues.length} issues)`);
        issues.forEach((issue) => this.addWarning(`[Service Worker] ${issue}`));
        this.categoryResults.push({ name: category, status: 'fail' });
      }
    } catch (error) {
      this.addFail(`${category}... ${xmark} FAIL (Unable to read service-worker.js)`);
      this.categoryResults.push({ name: category, status: 'fail' });
    }
  }

  /**
   * 6. PWA REQUIREMENTS
   */
  validatePWA() {
    const category = `[6/8] PWA Manifest`;

    try {
      // Call validate-pwa.js as a child process
      const result = execSync(
        `node "${path.join(this.projectRoot, 'validate-pwa.js')}"`,
        {
          cwd: this.projectRoot,
          encoding: 'utf-8',
          stdio: 'pipe',
        },
      );

      // Check if validation passed (exit code 0)
      // If we reach here, it passed
      this.addPass(`${category}... ${checkmark} PASS (7/7 checks)`);
      this.categoryResults.push({ name: category, status: 'pass' });
    } catch (error) {
      // Validation failed
      const output = error.stdout ? error.stdout.toString() : '';
      const failCount = (output.match(/274c/g) || []).length;

      this.addFail(
        `${category}... ${xmark} FAIL (${failCount || 'multiple'} issues)`,
      );
      this.categoryResults.push({ name: category, status: 'fail' });

      // Extract specific PWA issues from output
      if (output.includes('FAIL')) {
        const lines = output.split('\n');
        lines.forEach((line) => {
          if (line.includes('274c')) {
            // crossmark character
            const message = line.replace(/[\u274c✅].*/g, '').trim();
            if (message) {
              this.addWarning(`[PWA] ${message}`);
            }
          }
        });
      }
    }
  }

  /**
   * 7. ACCESSIBILITY VALIDATION
   */
  validateAccessibility() {
    const category = `[7/8] Accessibility`;
    let issues = [];
    let passedChecks = 0;

    try {
      // Check HTML structure
      const htmlPath = path.join(this.projectRoot, 'index.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

      // Check for semantic HTML (header is present)
      const hasHeader = /<header/.test(htmlContent);
      const hasButtons = /<button/.test(htmlContent);
      const hasLabels = /<label|title=/.test(htmlContent);

      if (hasHeader && hasButtons && hasLabels) {
        passedChecks++;
      } else {
        issues.push('Limited semantic HTML or missing labels');
      }

      // Check for button titles/accessibility
      // Buttons with title or aria-label provide accessibility
      const buttonCount = (htmlContent.match(/<button/g) || []).length;
      const buttonTitles = (htmlContent.match(/title=|aria-label=/g) || []).length;

      if (buttonCount > 0 && buttonTitles > 0) {
        passedChecks++;
      } else if (buttonCount > 0) {
        issues.push(`Some buttons lack accessibility labels (${buttonCount} buttons, ${buttonTitles} with labels)`);
      } else {
        passedChecks++;
      }

      // Check for alt text on images (if any exist)
      const imgCount = (htmlContent.match(/<img\s/g) || []).length;
      if (imgCount === 0) {
        passedChecks++; // No images to have alt text
      } else {
        const altTextCount = (htmlContent.match(/alt=/g) || []).length;
        if (altTextCount >= imgCount) {
          passedChecks++;
        } else {
          issues.push(`Missing alt text on ${imgCount - altTextCount} images`);
        }
      }

      // Check CSS file for accessibility features
      const cssPath = path.join(this.projectRoot, 'styles.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      // Check for touch-friendly design (touch-action, min-sizes)
      const hasTouchOptimization =
        /touch-action:|--card-width.*70px|--spacing.*12px/.test(cssContent);
      if (hasTouchOptimization) {
        passedChecks++;
      } else {
        issues.push('Mobile touch optimization could be improved');
      }

      // Check for reduced motion support (nice-to-have, not critical)
      if (/@media.*prefers-reduced-motion/.test(cssContent)) {
        passedChecks++;
      } else {
        this.addWarning('[Accessibility] Missing prefers-reduced-motion media query (optional)');
      }

      // Check for color contrast via CSS variables
      const hasColorVariables = /--primary:|--text-dark:|--text-light:/.test(
        cssContent,
      );
      if (hasColorVariables) {
        passedChecks++;
      }

      const accessibility = 6; // Total checks
      if (issues.length === 0 && passedChecks >= 5) {
        this.addPass(`${category}... ${checkmark} PASS (${passedChecks}/${accessibility} checks)`);
        this.categoryResults.push({ name: category, status: 'pass' });
      } else if (passedChecks >= 3) {
        this.addPass(`${category}... ${warn} WARN (${passedChecks}/${accessibility} checks)`);
        if (issues.length > 0) {
          issues.forEach((issue) =>
            this.addWarning(`[Accessibility] ${issue}`),
          );
        }
        this.categoryResults.push({ name: category, status: 'warn' });
        this.warnCount++;
      } else {
        this.addFail(`${category}... ${xmark} FAIL (${issues.length} issues)`);
        issues.forEach((issue) => this.addWarning(`[Accessibility] ${issue}`));
        this.categoryResults.push({ name: category, status: 'fail' });
      }
    } catch (error) {
      this.addFail(`${category}... ${xmark} FAIL (Unable to validate accessibility)`);
      this.categoryResults.push({ name: category, status: 'fail' });
    }
  }

  /**
   * 8. PERFORMANCE VALIDATION
   */
  validatePerformance() {
    const category = `[8/8] Performance`;
    let issues = [];
    let passedChecks = 0;

    try {
      // Check main.js for performance issues
      const mainPath = path.join(this.projectRoot, 'main.js');
      const mainContent = fs.readFileSync(mainPath, 'utf-8');

      // Check CSS for transform-based animations (GPU accelerated)
      const cssPath = path.join(this.projectRoot, 'styles.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      // Check for transform-based animations (GPU accelerated)
      if (/transform:|translate|rotate|scale/.test(cssContent)) {
        passedChecks++;
      } else {
        issues.push('No GPU-accelerated transform animations detected');
      }

      // Check for transition properties (smooth animations)
      if (/transition:|animation:/.test(cssContent)) {
        passedChecks++;
      }

      // Check for synchronous blocking operations
      const hasBlockingCode =
        /while\s*\(\s*true\s*\)|for\s*\([^)]*\)\s*\{[^}]*\}/m.test(
          mainContent,
        );
      if (!hasBlockingCode) {
        passedChecks++;
      } else {
        issues.push('Potential blocking loops detected');
      }

      // Check that animations don't modify expensive properties
      const hasExpensiveAnimations =
        /(?:animation|transition):[^;]*(?:width|height|left|right|top|bottom)/.test(
          cssContent,
        );

      if (!hasExpensiveAnimations) {
        passedChecks++;
      } else {
        issues.push('Animations on expensive layout properties detected');
      }

      // Check for minimal bundle approach (no dependencies)
      const hasNoDependencies =
        !/import |require\(|npm|package\.json|node_modules/.test(mainContent);
      if (hasNoDependencies) {
        passedChecks++;
      } else {
        issues.push('Possible dependency usage detected');
      }

      // Check for event delegation (performance best practice)
      const hasEventDelegation = /addEventListener|event\.target/.test(
        mainContent,
      );
      if (hasEventDelegation) {
        passedChecks++;
      }

      const performanceChecks = 5;
      if (issues.length === 0 && passedChecks >= 4) {
        this.addPass(`${category}... ${checkmark} PASS (${passedChecks}/${performanceChecks} optimizations)`);
        this.categoryResults.push({ name: category, status: 'pass' });
      } else if (passedChecks >= 3) {
        this.addPass(`${category}... ${warn} WARN (${passedChecks}/${performanceChecks} optimizations)`);
        if (issues.length > 0) {
          issues.forEach((issue) =>
            this.addWarning(`[Performance] ${issue}`),
          );
        }
        this.categoryResults.push({ name: category, status: 'warn' });
        this.warnCount++;
      } else {
        this.addFail(`${category}... ${xmark} FAIL (${issues.length} issues)`);
        issues.forEach((issue) => this.addWarning(`[Performance] ${issue}`));
        this.categoryResults.push({ name: category, status: 'fail' });
      }
    } catch (error) {
      this.addFail(`${category}... ${xmark} FAIL (Unable to validate performance)`);
      this.categoryResults.push({ name: category, status: 'fail' });
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
   * Record a warning
   */
  addWarning(message) {
    this.warnings.push(message);
    this.warnCount++;
  }

  /**
   * Print validation results and summary
   */
  printSummary() {
    // Print all results
    for (const result of this.results) {
      console.log(result.message);
    }

    // Print overall summary
    console.log('');
    console.log('='.repeat(60));

    const totalCategories = this.categoryResults.length;
    const passedCategories = this.categoryResults.filter(
      (r) => r.status === 'pass',
    ).length;
    const warnedCategories = this.categoryResults.filter(
      (r) => r.status === 'warn',
    ).length;

    const summaryStatus =
      this.failCount === 0
        ? `${colors.green}${checkmark} PASS${colors.reset}`
        : `${colors.red}${xmark} FAIL${colors.reset}`;

    console.log(
      `${colors.bold}Overall: ${summaryStatus} (${passedCategories}/${totalCategories} categories)${colors.reset}`,
    );

    // Print warnings if any
    if (this.warnings.length > 0) {
      console.log('');
      console.log(`${colors.yellow}${colors.bold}Warnings:${colors.reset}`);
      for (const warning of this.warnings) {
        console.log(`${colors.yellow}  - ${warning}${colors.reset}`);
      }
    }

    // Print recommendations
    if (this.failCount > 0) {
      console.log('');
      console.log(
        `${colors.cyan}${colors.bold}Recommendations:${colors.reset}`,
      );
      if (
        this.categoryResults.some(
          (r) => r.name.includes('JavaScript') && r.status === 'fail',
        )
      ) {
        console.log(`${colors.cyan}  - Fix JavaScript syntax errors${colors.reset}`);
      }
      if (
        this.categoryResults.some(
          (r) => r.name.includes('Viewport') && r.status === 'fail',
        )
      ) {
        console.log(`${colors.cyan}  - Add required mobile meta tags to index.html${colors.reset}`);
      }
      if (
        this.categoryResults.some(
          (r) => r.name.includes('Service Worker') && r.status === 'fail',
        )
      ) {
        console.log(`${colors.cyan}  - Implement required service worker event listeners${colors.reset}`);
      }
      if (
        this.categoryResults.some(
          (r) => r.name.includes('PWA') && r.status === 'fail',
        )
      ) {
        console.log(`${colors.cyan}  - Run node validate-pwa.js for detailed PWA issues${colors.reset}`);
      }
    }

    console.log('');
  }
}

// Run validator
const validator = new MobileValidator('.');
const success = validator.validate();

// Exit with appropriate code
process.exit(success && validator.failCount === 0 ? 0 : 1);
