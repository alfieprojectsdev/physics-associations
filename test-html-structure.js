#!/usr/bin/env node

/**
 * HTML Structure Validation
 * Verifies the index.html structure for domain switching
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('HTML STRUCTURE VALIDATION');
console.log('='.repeat(60));

const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
    if (condition) {
        console.log(`✓ ${name}`);
        if (details) console.log(`  ${details}`);
        passed++;
    } else {
        console.log(`✗ ${name}`);
        if (details) console.log(`  ${details}`);
        failed++;
    }
}

// Test 1: Domain button exists
console.log('\n[1] Domain Button Structure');
test('Domain button element exists',
    htmlContent.includes('id="domain-btn"'),
    'Found: <button ... id="domain-btn">');

test('Domain button has correct class',
    htmlContent.includes('class="btn-domain"'),
    'Found: class="btn-domain"');

test('Domain button has title attribute',
    htmlContent.includes('title="Change Domain"'),
    'Found: title="Change Domain"');

// Test 2: Domain icon exists
console.log('\n[2] Domain Icon Structure');
test('Domain icon element exists',
    htmlContent.includes('id="domain-icon"'),
    'Found: <span ... id="domain-icon">');

test('Domain icon has correct class',
    htmlContent.includes('class="domain-icon"'),
    'Found: class="domain-icon"');

test('Default icon is physics (⚛️)',
    htmlContent.includes('>⚛️<'),
    'Found: ⚛️ (physics icon)');

// Test 3: Script loading order
console.log('\n[3] Script Loading Order');
const scriptMatches = [...htmlContent.matchAll(/<script[^>]*src=["']([^"']+)["']/g)];
const scripts = scriptMatches.map(m => m[1]);

console.log('  Script order:');
scripts.forEach((script, i) => {
    console.log(`    ${i + 1}. ${script}`);
});

const vocabIndex = scripts.indexOf('vocabulary-dictionary.js');
const gameLogicIndex = scripts.indexOf('game-logic.js');
const mainIndex = scripts.indexOf('main.js');

test('vocabulary-dictionary.js is loaded',
    vocabIndex !== -1,
    `Found at position ${vocabIndex + 1}`);

test('game-logic.js is loaded',
    gameLogicIndex !== -1,
    `Found at position ${gameLogicIndex + 1}`);

test('main.js is loaded',
    mainIndex !== -1,
    `Found at position ${mainIndex + 1}`);

test('Scripts in correct order (vocabulary → game-logic → main)',
    vocabIndex < gameLogicIndex && gameLogicIndex < mainIndex,
    `Order: vocab(${vocabIndex}) < game(${gameLogicIndex}) < main(${mainIndex})`);

// Test 4: Modal structure for domain selector
console.log('\n[4] Modal Structure');
test('Modal element exists',
    htmlContent.includes('id="modal"'),
    'Found: <div id="modal">');

test('Modal body exists',
    htmlContent.includes('id="modal-body"'),
    'Found: <div id="modal-body">');

test('Modal title exists',
    htmlContent.includes('id="modal-title"'),
    'Found: modal-title element');

// Test 5: Header structure
console.log('\n[5] Header Structure');
test('Game header exists',
    htmlContent.includes('class="game-header"'),
    'Found: <header class="game-header">');

test('Header left section exists',
    htmlContent.includes('class="header-left"'),
    'Found: <div class="header-left">');

test('Domain button is in header',
    htmlContent.match(/<header[\s\S]*?id="domain-btn"[\s\S]*?<\/header>/),
    'Domain button found within header tags');

// Test 6: Check for common HTML issues
console.log('\n[6] HTML Validation');

// Check for unclosed tags (basic check)
const openDivs = (htmlContent.match(/<div/g) || []).length;
const closeDivs = (htmlContent.match(/<\/div>/g) || []).length;
test('Balanced div tags',
    openDivs === closeDivs,
    `Open: ${openDivs}, Close: ${closeDivs}`);

const openButtons = (htmlContent.match(/<button/g) || []).length;
const closeButtons = (htmlContent.match(/<\/button>/g) || []).length;
test('Balanced button tags',
    openButtons === closeButtons,
    `Open: ${openButtons}, Close: ${closeButtons}`);

// Test 7: DOCTYPE and basic structure
console.log('\n[7] Document Structure');
test('Has DOCTYPE declaration',
    htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<!doctype html>'),
    'Found: DOCTYPE');

test('Has html tag',
    htmlContent.includes('<html'),
    'Found: <html>');

test('Has head section',
    htmlContent.includes('<head>') || htmlContent.includes('<head '),
    'Found: <head>');

test('Has body section',
    htmlContent.includes('<body>') || htmlContent.includes('<body '),
    'Found: <body>');

test('Has meta charset',
    htmlContent.includes('charset='),
    'Found: charset declaration');

// Test 8: Verify no obvious syntax errors
console.log('\n[8] Syntax Check');

const syntaxIssues = [];

// Check for unclosed quotes in tags
const tagPattern = /<[^>]*>/g;
const tags = htmlContent.match(tagPattern) || [];
tags.forEach((tag, i) => {
    const quotes = (tag.match(/"/g) || []).length;
    if (quotes % 2 !== 0) {
        syntaxIssues.push(`Line ~${i}: Unclosed quote in tag: ${tag.substring(0, 50)}...`);
    }
});

test('No unclosed quotes in tags',
    syntaxIssues.length === 0,
    syntaxIssues.length > 0 ? syntaxIssues.slice(0, 3).join('\n  ') : 'All tags properly quoted');

// Summary
console.log('\n' + '='.repeat(60));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

process.exit(failed > 0 ? 1 : 0);
