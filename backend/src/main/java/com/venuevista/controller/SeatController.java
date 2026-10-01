package com.venuevista.controller;

import com.venuevista.model.Seat;
import com.venuevista.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class SeatController {

    private final SeatService seatService;

    @Autowired
    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/api/venues/{venueId}/seats")
    public ResponseEntity<List<Seat>> getSeatsByVenue(@PathVariable Long venueId) {
        return ResponseEntity.ok(seatService.getSeatsByVenue(venueId));
    }

    @GetMapping("/api/venues/{venueId}/seats/available")
    public ResponseEntity<List<Seat>> getAvailableSeats(@PathVariable Long venueId) {
        return ResponseEntity.ok(seatService.getAvailableSeats(venueId));
    }

    @PostMapping("/api/seats")
    public ResponseEntity<Seat> createSeat(@RequestBody Seat seat) {
        return new ResponseEntity<>(seatService.createSeat(seat), HttpStatus.CREATED);
    }

    @PutMapping("/api/seats/{id}")
    public ResponseEntity<Seat> updateSeatAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Boolean available = payload.getOrDefault("available", true);
        return ResponseEntity.ok(seatService.updateSeatAvailability(id, available));
    }
}
