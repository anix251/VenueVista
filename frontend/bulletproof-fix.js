const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'app');

function fixLine(file, regex, replacement) {
    let content = fs.readFileSync(file, 'utf8');
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed in ${path.basename(file)}: ${replacement.trim()}`);
    }
}

// admin-dashboard.component.ts
const adminFile = path.join(dir, 'pages', 'admin-dashboard', 'admin-dashboard.component.ts');
fixLine(adminFile, /<h1.*?>.*?Admin Dashboard & Sales Analytics<\/h1>/, '          <h1>⚙️ Admin Dashboard & Sales Analytics</h1>');
fixLine(adminFile, /<a .*?class="btn-home">.*?Main Site<\/a>/, '          <a routerLink="/" class="btn-home">🏠 Main Site</a>');
fixLine(adminFile, /.*?Venues \(\{\{ venues\.length \}\}\)/, '            🏛️ Venues ({{ venues.length }})');
fixLine(adminFile, /.*?All Bookings \(\{\{ allBookings\.length \}\}\)/, '            🎟️ All Bookings ({{ allBookings.length }})');
fixLine(adminFile, /<div class="stat-icon">.*?<\/div>/, '<div class="stat-icon">🎟️</div>'); // Wait, there's multiple stat icons. I will skip this and use a better regex.

// Since there are multiple stat icons, let's just do a blanket regex for the common non-ASCII strings found in the whole src directory
function fixAll(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixAll(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // We use ASCII word matching to find the corrupted blocks!
            content = content.replace(/[^\x00-\x7F]+ *Admin Dashboard & Sales Analytics/g, '⚙️ Admin Dashboard & Sales Analytics');
            content = content.replace(/[^\x00-\x7F]+ *Main Site/g, '🏠 Main Site');
            content = content.replace(/[^\x00-\x7F]+ *Venues \(/g, '🏛️ Venues (');
            content = content.replace(/[^\x00-\x7F]+ *All Bookings \(/g, '🎟️ All Bookings (');
            
            // my-bookings.component.ts
            content = content.replace(/<div class="empty-icon">[^\x00-\x7F]+<\/div>/g, '<div class="empty-icon">🎟️</div>');
            content = content.replace(/[^\x00-\x7F]+ *Venue:/g, '📍 Venue:');
            
            // seat-selection.component.ts
            content = content.replace(/[^\x00-\x7F]+ *Back to Event Details/g, '← Back to Event Details');
            content = content.replace(/[^\x00-\x7F]+ *\{\{ errorMessage \}\}/g, '⚠️ {{ errorMessage }}');
            
            // home.component.ts
            content = content.replace(/placeholder="[^\x00-\x7F]+ *Search events/g, 'placeholder="🔍 Search events');
            content = content.replace(/<span class="meta-icon">[^\x00-\x7F]+<\/span>/g, function(match) {
                // If it's near date logic, it's calendar. There are 3 meta icons: 📅, ⏳, 📍
                return match; // Too risky, we will manually replace the exact blocks
            });
            
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    }
}
fixAll(dir);

// Fix specific lines precisely
const homeFile = path.join(dir, 'pages', 'home', 'home.component.ts');
let homeContent = fs.readFileSync(homeFile, 'utf8');
homeContent = homeContent.replace(/<span class="meta-icon">[^\x00-\x7F]+<\/span>\s*\{\{ event\.date/g, '<span class="meta-icon">📅</span>\n                    {{ event.date');
homeContent = homeContent.replace(/<span class="meta-icon">[^\x00-\x7F]+<\/span>\s*\{\{ event\.time/g, '<span class="meta-icon">⏳</span>\n                    {{ event.time');
homeContent = homeContent.replace(/<span class="meta-icon">[^\x00-\x7F]+<\/span>\s*\{\{ event\.location/g, '<span class="meta-icon">📍</span>\n                    {{ event.location');
fs.writeFileSync(homeFile, homeContent, 'utf8');

const eventDetailsFile = path.join(dir, 'pages', 'event-details', 'event-details.component.ts');
let eventContent = fs.readFileSync(eventDetailsFile, 'utf8');
eventContent = eventContent.replace(/[^\x00-\x7F]+ *Back to All Events/g, '← Back to All Events');
eventContent = eventContent.replace(/<div class="info-icon">[^\x00-\x7F]+<\/div>\s*<div class="info-details">\s*<div class="info-label">Time/g, '<div class="info-icon">⏳</div>\n              <div class="info-details">\n                <div class="info-label">Time');
eventContent = eventContent.replace(/<div class="info-icon">[^\x00-\x7F]+<\/div>\s*<div class="info-details">\s*<div class="info-label">Location/g, '<div class="info-icon">📍</div>\n              <div class="info-details">\n                <div class="info-label">Location');
eventContent = eventContent.replace(/<div class="info-icon">[^\x00-\x7F]+<\/div>\s*<div class="info-details">\s*<div class="info-label">Base Price/g, '<div class="info-icon">🎟️</div>\n              <div class="info-details">\n                <div class="info-label">Base Price');
eventContent = eventContent.replace(/[^\x00-\x7F]+ *Select Seats & Book Tickets/g, '🎟️ Select Seats & Book Tickets');
fs.writeFileSync(eventDetailsFile, eventContent, 'utf8');

const adminDashboardFile = path.join(dir, 'pages', 'admin-dashboard', 'admin-dashboard.component.ts');
let adminContent = fs.readFileSync(adminDashboardFile, 'utf8');
adminContent = adminContent.replace(/<div class="stat-icon">[^\x00-\x7F]+<\/div>\s*<\/div>\s*<div class="stat-info">\s*<span class="stat-label">Total Bookings/g, '<div class="stat-icon">🎟️</div>\n            </div>\n            <div class="stat-info">\n              <span class="stat-label">Total Bookings');
adminContent = adminContent.replace(/<div class="stat-icon">[^\x00-\x7F]+<\/div>\s*<\/div>\s*<div class="stat-info">\s*<span class="stat-label">Cancelled/g, '<div class="stat-icon">❌</div>\n            </div>\n            <div class="stat-info">\n              <span class="stat-label">Cancelled');
fs.writeFileSync(adminDashboardFile, adminContent, 'utf8');

const appFile = path.join(dir, 'app.ts');
let appContent = fs.readFileSync(appFile, 'utf8');
appContent = appContent.replace(/<p>[^\x00-\x7F]+/g, '<p>©');
fs.writeFileSync(appFile, appContent, 'utf8');

console.log("Bulletproof Restoration Complete!");
