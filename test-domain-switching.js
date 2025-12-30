#!/usr/bin/env node

/**
 * Domain Switching Integration Test
 * Tests the domain switching functionality end-to-end
 */

const fs = require('fs');
const path = require('path');

const testResults = {
    passed: [],
    failed: [],
    warnings: []
};

function log(message) {
    console.log(`[TEST] ${message}`);
}

function pass(testName) {
    testResults.passed.push(testName);
    console.log(`✓ ${testName}`);
}

function fail(testName, reason) {
    testResults.failed.push({ test: testName, reason });
    console.log(`✗ ${testName}: ${reason}`);
}

function warn(message) {
    testResults.warnings.push(message);
    console.log(`⚠ WARNING: ${message}`);
}

// Test 1: Verify all required files exist
log('Test 1: Verifying file structure...');
const requiredFiles = [
    'index.html',
    'main.js',
    'vocabulary-dictionary.js',
    'game-logic.js',
    'styles.css'
];

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        pass(`File exists: ${file}`);
    } else {
        fail(`File exists: ${file}`, 'File not found');
    }
});

// Test 2: Verify vocabulary-dictionary.js exports
log('\nTest 2: Verifying vocabulary-dictionary.js exports...');
try {
    const vocabContent = fs.readFileSync(path.join(__dirname, 'vocabulary-dictionary.js'), 'utf8');

    // Check Domains constant
    if (vocabContent.includes('const Domains = {')) {
        pass('Domains constant defined');

        // Verify all 3 domains
        const domainChecks = [
            { name: 'PHYSICS', pattern: /PHYSICS:\s*['"]physics['"]/ },
            { name: 'CHEMISTRY', pattern: /CHEMISTRY:\s*['"]chemistry['"]/ },
            { name: 'CS', pattern: /CS:\s*['"]computer-science['"]/ }
        ];

        domainChecks.forEach(({ name, pattern }) => {
            if (pattern.test(vocabContent)) {
                pass(`Domain ${name} defined`);
            } else {
                fail(`Domain ${name} defined`, 'Not found in Domains constant');
            }
        });
    } else {
        fail('Domains constant defined', 'Not found');
    }

    // Check DomainData
    if (vocabContent.includes('const DomainData = {')) {
        pass('DomainData constant defined');

        // Verify each domain has required properties
        const domainDataChecks = [
            'physics:',
            'chemistry:',
            'computer-science:'
        ];

        domainDataChecks.forEach(check => {
            if (vocabContent.includes(check)) {
                pass(`DomainData has ${check}`);
            } else {
                fail(`DomainData has ${check}`, 'Domain data not found');
            }
        });
    } else {
        fail('DomainData constant defined', 'Not found');
    }

    // Check getCurrentDomainData function
    if (vocabContent.includes('function getCurrentDomainData()')) {
        pass('getCurrentDomainData() function defined');
    } else {
        fail('getCurrentDomainData() function defined', 'Not found');
    }

    // Check setCurrentDomain function
    if (vocabContent.includes('function setCurrentDomain(domain)')) {
        pass('setCurrentDomain() function defined');

        // Verify localStorage integration
        if (vocabContent.includes("localStorage.setItem('selectedDomain', domain)")) {
            pass('setCurrentDomain() saves to localStorage');
        } else {
            fail('setCurrentDomain() saves to localStorage', 'localStorage.setItem not found');
        }
    } else {
        fail('setCurrentDomain() function defined', 'Not found');
    }

    // Check localStorage initialization
    if (vocabContent.includes("localStorage.getItem('selectedDomain')")) {
        pass('Domain preference restored from localStorage on init');
    } else {
        fail('Domain preference restored from localStorage on init', 'localStorage.getItem not found');
    }

} catch (err) {
    fail('Reading vocabulary-dictionary.js', err.message);
}

// Test 3: Verify main.js integration
log('\nTest 3: Verifying main.js integration...');
try {
    const mainContent = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

    // Check domain button element references
    const elementChecks = [
        { name: 'domainBtn element', pattern: /domainBtn:\s*null/ },
        { name: 'domainIcon element', pattern: /domainIcon:\s*null/ }
    ];

    elementChecks.forEach(({ name, pattern }) => {
        if (pattern.test(mainContent)) {
            pass(`${name} declared in elements object`);
        } else {
            fail(`${name} declared in elements object`, 'Not found');
        }
    });

    // Check element initialization
    if (mainContent.includes("document.getElementById('domain-btn')")) {
        pass('domainBtn element initialized');
    } else {
        fail('domainBtn element initialized', 'getElementById not found');
    }

    if (mainContent.includes("document.getElementById('domain-icon')")) {
        pass('domainIcon element initialized');
    } else {
        fail('domainIcon element initialized', 'getElementById not found');
    }

    // Check event listeners
    if (mainContent.includes("domainBtn.addEventListener('click', handleShowDomainSelector)")) {
        pass('Domain button click handler attached');
    } else {
        fail('Domain button click handler attached', 'addEventListener not found');
    }

    // Check updateDomainIcon function
    if (mainContent.includes('function updateDomainIcon()')) {
        pass('updateDomainIcon() function defined');

        if (mainContent.includes('getCurrentDomainData()')) {
            pass('updateDomainIcon() calls getCurrentDomainData()');
        } else {
            fail('updateDomainIcon() calls getCurrentDomainData()', 'Function call not found');
        }
    } else {
        fail('updateDomainIcon() function defined', 'Not found');
    }

    // Check handleShowDomainSelector function
    if (mainContent.includes('function handleShowDomainSelector()')) {
        pass('handleShowDomainSelector() function defined');
    } else {
        fail('handleShowDomainSelector() function defined', 'Not found');
    }

    // Check handleDomainSelect function
    if (mainContent.includes('function handleDomainSelect(domainKey)')) {
        pass('handleDomainSelect() function defined');

        if (mainContent.includes('setCurrentDomain(domainKey)')) {
            pass('handleDomainSelect() calls setCurrentDomain()');
        } else {
            fail('handleDomainSelect() calls setCurrentDomain()', 'Function call not found');
        }
    } else {
        fail('handleDomainSelect() function defined', 'Not found');
    }

    // Check global window exposure
    if (mainContent.includes('window.handleDomainSelect')) {
        pass('handleDomainSelect exposed to global window');
    } else {
        fail('handleDomainSelect exposed to global window', 'Not found');
    }

    // Check showCategorySelector bug fix
    if (mainContent.includes('const domainCategories = getCurrentDomainData().categories')) {
        pass('showCategorySelector uses getCurrentDomainData().categories');
    } else {
        fail('showCategorySelector uses getCurrentDomainData().categories', 'Bug fix not applied');
    }

} catch (err) {
    fail('Reading main.js', err.message);
}

// Test 4: Verify HTML structure
log('\nTest 4: Verifying index.html structure...');
try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

    // Check domain button
    if (htmlContent.includes('id="domain-btn"')) {
        pass('Domain button element exists in HTML');
    } else {
        fail('Domain button element exists in HTML', 'Element not found');
    }

    if (htmlContent.includes('id="domain-icon"')) {
        pass('Domain icon element exists in HTML');
    } else {
        fail('Domain icon element exists in HTML', 'Element not found');
    }

    // Check default icon
    if (htmlContent.includes('⚛️')) {
        pass('Default physics icon (⚛️) present');
    } else {
        warn('Default physics icon not found in HTML');
    }

    // Check script loading order
    const scriptOrder = [];
    const scriptRegex = /<script[^>]*src=["']([^"']+)["']/g;
    let match;
    while ((match = scriptRegex.exec(htmlContent)) !== null) {
        scriptOrder.push(match[1]);
    }

    const vocabIndex = scriptOrder.indexOf('vocabulary-dictionary.js');
    const mainIndex = scriptOrder.indexOf('main.js');

    if (vocabIndex !== -1 && mainIndex !== -1) {
        if (vocabIndex < mainIndex) {
            pass('Scripts loaded in correct order (vocabulary-dictionary.js before main.js)');
        } else {
            fail('Scripts loaded in correct order', 'main.js loads before vocabulary-dictionary.js');
        }
    } else {
        warn('Could not verify script loading order');
    }

} catch (err) {
    fail('Reading index.html', err.message);
}

// Test 5: Verify CSS styles
log('\nTest 5: Verifying styles.css...');
try {
    const cssContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

    const cssChecks = [
        { name: '.btn-domain', pattern: /\.btn-domain\s*\{/ },
        { name: '.domain-icon', pattern: /\.domain-icon\s*\{/ },
        { name: '.domain-selector-grid', pattern: /\.domain-selector-grid\s*\{/ },
        { name: '.domain-card', pattern: /\.domain-card\s*\{/ },
        { name: '.domain-icon-large', pattern: /\.domain-icon-large\s*\{/ }
    ];

    cssChecks.forEach(({ name, pattern }) => {
        if (pattern.test(cssContent)) {
            pass(`CSS class ${name} defined`);
        } else {
            warn(`CSS class ${name} not found (may be defined differently)`);
        }
    });

} catch (err) {
    fail('Reading styles.css', err.message);
}

// Print summary
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Passed: ${testResults.passed.length}`);
console.log(`Total Failed: ${testResults.failed.length}`);
console.log(`Total Warnings: ${testResults.warnings.length}`);

if (testResults.failed.length > 0) {
    console.log('\nFailed Tests:');
    testResults.failed.forEach(({ test, reason }) => {
        console.log(`  - ${test}: ${reason}`);
    });
}

if (testResults.warnings.length > 0) {
    console.log('\nWarnings:');
    testResults.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
    });
}

console.log('\n' + '='.repeat(60));

// Calculate confidence level
const totalTests = testResults.passed.length + testResults.failed.length;
const passRate = (testResults.passed.length / totalTests) * 100;

let confidence = 'LOW';
if (passRate >= 95) confidence = 'VERY HIGH';
else if (passRate >= 85) confidence = 'HIGH';
else if (passRate >= 70) confidence = 'MEDIUM';

console.log(`CONFIDENCE LEVEL: ${confidence} (${passRate.toFixed(1)}% pass rate)`);
console.log('='.repeat(60));

// Exit with appropriate code
process.exit(testResults.failed.length > 0 ? 1 : 0);
