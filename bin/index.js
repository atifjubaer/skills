#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

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

// Helper to safely write rules to a file with markers (prevents duplication)
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

const args = process.argv.slice(2);
const command = args[0] || 'init';

if (command === 'help' || command === '--help' || command === '-h') {
    console.log(`
FluentCart AI Developer Skill CLI (by Fastrsoft)

Usage:
  npx fluentcart-ai-skill init      Install skills globally and initialize project rules for all IDEs
  npx fluentcart-ai-skill global    Install global skills for Antigravity, Claude Code, and Zed
  npx fluentcart-ai-skill project   Initialize project-specific skills and rules in current directory
    `);
    process.exit(0);
}

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
    console.log('Installing FluentCart Developer Skill globally for all IDEs...');
    
    const srcSkillMd = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'SKILL.md');
    const srcReferences = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'references');
    const srcAssets = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'assets');
    const srcScripts = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'scripts');

    // 1. Antigravity/Gemini Global Skill & Rules
    try {
        fs.mkdirSync(geminiGlobalSkillDir, { recursive: true });
        fs.copyFileSync(srcSkillMd, path.join(geminiGlobalSkillDir, 'SKILL.md'));
        
        if (fs.existsSync(srcReferences)) {
            copyDir(srcReferences, path.join(geminiGlobalSkillDir, 'references'));
        }
        if (fs.existsSync(srcAssets)) {
            copyDir(srcAssets, path.join(geminiGlobalSkillDir, 'assets'));
        }
        if (fs.existsSync(srcScripts)) {
            copyDir(srcScripts, path.join(geminiGlobalSkillDir, 'scripts'));
        }
        
        writeRulesWithMarkers(geminiGlobalRulesFile, rulesContent, 'FLUENTCART_RULES');
        console.log('✓ Global skill and rules installed for Antigravity/Gemini!');
    } catch (err) {
        console.error('Error installing global Antigravity skill:', err.message);
    }

    // 2. Claude Code Global Skill
    try {
        fs.mkdirSync(claudeGlobalSkillDir, { recursive: true });
        fs.copyFileSync(srcSkillMd, path.join(claudeGlobalSkillDir, 'SKILL.md'));
        
        if (fs.existsSync(srcReferences)) {
            copyDir(srcReferences, path.join(claudeGlobalSkillDir, 'references'));
        }
        if (fs.existsSync(srcAssets)) {
            copyDir(srcAssets, path.join(claudeGlobalSkillDir, 'assets'));
        }
        if (fs.existsSync(srcScripts)) {
            copyDir(srcScripts, path.join(claudeGlobalSkillDir, 'scripts'));
        }
        
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
    console.log('Initializing project-specific skills and rules in the current directory...');
    const cwd = process.cwd();
    const srcSkillMd = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'SKILL.md');
    const srcReferences = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'references');
    const srcAssets = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'assets');
    const srcScripts = path.join(localSkillSrc, 'skills', 'fluentcart-developer', 'scripts');
    
    try {
        // A. Project rules files
        // 1. Cursor & Zed
        fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.cursorrules'));
        // 2. Windsurf
        fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.windsurfrules'));
        // 3. Cline / Open Code
        fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.clinerules'));
        // 4. Zed specific file
        fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(cwd, '.rules'));
        // 5. Claude Code
        fs.copyFileSync(path.join(localSkillSrc, 'CLAUDE.md'), path.join(cwd, 'CLAUDE.md'));
        // 6. Generic rules
        fs.copyFileSync(path.join(localSkillSrc, 'fluentcart-rules.md'), path.join(cwd, 'fluentcart-rules.md'));
        // 7. Copilot Instructions
        const copilotDir = path.join(cwd, '.github');
        fs.mkdirSync(copilotDir, { recursive: true });
        fs.copyFileSync(path.join(localSkillSrc, '.cursorrules'), path.join(copilotDir, 'copilot-instructions.md'));
        
        console.log('✓ Created project rules files (.cursorrules, .windsurfrules, .clinerules, .rules, CLAUDE.md, .github/copilot-instructions.md)');

        // B. Project-level Skills
        // 1. Antigravity Local Skill
        const geminiLocalSkillDir = path.join(cwd, '.agents', 'skills', 'fluentcart-developer');
        fs.mkdirSync(geminiLocalSkillDir, { recursive: true });
        fs.copyFileSync(srcSkillMd, path.join(geminiLocalSkillDir, 'SKILL.md'));
        
        if (fs.existsSync(srcReferences)) {
            copyDir(srcReferences, path.join(geminiLocalSkillDir, 'references'));
        }
        if (fs.existsSync(srcAssets)) {
            copyDir(srcAssets, path.join(geminiLocalSkillDir, 'assets'));
        }
        if (fs.existsSync(srcScripts)) {
            copyDir(srcScripts, path.join(geminiLocalSkillDir, 'scripts'));
        }
        
        writeRulesWithMarkers(path.join(cwd, '.agents', 'AGENTS.md'), rulesContent, 'FLUENTCART_RULES');
        console.log('✓ Initialized local skill and rules for Antigravity (.agents/)');

        // 2. Claude Code Local Skill
        const claudeLocalSkillDir = path.join(cwd, '.claude', 'skills', 'fluentcart-developer');
        fs.mkdirSync(claudeLocalSkillDir, { recursive: true });
        fs.copyFileSync(srcSkillMd, path.join(claudeLocalSkillDir, 'SKILL.md'));
        
        if (fs.existsSync(srcReferences)) {
            copyDir(srcReferences, path.join(claudeLocalSkillDir, 'references'));
        }
        if (fs.existsSync(srcAssets)) {
            copyDir(srcAssets, path.join(claudeLocalSkillDir, 'assets'));
        }
        if (fs.existsSync(srcScripts)) {
            copyDir(srcScripts, path.join(claudeLocalSkillDir, 'scripts'));
        }
        
        console.log('✓ Initialized local skill for Claude Code (.claude/skills/)');

    } catch (err) {
        console.error('Error installing project rules:', err.message);
    }
}

if (command === 'init') {
    installGlobal();
    installProject();
    console.log('FluentCart AI Skill is ready to use on all IDEs & assistants! 🚀');
} else if (command === 'global') {
    installGlobal();
} else if (command === 'project') {
    installProject();
} else {
    console.log(`Unknown command: ${command}. Run with --help for usage info.`);
}
