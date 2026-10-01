const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app');

const replacements = {
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
    "ðŸª‘": "🪑"
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
            
            for (const [corrupted, fixed] of Object.entries(replacements)) {
                if (content.includes(corrupted)) {
                    content = content.split(corrupted).join(fixed);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed: ${fullPath}`);
            }
        }
    }
}

fixFiles(directoryPath);
console.log('Emoji restoration complete!');
