const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app');

// Reverse mapping!
const replacements = [
    // Base backgrounds
    ['#121212', '#0f172a'],
    ['#1e1e1e', '#1e293b'],
    ['#0a0a0a', '#0b0f19'],
    ['rgba(18, 18, 18', 'rgba(15, 23, 42'],
    ['rgba(30, 30, 30', 'rgba(30, 41, 59'], // Wait, originally was 30, 41, 59!
    
    // Gradients
    ['linear-gradient(135deg, #3b82f6, #2563eb)', 'linear-gradient(135deg, #4f46e5, #6366f1)'],
    ['linear-gradient(135deg, #3b82f6, #0ea5e9)', 'linear-gradient(135deg, #6366f1, #a855f7)'],
    ['linear-gradient(135deg, #0ea5e9, #3b82f6)', 'linear-gradient(135deg, #a855f7, #6366f1)'],
    ['linear-gradient(135deg, #2563eb, #1d4ed8)', 'linear-gradient(135deg, #4f46e5, #7c3aed)'],
    
    // Accents
    ['#60a5fa', '#818cf8'],
    ['#0ea5e9', '#a855f7'],
    ['rgba(59, 130, 246', 'rgba(99, 102, 241'],
    ['rgba(14, 165, 233', 'rgba(168, 85, 247'],
    ['rgba(37, 99, 235', 'rgba(79, 70, 229']
];

// Emoji fallbacks just in case the terminal completely destroyed them,
// we will replace any possible corrupted strings
const emojiFixes = {
    "ðŸŽŸï¸ ": "🎟️",
    "ðŸ  ": "🏠",
    "ðŸŽ«": "🎫",
    "âš™ï¸ ": "⚙️",
    "ðŸ‘¤": "👤",
    "â‚¹": "₹",
    "â† ": "←",
    "â˜…": "★",
    "ðŸ”’": "🔒",
    "âš ï¸ ": "⚠️",
    "ðŸ“…": "📅",
    "ðŸ“ ": "📍",
    "â€¢": "•",
    "ðŸš«": "🚫",
    "âœ¨": "✨",
    "ðŸ” ": "🔍",
    "â °": "⏳",
    "ðŸ“Š": "📊",
    "ðŸŽ‰": "🎉",
    "ðŸ ›ï¸ ": "🏛️",
    "âœ…": "✅",
    "â Œ": "❌",
    "ðŸ’°": "💰",
    "ðŸª‘": "🪑",
    "âœ✨": "✨"
};

function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Undo colors
            for (const [newVal, oldVal] of Object.values(replacements)) {
                if (content.includes(newVal)) {
                    content = content.split(newVal).join(oldVal);
                    modified = true;
                }
            }
            
            // Fix any remaining corrupted emojis
            for (const [corrupted, fixed] of Object.entries(emojiFixes)) {
                if (content.includes(corrupted)) {
                    content = content.split(corrupted).join(fixed);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Reverted: ${fullPath}`);
            }
        }
    }
}

fixFiles(directoryPath);
console.log('UI Restoration complete!');
