const fs = require('fs');
const path = require('path');
const os = require('os');

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

const packageRoot = __dirname;
const targetSkillDir = path.join(packageRoot, 'skills', 'engineering', 'fluentcart-developer');
const srcSkillMd = path.join(targetSkillDir, 'SKILL.md');
const srcReferences = path.join(targetSkillDir, 'references');
const srcExamples = path.join(targetSkillDir, 'examples');

const geminiGlobalSkillDir = path.join(os.homedir(), '.gemini', 'config', 'skills', 'fluentcart-developer');

console.log('Syncing skill files to global Gemini skills directory...');
try {
    // Sync from skills/engineering/fluentcart-developer to global Gemini skill dir
    if (fs.existsSync(geminiGlobalSkillDir)) {
        if (fs.existsSync(srcSkillMd)) fs.copyFileSync(srcSkillMd, path.join(geminiGlobalSkillDir, 'SKILL.md'));
        if (fs.existsSync(srcReferences)) copyDir(srcReferences, path.join(geminiGlobalSkillDir, 'references'));
        if (fs.existsSync(srcExamples)) copyDir(srcExamples, path.join(geminiGlobalSkillDir, 'examples'));
        console.log('✓ Synced to global Gemini skills directory');
    }

    console.log('✓ Build sync completed successfully!');
} catch (err) {
    console.error('Error during build sync:', err.message);
}
