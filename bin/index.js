#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Helper to copy directory recursively
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Helper to safely write rules to a file with markers
function writeRulesWithMarkers(filePath, rulesContent, bannerName) {
    try {
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        
        let existingContent = '';
        if (fs.existsSync(filePath)) {
            existingContent = fs.readFileSync(filePath, 'utf8');
        }
        
        const startMarker = `<!-- BEGIN ${bannerName} -->`;
        const endMarker = `<!-- END ${bannerName} -->`;
        
        if (existingContent.includes(startMarker)) {
            const startIndex = existingContent.indexOf(startMarker);
            const endIndex = existingContent.indexOf(endMarker) + endMarker.length;
            const updatedContent = existingContent.substring(0, startIndex) +
                                   startMarker + '\n' + rulesContent + '\n' + endMarker +
                                   existingContent.substring(endIndex);
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✓ Updated rules in: ${filePath}`);
        } else {
            const separator = existingContent ? '\n\n' : '';
            const newContent = existingContent + separator + startMarker + '\n' + rulesContent + '\n' + endMarker;
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✓ Added rules to: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error updating rules in ${filePath}:`, err.message);
    }
}

// Helper to safely remove rules markers from a file
function removeRulesWithMarkers(filePath, bannerName) {
    try {
        if (!fs.existsSync(filePath)) return;
        let existingContent = fs.readFileSync(filePath, 'utf8');
        const startMarker = `<!-- BEGIN ${bannerName} -->`;
        const endMarker = `<!-- END ${bannerName} -->`;

        if (existingContent.includes(startMarker) && existingContent.includes(endMarker)) {
            const startIndex = existingContent.indexOf(startMarker);
            const endIndex = existingContent.indexOf(endMarker) + endMarker.length;
            const updatedContent = existingContent.substring(0, startIndex) + existingContent.substring(endIndex);
            fs.writeFileSync(filePath, updatedContent.trim(), 'utf8');
            console.log(`✓ Removed rules from: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error removing rules from ${filePath}:`, err.message);
    }
}

const args = process.argv.slice(2);
const initialCommand = args[0];

const homeDir = os.homedir();
const localSkillSrc = path.join(__dirname, '..'); // package root

// Global Paths
const geminiGlobalSkillDir = path.join(homeDir, '.gemini', 'config', 'skills', 'fluentcart-developer');
const geminiGlobalRulesFile = path.join(homeDir, '.gemini', 'config', 'AGENTS.md');
const claudeGlobalSkillDir = path.join(homeDir, '.claude', 'skills', 'fluentcart-developer');

// Zed Global Path
const zedGlobalRulesWin = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Zed', 'AGENTS.md');
const zedGlobalRulesUnix = path.join(homeDir, '.config', 'zed', 'AGENTS.md');

// Load rules source
const rulesFileSrc = path.join(localSkillSrc, 'fluentcart-rules.md');
let rulesContent = '';
if (fs.existsSync(rulesFileSrc)) {
    rulesContent = fs.readFileSync(rulesFileSrc, 'utf8');
} else {
    rulesContent = `# FluentCart Development Rules\n\nEnsure functions.php includes add_theme_support('fluent_cart');`;
}

// Global install function
function installGlobal() {
    console.log('\nInstalling FluentCart Developer Skill globally for all IDEs...');
    
    const srcSkillMd = path.join(localSkillSrc, 'SKILL.md');
    const srcReferences = path.join(localSkillSrc, 'references');
    const srcExamples = path.join(localSkillSrc, 'examples');

    // 1. Antigravity/Gemini Global Skill & Rules
    try {
        fs.mkdirSync(geminiGlobalSkillDir, { recursive: true });
        if (fs.existsSync(srcSkillMd)) fs.copyFileSync(srcSkillMd, path.join(geminiGlobalSkillDir, 'SKILL.md'));
        if (fs.existsSync(srcReferences)) copyDir(srcReferences, path.join(geminiGlobalSkillDir, 'references'));
        if (fs.existsSync(srcExamples)) copyDir(srcExamples, path.join(geminiGlobalSkillDir, 'examples'));
        
        writeRulesWithMarkers(geminiGlobalRulesFile, rulesContent, 'FLUENTCART_RULES');
        console.log('✓ Global skill and rules installed for Antigravity/Gemini!');
    } catch (err) {
        console.error('Error installing global Antigravity skill:', err.message);
    }

    // 2. Claude Code Global Skill
    try {
        fs.mkdirSync(claudeGlobalSkillDir, { recursive: true });
        if (fs.existsSync(srcSkillMd)) fs.copyFileSync(srcSkillMd, path.join(claudeGlobalSkillDir, 'SKILL.md'));
        if (fs.existsSync(srcReferences)) copyDir(srcReferences, path.join(claudeGlobalSkillDir, 'references'));
        if (fs.existsSync(srcExamples)) copyDir(srcExamples, path.join(claudeGlobalSkillDir, 'examples'));
        
        console.log('✓ Global skill installed for Claude Code!');
    } catch (err) {
        console.error('Error installing global Claude Code skill:', err.message);
    }

    // 3. Zed Global Rules
    try {
        const isWindows = process.platform === 'win32';
        const zedGlobalRulesPath = isWindows ? zedGlobalRulesWin : zedGlobalRulesUnix;
        writeRulesWithMarkers(zedGlobalRulesPath, rulesContent, 'FLUENTCART_RULES');
        console.log('✓ Global rules installed for Zed!');
    } catch (err) {
        console.error('Error installing global Zed rules:', err.message);
    }
    
    console.log('✓ Global installation completed successfully!\n');
}

// Project install function
function installProject() {
    console.log('\nInitializing project-specific skills and rules in current directory...');
    const cwd = process.cwd();
    const srcSkillMd = path.join(localSkillSrc, 'SKILL.md');
    const srcReferences = path.join(localSkillSrc, 'references');
    const srcExamples = path.join(localSkillSrc, 'examples');
    
    try {
        // A. Project rules files
        if (fs.existsSync(path.join(localSkillSrc, '.cursorrules'))) {
            fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.cursorrules'));
            fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.windsurfrules'));
            fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.clinerules'));
            fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.rules'));
        }
        if (fs.existsSync(path.join(localSkillSrc, 'CLAUDE.md'))) {
            fs.copyFileSync(path.join(localSkillSrc, 'CLAUDE.md'), path.join(cwd, 'CLAUDE.md'));
        }
        
        const copilotDir = path.join(cwd, '.github');
        fs.mkdirSync(copilotDir, { recursive: true });
        if (fs.existsSync(path.join(localSkillSrc, '.cursorrules'))) {
            fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(copilotDir, 'copilot-instructions.md'));
        }
        
        console.log('✓ Created project rules files (.cursorrules, .windsurfrules, .clinerules, .rules, CLAUDE.md, .github/copilot-instructions.md)');

        // B. Project-level Skills
        const geminiLocalSkillDir = path.join(cwd, '.agents', 'skills', 'fluentcart-developer');
        fs.mkdirSync(geminiLocalSkillDir, { recursive: true });
        if (fs.existsSync(srcSkillMd)) fs.copyFileSync(srcSkillMd, path.join(geminiLocalSkillDir, 'SKILL.md'));
        if (fs.existsSync(srcReferences)) copyDir(srcReferences, path.join(geminiLocalSkillDir, 'references'));
        if (fs.existsSync(srcExamples)) copyDir(srcExamples, path.join(geminiLocalSkillDir, 'examples'));
        
        writeRulesWithMarkers(path.join(cwd, '.agents', 'AGENTS.md'), rulesContent, 'FLUENTCART_RULES');
        console.log('✓ Initialized local skill and rules for Antigravity (.agents/)');

        const claudeLocalSkillDir = path.join(cwd, '.claude', 'skills', 'fluentcart-developer');
        fs.mkdirSync(claudeLocalSkillDir, { recursive: true });
        if (fs.existsSync(srcSkillMd)) fs.copyFileSync(srcSkillMd, path.join(claudeLocalSkillDir, 'SKILL.md'));
        if (fs.existsSync(srcReferences)) copyDir(srcReferences, path.join(claudeLocalSkillDir, 'references'));
        if (fs.existsSync(srcExamples)) copyDir(srcExamples, path.join(claudeLocalSkillDir, 'examples'));
        
        console.log('✓ Initialized local skill for Claude Code (.claude/skills/)');

    } catch (err) {
        console.error('Error installing project rules:', err.message);
    }
}

// Uninstall / Remove function
function uninstall() {
    console.log('\nRemoving FluentCart rules and markers from current project and global configs...');
    const cwd = process.cwd();
    
    // Remove global rules
    removeRulesWithMarkers(geminiGlobalRulesFile, 'FLUENTCART_RULES');
    const isWindows = process.platform === 'win32';
    const zedGlobalRulesPath = isWindows ? zedGlobalRulesWin : zedGlobalRulesUnix;
    removeRulesWithMarkers(zedGlobalRulesPath, 'FLUENTCART_RULES');
    
    // Remove local AGENTS.md rules
    removeRulesWithMarkers(path.join(cwd, '.agents', 'AGENTS.md'), 'FLUENTCART_RULES');
    
    console.log('✓ Cleaned FluentCart rule markers successfully!');
}

function processCommand(cmd) {
    if (cmd === 'init') {
        installGlobal();
        installProject();
        console.log('FluentCart AI Skill is ready to use on all IDEs & assistants! 🚀');
    } else if (cmd === 'global') {
        installGlobal();
    } else if (cmd === 'project') {
        installProject();
    } else if (cmd === 'remove' || cmd === 'uninstall') {
        uninstall();
    } else if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
        console.log(`
FluentCart AI Developer Skill CLI (by Fastrsoft)

Usage:
  npx skills add atifjubaer/skills --skill fluentcart-developer
  npx fluentcart-ai-skill           Interactive selection menu
  npx fluentcart-ai-skill init      Install skills globally and initialize project rules for all IDEs
  npx fluentcart-ai-skill global    Install global skills for Antigravity, Claude Code, and Zed
  npx fluentcart-ai-skill project   Initialize project-specific skills and rules in current directory
  npx fluentcart-ai-skill remove    Remove rule markers from project and global files
        `);
    } else {
        console.log(`Unknown command: ${cmd}. Run with --help for usage info.`);
    }
}

// Interactive prompt if no command provided
if (!initialCommand) {
    console.log(`
=====================================================
 FluentCart AI Developer Skill CLI Setup (Fastrsoft)
=====================================================

Select an action:
  1) Initialize both Global Skills and Project Rules (init)
  2) Install Global Skills only (global)
  3) Initialize Project Rules in current directory only (project)
  4) Remove / Uninstall rule markers (remove)
  5) Exit
    `);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter choice [1-5]: ', (answer) => {
        rl.close();
        const choice = answer.trim();
        if (choice === '1') processCommand('init');
        else if (choice === '2') processCommand('global');
        else if (choice === '3') processCommand('project');
        else if (choice === '4') processCommand('remove');
        else console.log('Exited setup.');
    });
} else {
    processCommand(initialCommand);
}
