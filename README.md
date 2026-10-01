# VenueVista: EventPro Ticketing & Venue Management

VenueVista is a full-stack **Event Ticketing and Venue Management System** built as an MVP for college HCL training. The application follows a clean, beginner-friendly architecture with separation of concerns.

---

## 🚀 Technology Stack

### Backend
- **Java 17 / 25**
- **Spring Boot 3.2.3** (Spring Web, Spring Data JPA)
- **MySQL / H2 Database**
- **Maven**
- **REST APIs**

### Frontend
- **Angular 21**
- **TypeScript**
- **HTML5 & CSS3**
- **Angular HttpClient**

---

## 🏗️ Architecture

The backend follows the standard layered enterprise architecture:

```
[ Angular Frontend (Port 4200) ]
              │ (REST HTTP / JSON)
              ▼
    [ EventController / VenueController / SeatController / BookingController ]
              │
              ▼
    [ EventService / VenueService / SeatService / BookingService / AnalyticsService ]
              │
              ▼
    [ EventRepository / VenueRepository / SeatRepository / BookingRepository ]
              │
              ▼
      [ Database (MySQL / H2) ]
```

---

## 📁 Folder Structure

```
VenueVista/
├── backend/                        # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/venuevista/
│       │   ├── config/             # CorsConfig, DataInitializer
│       │   ├── controller/         # EventController, VenueController, SeatController, BookingController, UserController, AnalyticsController
│       │   ├── dto/                # BookingRequestDto, BookingResponseDto, AnalyticsDto
│       │   ├── exception/          # GlobalExceptionHandler, ResourceNotFoundException, BadRequestException
│       │   ├── model/              # Event, Venue, Seat, User, Booking, BookingSeat
│       │   ├── repository/         # JpaRepository interfaces
│       │   └── service/            # Business logic services
│       └── resources/
│           └── application.properties
│
├── frontend/                       # Angular Single Page Application
│   ├── src/app/
│   │   ├── components/             # Navbar
│   │   ├── models/                 # Event, Venue, Seat, Booking, User, Analytics models
│   │   ├── pages/                  # Home, Event Details, Seat Selection, My Bookings, Admin Dashboard
│   │   ├── services/               # Angular HttpClient services
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── package.json
│   └── angular.json
└── README.md
```

---

## 🛠️ Database Setup

### MySQL Configuration (Default)
1. Ensure your local MySQL server is running on port `3306`.
2. Open `backend/src/main/resources/application.properties` and verify your credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/venuevista_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```
3. Spring Data JPA will automatically create the database tables (`events`, `venues`, `seats`, `users`, `bookings`, `booking_seats`) on startup and seed initial sample data.

---

## ⚡ How to Run the Project

### 1. Run Backend (Spring Boot)
Open a terminal in the `backend` folder:
```bash
cd backend
mvn spring-boot:run
```
> The Spring Boot application starts on **http://localhost:8080**.

### 2. Run Frontend (Angular)
Open a terminal in the `frontend` folder:
```bash
cd frontend
npm start
```
> The Angular web app will start on **http://localhost:4200**.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/events` | Get all upcoming events |
| **GET** | `/api/events/{id}` | Get event details by ID |
| **POST** | `/api/events` | Create a new event (Admin) |
| **PUT** | `/api/events/{id}` | Update event details (Admin) |
| **DELETE** | `/api/events/{id}` | Delete event by ID (Admin) |
| **GET** | `/api/venues` | Get all venues |
| **GET** | `/api/venues/{id}` | Get venue details by ID |
| **POST** | `/api/venues` | Create a venue & auto-generate seats |
| **PUT** | `/api/venues/{id}` | Update venue details |
| **DELETE** | `/api/venues/{id}` | Delete venue and its seats |
| **GET** | `/api/venues/{venueId}/seats` | Get all seats for a venue |
| **GET** | `/api/venues/{venueId}/seats/available` | Get available seats for a venue |
| **POST** | `/api/bookings` | Create seat booking for user |
| **GET** | `/api/bookings` | View all system bookings (Admin) |
| **GET** | `/api/users/{userId}/bookings` | View bookings for specific user |
| **PUT** | `/api/bookings/{id}/cancel` | Cancel booking & release seats |
| **GET** | `/api/analytics` | View sales statistics summary |

---

## 🔄 Complete User & Admin Test Flow

1. **Admin creates Venue & Event**:
   - Go to **Admin Dashboard (`/admin`)** -> **Venues** -> Click `+ Add New Venue`.
   - Go to **Admin Dashboard** -> **Events** -> Click `+ Add New Event`.
2. **User explores Events**:
   - Go to **Home (`/`)**, filter by category or search.
   - Click **View Details & Book** on any event.
3. **Seat Selection**:
   - Click **Select Seats & Book Tickets**.
   - Pick available seats (Regular: ₹150, Premium: ₹250).
   - Click **Confirm Booking**.
4. **My Bookings & Cancellation**:
   - Automatically redirected to **My Bookings (`/my-bookings`)**.
   - Observe status is `CONFIRMED`.
   - Click **Cancel Booking** to test status update to `CANCELLED` and seat release.
5. **Sales Statistics**:
   - Check **Admin Dashboard** -> **Analytics** tab to view total revenue, confirmed bookings, and seat availability.

---

## 🔮 Future Enhancements
- Integration with payment gateway (Razorpay / Stripe)
- JWT Authentication & Role-based security (SPRING SECURITY)
- Oracle DB migration
- Real-time seat locking with WebSockets
- QR-code ticket generation & email confirmation
