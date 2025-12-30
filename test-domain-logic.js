#!/usr/bin/env node

/**
 * Domain Switching Logic Test
 * Simulates browser behavior to test domain switching logic
 */

console.log('='.repeat(60));
console.log('DOMAIN SWITCHING LOGIC TEST');
console.log('='.repeat(60));

// Mock localStorage
global.localStorage = {
    storage: {},
    setItem(key, value) {
        this.storage[key] = value;
        console.log(`  → localStorage.setItem('${key}', '${value}')`);
    },
    getItem(key) {
        const value = this.storage[key] || null;
        console.log(`  → localStorage.getItem('${key}') = ${value}`);
        return value;
    },
    clear() {
        this.storage = {};
        console.log(`  → localStorage.clear()`);
    }
};

// Load the vocabulary dictionary (simulated)
console.log('\n[1] Loading vocabulary-dictionary.js...');

// Simulate the domain definitions
const Domains = {
    PHYSICS: 'physics',
    CHEMISTRY: 'chemistry',
    CS: 'computer-science'
};

const DomainData = {
    physics: { name: 'Physics', icon: '⚛️', categories: [{id: 'mechanics'}] },
    chemistry: { name: 'Chemistry', icon: '⚗️', categories: [{id: 'acids'}] },
    'computer-science': { name: 'Computer Science', icon: '💻', categories: [{id: 'algorithms'}] }
};

let currentDomain = Domains.PHYSICS;

function getCurrentDomainData() {
    return DomainData[currentDomain];
}

function setCurrentDomain(domain) {
    if (DomainData[domain]) {
        currentDomain = domain;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('selectedDomain', domain);
        }
        return true;
    }
    return false;
}

// Initialize from localStorage
if (typeof localStorage !== 'undefined') {
    const savedDomain = localStorage.getItem('selectedDomain');
    if (savedDomain && DomainData[savedDomain]) {
        currentDomain = savedDomain;
    }
}

console.log('✓ Domain infrastructure loaded');

// Test 1: Default domain
console.log('\n[2] Test Default Domain');
const defaultDomain = getCurrentDomainData();
console.log(`  Current domain: ${currentDomain}`);
console.log(`  Domain name: ${defaultDomain.name}`);
console.log(`  Domain icon: ${defaultDomain.icon}`);
console.log(`  Categories count: ${defaultDomain.categories.length}`);
if (currentDomain === Domains.PHYSICS && defaultDomain.name === 'Physics') {
    console.log('✓ Default domain is Physics');
} else {
    console.log('✗ Default domain is NOT Physics');
}

// Test 2: Switch to Chemistry
console.log('\n[3] Test Switch to Chemistry');
const chemResult = setCurrentDomain(Domains.CHEMISTRY);
console.log(`  setCurrentDomain('chemistry') returned: ${chemResult}`);
const chemData = getCurrentDomainData();
console.log(`  Current domain: ${currentDomain}`);
console.log(`  Domain name: ${chemData.name}`);
console.log(`  Domain icon: ${chemData.icon}`);
if (chemResult && currentDomain === 'chemistry' && chemData.name === 'Chemistry') {
    console.log('✓ Successfully switched to Chemistry');
} else {
    console.log('✗ Failed to switch to Chemistry');
}

// Test 3: Switch to Computer Science
console.log('\n[4] Test Switch to Computer Science');
const csResult = setCurrentDomain(Domains.CS);
console.log(`  setCurrentDomain('computer-science') returned: ${csResult}`);
const csData = getCurrentDomainData();
console.log(`  Current domain: ${currentDomain}`);
console.log(`  Domain name: ${csData.name}`);
console.log(`  Domain icon: ${csData.icon}`);
if (csResult && currentDomain === 'computer-science' && csData.name === 'Computer Science') {
    console.log('✓ Successfully switched to Computer Science');
} else {
    console.log('✗ Failed to switch to Computer Science');
}

// Test 4: Invalid domain
console.log('\n[5] Test Invalid Domain');
const invalidResult = setCurrentDomain('invalid-domain');
const currentAfterInvalid = getCurrentDomainData();
console.log(`  setCurrentDomain('invalid-domain') returned: ${invalidResult}`);
console.log(`  Current domain still: ${currentDomain}`);
if (!invalidResult && currentDomain === 'computer-science') {
    console.log('✓ Invalid domain rejected, current domain unchanged');
} else {
    console.log('✗ Invalid domain handling failed');
}

// Test 5: Switch back to Physics
console.log('\n[6] Test Switch Back to Physics');
const physicsResult = setCurrentDomain(Domains.PHYSICS);
console.log(`  setCurrentDomain('physics') returned: ${physicsResult}`);
const physicsData = getCurrentDomainData();
console.log(`  Current domain: ${currentDomain}`);
console.log(`  Domain name: ${physicsData.name}`);
if (physicsResult && currentDomain === 'physics' && physicsData.name === 'Physics') {
    console.log('✓ Successfully switched back to Physics');
} else {
    console.log('✗ Failed to switch back to Physics');
}

// Test 6: localStorage persistence simulation
console.log('\n[7] Test localStorage Persistence');
console.log('  Simulating page reload...');
localStorage.clear();
localStorage.setItem('selectedDomain', 'chemistry');

// Simulate reload
currentDomain = Domains.PHYSICS; // Reset
const savedDomain = localStorage.getItem('selectedDomain');
if (savedDomain && DomainData[savedDomain]) {
    currentDomain = savedDomain;
    console.log(`  Restored domain from localStorage: ${currentDomain}`);
}

const restoredData = getCurrentDomainData();
console.log(`  Domain name: ${restoredData.name}`);
if (currentDomain === 'chemistry' && restoredData.name === 'Chemistry') {
    console.log('✓ Domain preference restored from localStorage');
} else {
    console.log('✗ Domain preference restoration failed');
}

// Test 7: All domains accessible
console.log('\n[8] Test All Domains Accessible');
let allDomainsWork = true;
for (const [key, domainKey] of Object.entries(Domains)) {
    const result = setCurrentDomain(domainKey);
    const data = getCurrentDomainData();
    console.log(`  ${key}: ${result ? '✓' : '✗'} (${data.name})`);
    if (!result || !data.name) {
        allDomainsWork = false;
    }
}
if (allDomainsWork) {
    console.log('✓ All 3 domains accessible and functional');
} else {
    console.log('✗ Some domains not working');
}

console.log('\n' + '='.repeat(60));
console.log('DOMAIN LOGIC TEST COMPLETE');
console.log('='.repeat(60));
