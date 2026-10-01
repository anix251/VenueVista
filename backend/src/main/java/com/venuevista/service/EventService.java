package com.venuevista.service;

import com.venuevista.exception.ResourceNotFoundException;
import com.venuevista.model.Event;
import com.venuevista.repository.EventRepository;
import com.venuevista.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    @Autowired
    public EventService(EventRepository eventRepository, VenueRepository venueRepository) {
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public Event createEvent(Event event) {
        if (event.getVenueId() != null) {
            venueRepository.findById(event.getVenueId())
                    .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + event.getVenueId()));
        }
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setEventTime(eventDetails.getEventTime());
        event.setCategory(eventDetails.getCategory());
        event.setPrice(eventDetails.getPrice());
        event.setVenueId(eventDetails.getVenueId());
        event.setImageUrl(eventDetails.getImageUrl());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
