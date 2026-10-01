package com.venuevista.service;

import com.venuevista.exception.ResourceNotFoundException;
import com.venuevista.model.Venue;
import com.venuevista.model.Seat;
import com.venuevista.repository.VenueRepository;
import com.venuevista.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;
    private final SeatRepository seatRepository;

    @Autowired
    public VenueService(VenueRepository venueRepository, SeatRepository seatRepository) {
        this.venueRepository = venueRepository;
        this.seatRepository = seatRepository;
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Venue getVenueById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
    }

    public Venue createVenue(Venue venue) {
        Venue savedVenue = venueRepository.save(venue);
        // Automatically generate initial seats for venue if capacity is set and no seats exist
        if (venue.getCapacity() != null && venue.getCapacity() > 0) {
            generateDefaultSeatsForVenue(savedVenue.getId(), venue.getCapacity());
        }
        return savedVenue;
    }

    public Venue updateVenue(Long id, Venue venueDetails) {
        Venue venue = getVenueById(id);
        venue.setName(venueDetails.getName());
        venue.setLocation(venueDetails.getLocation());
        venue.setCapacity(venueDetails.getCapacity());
        return venueRepository.save(venue);
    }

    public void deleteVenue(Long id) {
        Venue venue = getVenueById(id);
        // Delete seats belonging to venue
        List<Seat> seats = seatRepository.findByVenueId(id);
        seatRepository.deleteAll(seats);
        venueRepository.delete(venue);
    }

    private void generateDefaultSeatsForVenue(Long venueId, int capacity) {
        char[] rows = {'A', 'B', 'C', 'D', 'E', 'F'};
        int seatsPerRow = 5;
        int count = 0;

        for (char row : rows) {
            for (int i = 1; i <= seatsPerRow; i++) {
                if (count >= capacity) break;
                String rowStr = String.valueOf(row);
                String seatNum = rowStr + i;
                String seatType = (row == 'A' || row == 'B') ? "PREMIUM" : "REGULAR";
                double seatPrice = (row == 'A' || row == 'B') ? 250.0 : 150.0;

                Seat seat = new Seat(null, seatNum, rowStr, seatType, seatPrice, true, venueId);
                seatRepository.save(seat);
                count++;
            }
            if (count >= capacity) break;
        }
    }
}
