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

// 1. Fix Home Component
replaceFile(
    path.join(__dirname, 'src/app/pages/home/home.component.ts'),
    [
        ['{{ event.title }}', '{{ event.name }}'],
        ['{{ event.date }}', '{{ event.eventDate }}'],
        ['{{ event.time }}', '{{ event.eventTime }}'],
        ['{{ event.venueName }}', 'Venue ID: {{ event.venueId }}'],
        ['<span class="city-name">{{ event.location }}</span>', ''],
        ['e.title.toLowerCase().includes(q) ||', 'e.name.toLowerCase().includes(q);'],
        ['e.venueName.toLowerCase().includes(q) ||', ''],
        ['e.location.toLowerCase().includes(q);', '']
    ]
);

// 2. Fix Event Details Component
replaceFile(
    path.join(__dirname, 'src/app/pages/event-details/event-details.component.ts'),
    [
        ['{{ event.title }}', '{{ event.name }}'],
        ['{{ event.date }}', '{{ event.eventDate }}'],
        ['{{ event.time }}', '{{ event.eventTime }}'],
        ['{{ event.venueName }}', 'Venue ID: {{ event.venueId }}'],
        ['<span class="info-value">{{ event.location }}</span>', ''],
        ['<p>{{ event.location }}</p>', ''],
        ['<div class="info-item">\n                <span class="info-label">Location</span>\n                <span class="info-value"></span>\n              </div>', '']
    ]
);

// 3. Fix Seat Selection Component
replaceFile(
    path.join(__dirname, 'src/app/pages/seat-selection/seat-selection.component.ts'),
    [
        ["import { Seat, SeatType } from '../../models/venue.model';", "import { Seat } from '../../models/seat.model';"],
        ["import { VenueService } from '../../services/venue.service';", "import { SeatService } from '../../services/seat.service';"],
        ["private venueService: VenueService,", "private seatService: SeatService,"],
        ["this.venueService.getVenueSeats(this.event.venueId)", "this.seatService.getSeatsByVenue(this.event.venueId)"],
        ["s.seatType === SeatType.PREMIUM", "s.seatType === 'PREMIUM'"],
        ["{{ event.title }}", "{{ event.name }}"],
        ["{{ event.date }}", "{{ event.eventDate }}"],
        ["{{ event.time }}", "{{ event.eventTime }}"],
        ["{{ event.venueName }}", "Venue ID: {{ event.venueId }}"],
        ["totalAmount: this.getTotalAmount()", ""], // Removing totalAmount from BookingRequest
        [",\n      totalAmount: this.getTotalAmount()", ""],
        ["seatIds: this.selectedSeats.map(s => s.id)", "seatIds: this.selectedSeats.map(s => s.id!)"],
        ["seatIds: this.selectedSeats.map(s => s.id!)", "seatIds: this.selectedSeats.map(s => s.id as number)"] // TS strict fix
    ]
);

// 4. Fix My Bookings Component
replaceFile(
    path.join(__dirname, 'src/app/pages/my-bookings/my-bookings.component.ts'),
    [
        ["import { Booking, BookingStatus } from '../../models/booking.model';", "import { BookingResponse } from '../../models/booking.model';"],
        ["bookings: Booking[] = [];", "bookings: BookingResponse[] = [];"],
        ["this.bookingService.getUserBookings(user.id)", "this.bookingService.getBookingsByUser(user.id)"],
        ["{{ b.id }}", "{{ b.bookingId }}"],
        ["{{ b.eventTitle }}", "{{ b.eventName }}"],
        ["b.id === bookingId", "b.bookingId === bookingId"],
        ["b.id", "b.bookingId"],
        ["(updatedBooking) =>", "(updatedBooking: BookingResponse) =>"],
        ["(data) =>", "(data: BookingResponse[]) =>"],
        ["(a, b) =>", "(a: BookingResponse, b: BookingResponse) =>"],
        ["(err) =>", "(err: any) =>"]
    ]
);

// 5. Fix Login Component
replaceFile(
    path.join(__dirname, 'src/app/pages/login/login.component.ts'),
    [
        ["this.userService.login(this.email, this.password)", "this.userService.login({ email: this.email, password: this.password })"]
    ]
);

// 6. Fix Signup Component
replaceFile(
    path.join(__dirname, 'src/app/pages/signup/signup.component.ts'),
    [
        ["this.userService.register(this.name, this.email, this.password)", "this.userService.register({ name: this.name, email: this.email, password: this.password, role: 'CUSTOMER' })"]
    ]
);

// 7. Fix Admin Dashboard Component
replaceFile(
    path.join(__dirname, 'src/app/pages/admin-dashboard/admin-dashboard.component.ts'),
    [
        ["import { Booking } from '../../models/booking.model';", "import { BookingResponse } from '../../models/booking.model';"],
        ["allBookings: Booking[] = [];", "allBookings: BookingResponse[] = [];"],
        ["{{ b.id }}", "{{ b.bookingId }}"],
        ["{{ b.eventTitle }}", "{{ b.eventName }}"],
        ["{{ e.title }}", "{{ e.name }}"],
        ["{{ e.date }}", "{{ e.eventDate }}"],
        ["{{ e.time }}", "{{ e.eventTime }}"],
        ["{{ e.venueName }}", "Venue ID: {{ e.venueId }}"],
        ["<br><span class=\"sub-text\">{{ e.location }}</span>", ""]
    ]
);

console.log("Compilation fixes applied!");
