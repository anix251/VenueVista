package com.venuevista.repository;

import com.venuevista.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByVenueId(Long venueId);
    List<Seat> findByVenueIdAndAvailable(Long venueId, Boolean available);
    long countByAvailable(Boolean available);
}
