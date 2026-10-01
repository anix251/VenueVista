const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'app');

const preciseReplacements = {
    // navbar.component.ts
    '<div class="brand-icon">ðŸŽŸï¸ </div>': '<div class="brand-icon">🎟️</div>',
    'ðŸ   Events': '🏠 Events',
    'ðŸŽ« My Bookings': '🎫 My Bookings',
    'âš™ï¸  Admin Dashboard': '⚙️ Admin Dashboard',
    '<span class="user-icon">ðŸ‘¤</span>': '<span class="user-icon">👤</span>',

    // admin-dashboard.component.ts
    'âš™ï¸  Admin Dashboard & Sales Analytics': '⚙️ Admin Dashboard & Sales Analytics',
    'ðŸ   Main Site': '🏠 Main Site',
    'ðŸ“Š Analytics': '📊 Analytics',
    'ðŸŽ‰ Events ({{ events.length }})': '🎉 Events ({{ events.length }})',
    'ðŸ ›ï¸  Venues ({{ venues.length }})': '🏛️ Venues ({{ venues.length }})',
    'ðŸŽŸï¸  All Bookings ({{ allBookings.length }})': '🎟️ All Bookings ({{ allBookings.length }})',
    '<div class="stat-icon">ðŸŽ‰</div>': '<div class="stat-icon">🎉</div>',
    '<div class="stat-icon">ðŸŽŸï¸ </div>': '<div class="stat-icon">🎟️</div>',
    '<div class="stat-icon">âœ…</div>': '<div class="stat-icon">✅</div>',
    '<div class="stat-icon">â Œ</div>': '<div class="stat-icon">❌</div>',
    '<div class="stat-icon">ðŸ’°</div>': '<div class="stat-icon">💰</div>',
    '<div class="stat-icon">ðŸª‘</div>': '<div class="stat-icon">🪑</div>',
    'Base Price (â‚¹)': 'Base Price (₹)',
    '<span class="stat-value">â‚¹{{ analytics.totalRevenue }}</span>': '<span class="stat-value">₹{{ analytics.totalRevenue }}</span>',
    '<td class="price-cell">â‚¹{{ e.price }}</td>': '<td class="price-cell">₹{{ e.price }}</td>',
    '<td class="price-cell">â‚¹{{ b.totalAmount }}</td>': '<td class="price-cell">₹{{ b.totalAmount }}</td>',

    // event-details.component.ts
    'â†  Back to All Events': '← Back to All Events',
    '<div class="info-icon">ðŸ“…</div>': '<div class="info-icon">📅</div>',
    '<div class="info-icon">â °</div>': '<div class="info-icon">⏳</div>',
    '<div class="info-icon">ðŸ“ </div>': '<div class="info-icon">📍</div>',
    '<div class="info-icon">ðŸŽŸï¸ </div>': '<div class="info-icon">🎟️</div>',
    '<div class="info-value price">â‚¹{{ event.price }}</div>': '<div class="info-value price">₹{{ event.price }}</div>',
    'ðŸŽŸï¸  Select Seats & Book Tickets': '🎟️ Select Seats & Book Tickets',

    // home.component.ts
    '✨ College HCL Event Ticketing MVP': '✨ College HCL Event Ticketing MVP', // if already ok
    'âœ✨ College HCL Event Ticketing MVP': '✨ College HCL Event Ticketing MVP',
    'placeholder="ðŸ”  Search events, venues, or locations..."': 'placeholder="🔍 Search events, venues, or locations..."',
    '<div class="empty-icon">ðŸŽŸï¸ </div>': '<div class="empty-icon">🎟️</div>',
    '<span class="meta-icon">ðŸ“…</span>': '<span class="meta-icon">📅</span>',
    '<span class="meta-icon">â °</span>': '<span class="meta-icon">⏳</span>',
    '<span class="meta-icon">ðŸ“ </span>': '<span class="meta-icon">📍</span>',
    '<span class="price-value">â‚¹{{ event.price }}</span>': '<span class="price-value">₹{{ event.price }}</span>',

    // my-bookings.component.ts
    '<h1>ðŸŽ« My Bookings</h1>': '<h1>🎫 My Bookings</h1>',
    'ðŸ“… Booked on {{ formatDate(b.bookingDate) }}': '📅 Booked on {{ formatDate(b.bookingDate) }}',
    '<p class="venue-info">ðŸ“  Venue: <strong>{{ b.venueName }}</strong></p>': '<p class="venue-info">📍 Venue: <strong>{{ b.venueName }}</strong></p>',
    'Row {{ seat.rowNumber }} â€¢ {{ seat.seatType }}': 'Row {{ seat.rowNumber }} • {{ seat.seatType }}',
    '<span class="amount-value">â‚¹{{ b.totalAmount }}</span>': '<span class="amount-value">₹{{ b.totalAmount }}</span>',
    'ðŸš« Cancel Booking': '🚫 Cancel Booking',

    // seat-selection.component.ts
    'â†  Back to Event Details': '← Back to Event Details',
    '<span>Regular (â‚¹150)</span>': '<span>Regular (₹150)</span>',
    '<span>Premium (â‚¹250)</span>': '<span>Premium (₹250)</span>',
    "[title]=\"seat.seatNumber + ' - ' + seat.seatType + ' (â‚¹' + seat.price + ')'\"": "[title]=\"seat.seatNumber + ' - ' + seat.seatType + ' (₹' + seat.price + ')'\"",
    "{{ seat.seatType === 'PREMIUM' ? 'â˜…' : '' }}": "{{ seat.seatType === 'PREMIUM' ? '★' : '' }}",
    '<span class="lock-icon" *ngIf="!seat.available">ðŸ”’</span>': '<span class="lock-icon" *ngIf="!seat.available">🔒</span>',
    'â‚¹{{ event.price }} + â‚¹{{ getSeatsTotal() }}': '₹{{ event.price }} + ₹{{ getSeatsTotal() }}',
    '<span class="total-amount">â‚¹{{ getTotalAmount() }}</span>': '<span class="total-amount">₹{{ getTotalAmount() }}</span>',
    'Confirm Booking (â‚¹{{ getTotalAmount() }})': 'Confirm Booking (₹{{ getTotalAmount() }})',
    'âš ï¸  {{ errorMessage }}': '⚠️ {{ errorMessage }}'
};

function fixFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const [corrupted, fixed] of Object.entries(preciseReplacements)) {
                if (content.includes(corrupted)) {
                    content = content.split(corrupted).join(fixed);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Perfectly Restored: ${fullPath}`);
            }
        }
    }
}

fixFiles(dir);
console.log("Ultimate Restoration Complete!");
