const fs = require('fs');

function fix(file, regex, replacement) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content, 'utf8');
}

// home.component.ts
const home = 'd:\\all programs\\VenueVista\\frontend\\src\\app\\pages\\home\\home.component.ts';
fix(home, /<span class="meta-icon">[^\x00-\x7F]+<\/span>\s*\{\{ event.time \}\}/, '<span class="meta-icon">⏳</span>\n                    {{ event.time }}');
fix(home, /<span class="meta-icon">[^\x00-\x7F]+<\/span>\s*\{\{ event.location \}\}/, '<span class="meta-icon">📍</span>\n                    {{ event.location }}');

// event-details.component.ts
const eventD = 'd:\\all programs\\VenueVista\\frontend\\src\\app\\pages\\event-details\\event-details.component.ts';
fix(eventD, /<div class="info-icon">[^\x00-\x7F]+<\/div>\s*<div class="info-details">\s*<div class="info-label">Time<\/div>/, '<div class="info-icon">⏳</div>\n              <div class="info-details">\n                <div class="info-label">Time</div>');
fix(eventD, /<div class="info-icon">[^\x00-\x7F]+<\/div>\s*<div class="info-details">\s*<div class="info-label">Location<\/div>/, '<div class="info-icon">📍</div>\n              <div class="info-details">\n                <div class="info-label">Location</div>');
fix(eventD, /<div class="info-icon">[^\x00-\x7F]+<\/div>\s*<div class="info-details">\s*<div class="info-label">Base Price<\/div>/, '<div class="info-icon">🎟️</div>\n              <div class="info-details">\n                <div class="info-label">Base Price</div>');

// admin-dashboard.component.ts
const admin = 'd:\\all programs\\VenueVista\\frontend\\src\\app\\pages\\admin-dashboard\\admin-dashboard.component.ts';
fix(admin, /<div class="stat-icon">[^\x00-\x7F]+<\/div>\s*<\/div>\s*<div class="stat-info">\s*<span class="stat-label">Total Bookings<\/span>/, '<div class="stat-icon">🎟️</div>\n            </div>\n            <div class="stat-info">\n              <span class="stat-label">Total Bookings</span>');
fix(admin, /<div class="stat-icon">[^\x00-\x7F]+<\/div>\s*<\/div>\s*<div class="stat-info">\s*<span class="stat-label">Cancelled<\/span>/, '<div class="stat-icon">❌</div>\n            </div>\n            <div class="stat-info">\n              <span class="stat-label">Cancelled</span>');
