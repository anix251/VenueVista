package com.venuevista.dto;

import java.util.List;

public class BookingRequestDto {

    private Long userId;
    private Long eventId;
    private List<Long> seatIds;

    public BookingRequestDto() {
    }

    public BookingRequestDto(Long userId, Long eventId, List<Long> seatIds) {
        this.userId = userId;
        this.eventId = eventId;
        this.seatIds = seatIds;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public List<Long> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Long> seatIds) {
        this.seatIds = seatIds;
    }
}
