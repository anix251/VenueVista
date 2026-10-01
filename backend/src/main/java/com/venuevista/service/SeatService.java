package com.venuevista.service;

import com.venuevista.exception.ResourceNotFoundException;
import com.venuevista.model.Seat;
import com.venuevista.repository.SeatRepository;
import com.venuevista.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final VenueRepository venueRepository;

    @Autowired
    public SeatService(SeatRepository seatRepository, VenueRepository venueRepository) {
        this.seatRepository = seatRepository;
        this.venueRepository = venueRepository;
    }

    public List<Seat> getSeatsByVenue(Long venueId) {
        return seatRepository.findByVenueId(venueId);
    }

    public List<Seat> getAvailableSeats(Long venueId) {
        return seatRepository.findByVenueIdAndAvailable(venueId, true);
    }

    public Seat createSeat(Seat seat) {
        if (seat.getVenueId() != null) {
            venueRepository.findById(seat.getVenueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + seat.getVenueId()));
        }
        return seatRepository.save(seat);
    }

    public Seat updateSeatAvailability(Long id, Boolean available) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + id));
        seat.setAvailable(available);
        return seatRepository.save(seat);
    }
}
