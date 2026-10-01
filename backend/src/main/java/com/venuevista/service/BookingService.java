package com.venuevista.service;

import com.venuevista.dto.BookingRequestDto;
import com.venuevista.dto.BookingResponseDto;
import com.venuevista.exception.BadRequestException;
import com.venuevista.exception.ResourceNotFoundException;
import com.venuevista.model.*;
import com.venuevista.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
                          BookingSeatRepository bookingSeatRepository,
                          EventRepository eventRepository,
                          VenueRepository venueRepository,
                          SeatRepository seatRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {
        // 1. Check Event
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        // 2. Check User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // 3. Check Seats
        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            throw new BadRequestException("At least one seat must be selected for booking.");
        }

        List<Seat> seatsToBook = new ArrayList<>();
        double seatsTotal = 0.0;

        for (Long seatId : request.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + seatId));

            if (!seat.isAvailable()) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is already booked or unavailable.");
            }
            seatsToBook.add(seat);
            seatsTotal += (seat.getPrice() != null ? seat.getPrice() : 0.0);
        }

        double basePrice = event.getPrice() != null ? event.getPrice() : 0.0;
        double totalAmount = basePrice + seatsTotal;

        // 4. Create Booking
        Booking booking = new Booking();
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalAmount(totalAmount);
        booking.setStatus("CONFIRMED");
        booking.setUserId(user.getId());
        booking.setEventId(event.getId());

        Booking savedBooking = bookingRepository.save(booking);

        // 5. Save BookingSeats and mark Seats unavailable
        for (Seat seat : seatsToBook) {
            BookingSeat bookingSeat = new BookingSeat(null, savedBooking.getId(), seat.getId());
            bookingSeatRepository.save(bookingSeat);

            seat.setAvailable(false);
            seatRepository.save(seat);
        }

        return mapToResponseDto(savedBooking, user, event, seatsToBook);
    }

    public BookingResponseDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return buildResponseDto(booking);
    }

    public List<BookingResponseDto> getBookingsByUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Booking> userBookings = bookingRepository.findByUserId(userId);
        return userBookings.stream()
                .map(this::buildResponseDto)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::buildResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);

        // Make seats available again
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(id);
        for (BookingSeat bs : bookingSeats) {
            seatRepository.findById(bs.getSeatId()).ifPresent(seat -> {
                seat.setAvailable(true);
                seatRepository.save(seat);
            });
        }

        return buildResponseDto(updatedBooking);
    }

    private BookingResponseDto buildResponseDto(Booking booking) {
        User user = userRepository.findById(booking.getUserId()).orElse(null);
        Event event = eventRepository.findById(booking.getEventId()).orElse(null);

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(booking.getId());
        List<Seat> seats = bookingSeats.stream()
                .map(bs -> seatRepository.findById(bs.getSeatId()).orElse(null))
                .filter(s -> s != null)
                .collect(Collectors.toList());

        return mapToResponseDto(booking, user, event, seats);
    }

    private BookingResponseDto mapToResponseDto(Booking booking, User user, Event event, List<Seat> seats) {
        String userName = user != null ? user.getName() : "Unknown User";
        String eventName = event != null ? event.getName() : "Unknown Event";

        String venueName = "N/A";
        if (event != null && event.getVenueId() != null) {
            Venue venue = venueRepository.findById(event.getVenueId()).orElse(null);
            if (venue != null) {
                venueName = venue.getName();
            }
        }

        return new BookingResponseDto(
                booking.getId(),
                booking.getBookingDate(),
                booking.getTotalAmount(),
                booking.getStatus(),
                booking.getUserId(),
                userName,
                booking.getEventId(),
                eventName,
                venueName,
                seats
        );
    }
}
