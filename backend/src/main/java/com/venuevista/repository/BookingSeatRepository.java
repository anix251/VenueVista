package com.venuevista.repository;

import com.venuevista.model.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByBookingId(Long bookingId);
    void deleteByBookingId(Long bookingId);
}
