package com.venuevista.dto;

import com.venuevista.model.Seat;
import java.time.LocalDateTime;
import java.util.List;

public class BookingResponseDto {

    private Long bookingId;
    private LocalDateTime bookingDate;
    private Double totalAmount;
    private String status;
    private Long userId;
    private String userName;
    private Long eventId;
    private String eventName;
    private String venueName;
    private List<Seat> seats;

    public BookingResponseDto() {
    }

    public BookingResponseDto(Long bookingId, LocalDateTime bookingDate, Double totalAmount, String status, Long userId, String userName, Long eventId, String eventName, String venueName, List<Seat> seats) {
        this.bookingId = bookingId;
        this.bookingDate = bookingDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.userId = userId;
        this.userName = userName;
        this.eventId = eventId;
        this.eventName = eventName;
        this.venueName = venueName;
        this.seats = seats;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
}
