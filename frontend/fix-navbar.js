const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'app', 'components', 'navbar', 'navbar.component.ts');
let content = fs.readFileSync(file, 'utf8');

// Use precise regex to replace corrupted areas in navbar
content = content.replace(/<div class="brand-icon">.*?<\/div>/, '<div class="brand-icon">🎟️</div>');
content = content.replace(/<a routerLink="\/" routerLinkActive="active" \[routerLinkActiveOptions\]="\{exact: true\}" class="nav-item">\s*.*?Events\s*<\/a>/, '<a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">\n            🏠 Events\n          </a>');
content = content.replace(/<a \*ngIf="activeUser" routerLink="\/my-bookings" routerLinkActive="active" class="nav-item">\s*.*?My Bookings\s*<\/a>/, '<a *ngIf="activeUser" routerLink="/my-bookings" routerLinkActive="active" class="nav-item">\n            🎫 My Bookings\n          </a>');
content = content.replace(/<a \*ngIf="activeUser\?\.role === 'ADMIN'" routerLink="\/admin" routerLinkActive="active" class="nav-item admin-badge">\s*.*?Admin Dashboard\s*<\/a>/, '<a *ngIf="activeUser?.role === \'ADMIN\'" routerLink="/admin" routerLinkActive="active" class="nav-item admin-badge">\n            ⚙️ Admin Dashboard\n          </a>');
content = content.replace(/<span class="user-icon">.*?<\/span>/, '<span class="user-icon">👤</span>');

fs.writeFileSync(file, content, 'utf8');
console.log("Navbar fixed via regex!");
