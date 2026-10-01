const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'app');

function fixFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Regex replacements
            const regexes = [
                [/ðŸŽŸï¸ /g, '🎟️'],
                [/ðŸ  /g, '🏠'],
                [/ðŸŽ«/g, '🎫'],
                [/âš™ï¸ /g, '⚙️'],
                [/ðŸ‘¤/g, '👤'],
                [/â‚¹/g, '₹'],
                [/â† /g, '←'],
                [/â˜…/g, '★'],
                [/ðŸ”’/g, '🔒'],
                [/âš ï¸ /g, '⚠️'],
                [/ðŸ“…/g, '📅'],
                [/ðŸ“ /g, '📍'],
                [/â€¢/g, '•'],
                [/ðŸš«/g, '🚫'],
                [/âœ✨/g, '✨'],
                [/ðŸ” /g, '🔍'],
                [/â °/g, '⏳'],
                [/ðŸ“Š/g, '📊'],
                [/ðŸŽ‰/g, '🎉'],
                [/ðŸ ›ï¸ /g, '🏛️'],
                [/âœ…/g, '✅'],
                [/â Œ/g, '❌'],
                [/ðŸ’°/g, '💰'],
                [/ðŸª‘/g, '🪑']
            ];

            for (const [regex, fixed] of regexes) {
                if (regex.test(content)) {
                    content = content.replace(regex, fixed);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Regex Restored: ${fullPath}`);
            }
        }
    }
}

fixFiles(dir);
console.log("Ultimate Regex Restoration Complete!");
