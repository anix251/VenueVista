package com.venuevista.service;

import com.venuevista.dto.AnalyticsDto;
import com.venuevista.model.Booking;
import com.venuevista.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;

    @Autowired
    public AnalyticsService(EventRepository eventRepository,
                            BookingRepository bookingRepository,
                            SeatRepository seatRepository) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
    }

    public AnalyticsDto getAnalytics() {
        long totalEvents = eventRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus("CONFIRMED");
        long cancelledBookings = bookingRepository.countByStatus("CANCELLED");

        List<Booking> allBookings = bookingRepository.findAll();
        double totalRevenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                .sum();

        long availableSeats = seatRepository.countByAvailable(true);
        long bookedSeats = seatRepository.countByAvailable(false);

        return new AnalyticsDto(
                totalEvents,
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                totalRevenue,
                availableSeats,
                bookedSeats
        );
    }
}
