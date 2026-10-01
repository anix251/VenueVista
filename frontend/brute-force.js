const fs = require('fs');

function fixLineNumber(file, lineNumber, replacement) {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    if (lines.length > lineNumber - 1) {
        lines[lineNumber - 1] = replacement;
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        console.log(`Fixed line ${lineNumber} in ${file}`);
    }
}

// home.component.ts
const home = 'd:\\all programs\\VenueVista\\frontend\\src\\app\\pages\\home\\home.component.ts';
fixLineNumber(home, 83, '                  <span class="meta-icon">⏳</span>');
fixLineNumber(home, 87, '                  <span class="meta-icon">📍</span>');

// event-details.component.ts
const eventD = 'd:\\all programs\\VenueVista\\frontend\\src\\app\\pages\\event-details\\event-details.component.ts';
fixLineNumber(eventD, 41, '              <div class="info-icon">⏳</div>');
fixLineNumber(eventD, 49, '              <div class="info-icon">📍</div>');
fixLineNumber(eventD, 58, '              <div class="info-icon">🎟️</div>');

// admin-dashboard.component.ts
const admin = 'd:\\all programs\\VenueVista\\frontend\\src\\app\\pages\\admin-dashboard\\admin-dashboard.component.ts';
fixLineNumber(admin, 60, '            <div class="stat-icon">🎟️</div>');
fixLineNumber(admin, 76, '            <div class="stat-icon">❌</div>');
