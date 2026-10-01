const fs = require('fs');
const path = require('path');

const dirApp = path.join(__dirname, 'src', 'app');
const dirRoot = path.join(__dirname, 'src');

const colorMap = {
    // Backgrounds (Slate to Charcoal/Neutral)
    '#0f172a': '#111111',
    '#1e293b': '#1f1f1f',
    '#0b0f19': '#0a0a0a',
    'rgba(15, 23, 42': 'rgba(17, 17, 17',
    'rgba(30, 41, 59': 'rgba(31, 31, 31',

    // Gradients & Accents (Indigo/Purple to Gold/Amber/Orange)
    '#4f46e5': '#f59e0b', // Amber 500
    '#6366f1': '#d97706', // Amber 600
    '#a855f7': '#ea580c', // Orange 600
    '#7c3aed': '#b45309', // Amber 700
    '#818cf8': '#fbbf24', // Amber 400
    '#38bdf8': '#fcd34d', // Amber 300 (was light blue)
    
    // Text colors (Slate blue-grays to Neutral grays)
    '#cbd5e1': '#d4d4d4', // Neutral 300
    '#f8fafc': '#f5f5f5', // Neutral 100
    '#94a3b8': '#a3a3a3', // Neutral 400
    
    // Scrollbar colors
    '#334155': '#404040', // Neutral 700
    '#475569': '#525252', // Neutral 600

    // RGBA Accents
    'rgba(99, 102, 241': 'rgba(245, 158, 11', // Gold
    'rgba(168, 85, 247': 'rgba(234, 88, 12', // Orange
    'rgba(79, 70, 229': 'rgba(217, 119, 6' // Dark Gold
};

function processFile(fullPath) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // We do explicit replacements for every known color string
    for (const [oldColor, newColor] of Object.entries(colorMap)) {
        // Regex global replacement for the exact string, ignoring case
        const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (regex.test(content)) {
            content = content.replace(regex, newColor);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated theme in: ${path.basename(fullPath)}`);
    }
}

function traverseDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            processFile(fullPath);
        }
    }
}

traverseDir(dirApp);
// Also process styles.css in src
processFile(path.join(dirRoot, 'styles.css'));

console.log("Gold/Amber Theme applied successfully!");
