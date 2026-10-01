package com.venuevista.config;

import com.venuevista.dto.BookingRequestDto;
import com.venuevista.model.*;
import com.venuevista.repository.*;
import com.venuevista.service.BookingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public DataInitializer(VenueRepository venueRepository,
                           EventRepository eventRepository,
                           SeatRepository seatRepository,
                           UserRepository userRepository,
                           BookingRepository bookingRepository,
                           BookingService bookingService) {
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println(">>> Creating Initial Users...");
            User user1 = userRepository.save(new User(null, "John Doe", "john.doe@example.com", "password123", "CUSTOMER"));
            User user2 = userRepository.save(new User(null, "Jane Smith", "jane.smith@example.com", "password123", "CUSTOMER"));
            userRepository.save(new User(null, "Admin User", "admin@venuevista.com", "admin123", "ADMIN"));
        } else if (userRepository.findByEmail("admin@venuevista.com").isEmpty()) {
            userRepository.save(new User(null, "Admin User", "admin@venuevista.com", "admin123", "ADMIN"));
        }

        if (venueRepository.count() > 0) {
            return; // Data already seeded for venues/events
        }

        System.out.println(">>> Seeding Sample Data for VenueVista...");

        // 1. Create Venues
        Venue venue1 = venueRepository.save(new Venue(null, "Grand City Hall", "Downtown Plaza, Main St", 25));
        Venue venue2 = venueRepository.save(new Venue(null, "Metro Arena", "Tech City, Sector 5", 25));
        Venue venue3 = venueRepository.save(new Venue(null, "Tech Auditorium", "University Campus, Block B", 20));

        // 2. Create Seats for Venues
        createSeatsForVenue(venue1.getId());
        createSeatsForVenue(venue2.getId());
        createSeatsForVenue(venue3.getId());

        // 3. Create Events
        Event event1 = new Event(
                null,
                "Tech Fest 2026",
                "Join top innovators, keynote speakers, and developers for a day of AI, cloud architecture, and modern web tech.",
                LocalDate.of(2026, 10, 15),
                "10:00 AM",
                "Technology",
                500.0,
                venue1.getId(),
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
        );

        Event event2 = new Event(
                null,
                "Music Night 2026",
                "An electrifying live concert featuring acoustic bands, rock legends, and classical symphony performances.",
                LocalDate.of(2026, 11, 20),
                "06:30 PM",
                "Entertainment",
                750.0,
                venue2.getId(),
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
        );

        Event event3 = new Event(
                null,
                "Startup Meetup 2026",
                "Network with venture capitalists, tech founders, and industry experts looking for early-stage investments.",
                LocalDate.of(2026, 12, 05),
                "02:00 PM",
                "Business",
                300.0,
                venue3.getId(),
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80"
        );

        Event event4 = new Event(
                null,
                "College Cultural Fest 2026",
                "Annual inter-college extravaganza featuring dance battles, drama, art showcases, and DJ night.",
                LocalDate.of(2026, 10, 30),
                "04:00 PM",
                "Cultural",
                200.0,
                venue1.getId(),
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80"
        );

        eventRepository.saveAll(Arrays.asList(event1, event2, event3, event4));

        // 4. Sample Booking (using the existing John Doe if possible)
        User user1 = userRepository.findByEmail("john.doe@example.com").orElse(null);
        if (user1 != null) {
            List<Seat> venue1Seats = seatRepository.findByVenueId(venue1.getId());
            if (venue1Seats.size() >= 2) {
                BookingRequestDto bookingReq = new BookingRequestDto(
                        user1.getId(),
                        event1.getId(),
                        Arrays.asList(venue1Seats.get(0).getId(), venue1Seats.get(1).getId())
                );
                try {
                    bookingService.createBooking(bookingReq);
                } catch(Exception e) {} // ignore if already booked
            }
        }

        System.out.println(">>> Sample Data Seeding Completed Successfully!");
    }

    private void createSeatsForVenue(Long venueId) {
        char[] rows = {'A', 'B', 'C', 'D', 'E'};
        int seatsPerRow = 5;

        for (char row : rows) {
            for (int i = 1; i <= seatsPerRow; i++) {
                String rowStr = String.valueOf(row);
                String seatNum = rowStr + i;
                String seatType = (row == 'A' || row == 'B') ? "PREMIUM" : "REGULAR";
                double price = (row == 'A' || row == 'B') ? 250.0 : 150.0;

                Seat seat = new Seat(null, seatNum, rowStr, seatType, price, true, venueId);
                seatRepository.save(seat);
            }
        }
    }
}
