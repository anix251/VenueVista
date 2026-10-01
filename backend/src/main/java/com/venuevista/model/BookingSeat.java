package com.venuevista.model;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_seats")
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;

    private Long seatId;

    public BookingSeat() {
    }

    public BookingSeat(Long id, Long bookingId, Long seatId) {
        this.id = id;
        this.bookingId = bookingId;
        this.seatId = seatId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }
}
