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
const packageRoot = path.join(__dirname, '..');
const localSkillSrc = path.join(packageRoot, 'skills', 'fluentcart-developer');

// Global Paths
const geminiGlobalSkillDir = path.join(homeDir, '.gemini', 'config', 'skills', 'fluentcart-developer');
const geminiGlobalRulesFile = path.join(homeDir, '.gemini', 'config', 'AGENTS.md');
const claudeGlobalSkillDir = path.join(homeDir, '.claude', 'skills', 'fluentcart-developer');

// Zed Global Path
const zedGlobalRulesWin = path.join(process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'), 'Zed', 'AGENTS.md');
const zedGlobalRulesUnix = path.join(homeDir, '.config', 'zed', 'AGENTS.md');

// Load rules source
const rulesFileSrc = path.join(packageRoot, 'fluentcart-rules.md');
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
        if (fs.existsSync(path.join(packageRoot, '.cursorrules'))) {
            fs.copyFileSync(path.join(packageRoot, '.cursorrules'), path.join(cwd, '.cursorrules'));
            fs.copyFileSync(path.join(packageRoot, '.cursorrules'), path.join(cwd, '.windsurfrules'));
            fs.copyFileSync(path.join(packageRoot, '.cursorrules'), path.join(cwd, '.clinerules'));
            fs.copyFileSync(path.join(packageRoot, '.cursorrules'), path.join(cwd, '.rules'));
        }
        if (fs.existsSync(path.join(packageRoot, 'CLAUDE.md'))) {
            fs.copyFileSync(path.join(packageRoot, 'CLAUDE.md'), path.join(cwd, 'CLAUDE.md'));
        }
        
        const copilotDir = path.join(cwd, '.github');
        fs.mkdirSync(copilotDir, { recursive: true });
        if (fs.existsSync(path.join(packageRoot, '.cursorrules'))) {
            fs.copyFileSync(path.join(packageRoot, '.cursorrules'), path.join(copilotDir, 'copilot-instructions.md'));
        }
        
        console.log('✓ Created project rules files (.cursorrules, .windsurfrules, .clinerules, .rules, CLAUDE.md, .github/copilot-instructions.md)');

        // B. Project-level Skills
        const geminiLocalSkillDir = path.join(cwd, '.agents', 'skills', 'fluentcart-developer');
        fs.mkdirSync(geminiLocalSkillDir, { recursive: true });
        if (fs.existsSync(srcSkillMd)) fs.copyFileSync(srcSkillMd, path.join(geminiLocalSkillDir, 'SKILL.md'));
        if (fs.existsSync(srcReferences)) copyDir(srcReferences, path.join(geminiLocalSkillDir, 'references'));
        if (fs.existsSync(srcExamples)) copyDir(srcExamples, path.join(geminiLocalSkillDir, 'examples'));
        
        console.log('✓ Created project skills directory (.agents/skills/fluentcart-developer)');
        console.log('✓ Project initialization completed successfully!\n');
    } catch (err) {
        console.error('Error initializing project rules:', err.message);
    }
}

// Remove rules function
function removeRules() {
    console.log('\nRemoving FluentCart rules from global and project files...');
    const cwd = process.cwd();

    removeRulesWithMarkers(geminiGlobalRulesFile, 'FLUENTCART_RULES');
    
    const isWindows = process.platform === 'win32';
    const zedGlobalRulesPath = isWindows ? zedGlobalRulesWin : zedGlobalRulesUnix;
    removeRulesWithMarkers(zedGlobalRulesPath, 'FLUENTCART_RULES');

    // Remove project rules files
    const projectFilesToRemove = [
        path.join(cwd, '.cursorrules'),
        path.join(cwd, '.windsurfrules'),
        path.join(cwd, '.clinerules'),
        path.join(cwd, '.rules'),
        path.join(cwd, 'CLAUDE.md'),
        path.join(cwd, '.github', 'copilot-instructions.md')
    ];

    projectFilesToRemove.forEach(file => {
        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
                console.log(`✓ Removed: ${file}`);
            } catch (err) {
                console.error(`Error removing ${file}:`, err.message);
            }
        }
    });

    // Remove local skills directory
    const geminiLocalSkillDir = path.join(cwd, '.agents', 'skills', 'fluentcart-developer');
    if (fs.existsSync(geminiLocalSkillDir)) {
        try {
            fs.rmSync(geminiLocalSkillDir, { recursive: true, force: true });
            console.log(`✓ Removed project skill directory: ${geminiLocalSkillDir}`);
        } catch (err) {
            console.error(`Error removing project skill dir:`, err.message);
        }
    }

    console.log('✓ Removal completed!\n');
}

// CLI Command Router
if (initialCommand === 'init') {
    installGlobal();
    installProject();
} else if (initialCommand === 'global') {
    installGlobal();
} else if (initialCommand === 'project') {
    installProject();
} else if (initialCommand === 'remove') {
    removeRules();
} else {
    // Interactive Wizard
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\n======================================================');
    console.log('    FluentCart Developer Skill & Rules Installer');
    console.log('======================================================');
    console.log('Select an installation option:');
    console.log(' 1. Initialize BOTH Global & Current Project Rules (Recommended)');
    console.log(' 2. Install ONLY Global Skill (~/.gemini/, ~/.claude/, Zed)');
    console.log(' 3. Setup ONLY Current Project Rules & Local Skills (.agents/)');
    console.log(' 4. Remove FluentCart rules & skills');
    console.log(' 5. Exit');
    console.log('------------------------------------------------------');

    rl.question('Enter your choice (1-5): ', (answer) => {
        const choice = answer.trim();
        if (choice === '1') {
            installGlobal();
            installProject();
        } else if (choice === '2') {
            installGlobal();
        } else if (choice === '3') {
            installProject();
        } else if (choice === '4') {
            removeRules();
        } else {
            console.log('Exiting without changes.');
        }
        rl.close();
    });
}
