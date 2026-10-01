const fs = require('fs');
const path = require('path');

function replaceFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [oldStr, newStr] of replacements) {
        content = content.split(oldStr).join(newStr);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${path.basename(filePath)}`);
}

// 1. Fix Admin Dashboard
replaceFile(
    path.join(__dirname, 'src/app/pages/admin-dashboard/admin-dashboard.component.ts'),
    [
        ['deleteEvent(e.id)', 'deleteEvent(e.id!)'],
        ['getDashboardAnalytics()', 'getAnalytics()'],
        ['data => this.analytics = data', '(data: any) => this.analytics = data']
    ]
);

// 2. Fix My Bookings
replaceFile(
    path.join(__dirname, 'src/app/pages/my-bookings/my-bookings.component.ts'),
    [
        ['getBookingsByUser(user.id)', 'getBookingsByUser(user.id!)']
    ]
);

// 3. Fix Seat Selection
replaceFile(
    path.join(__dirname, 'src/app/pages/seat-selection/seat-selection.component.ts'),
    [
        ['isSelected(seat.id)', 'isSelected(seat.id!)'],
        ['userId: this.activeUser.id', 'userId: this.activeUser.id!'],
        ['eventId: this.event.id', 'eventId: this.event.id!']
    ]
);

console.log("Strict compilation fixes applied!");
