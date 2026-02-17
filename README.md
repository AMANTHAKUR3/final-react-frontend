# MediConnect - Telemedicine & Appointment Management Platform

A full-stack healthcare platform enabling patients to book appointments, conduct video consultations with doctors, and manage health records — built with **React**, **Tailwind CSS**, **WebRTC**, and **Spring Boot microservices**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [System Architecture](#system-architecture)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**MediConnect** is a comprehensive telemedicine solution that bridges the gap between patients and healthcare providers. The platform supports:

- **Patient Registration & Authentication**
- **Appointment Booking** (Virtual or In-Person)
- **Real-time Video Consultations** via WebRTC
- **Doctor Dashboard** for managing appointments
- **Admin Dashboard** for analytics and user management

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Role-based login (Patient, Doctor, Admin) with secure password management |
| 📅 **Appointment Booking** | Select doctor by specialization, choose date/time slots, book for self or dependents |
| 📹 **Video Consultation** | Peer-to-peer WebRTC video calls with WebSocket signaling |
| 👨‍⚕️ **Doctor Dashboard** | View upcoming appointments, join video calls, mark consultations complete |
| 👤 **Patient Dashboard** | View/manage appointments, access video calls |
| 📊 **Admin Dashboard** | Analytics, user management, system insights |
| 📁 **EHR Integration** | Electronic Health Records module for patient data |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **Chart.js** | Dashboard analytics charts |
| **Lucide React** | Icon library |
| **WebRTC** | Peer-to-peer video/audio |
| **WebSocket** | Real-time signaling |

### Backend Microservices

| Service | Port | Purpose |
|---------|------|---------|
| **Eureka Discovery** | 8761 | Service registry & discovery |
| **API Gateway** | 8020 | Request routing & load balancing |
| **Auth Service (M1)** | 9069 | User authentication, patient management |
| **Appointment Service (M2)** | 9169 | Appointment CRUD, doctor management |
| **EHR Service (M3)** | — | Electronic Health Records |
| **E-Health Service (M4)** | — | Additional health features |
| **Analytics Service (M5)** | — | Reporting & analytics |
| **Video Call Service** | 5180 | WebSocket signaling for WebRTC |

### Database

| Database | Usage |
|----------|-------|
| **MySQL** | Primary data store for all microservices |

### Core Technologies

- **Spring Boot 4.0.2**
- **Spring Cloud 2025.1.0**
- **Spring Data JPA**
- **OpenFeign** (inter-service communication)
- **Java 21**

---

## Project Structure

```
MediConnect/
├── Mediconnect_integration/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── Components/               # Shared UI components
│   │   │   ├── Dashboards/           # Doctor, Patient dashboards
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Pages/
│   │   │   ├── Appointments.jsx      # Booking form
│   │   │   ├── ViewAppointments.jsx  # List appointments
│   │   │   ├── DoctorVideoCall.jsx   # Doctor video UI
│   │   │   └── PatientVideoCall.jsx  # Patient video UI
│   │   ├── Context/
│   │   │   ├── RoleContext.jsx       # Auth state
│   │   │   └── AppointmentContext.jsx
│   │   └── api/                      # API utilities
│   ├── modules/                      # Feature modules (M3, M4, M5)
│   ├── package.json
│   └── vite.config.js
│
├── MediConnect-Micorservices/        # Backend (Spring Boot)
│   ├── eureka-discovery-service/     # Service registry
│   ├── api-gatway/                   # API Gateway
│   ├── m1/                           # Auth Service
│   ├── m2/                           # Appointment Service
│   ├── m3/                           # EHR Service
│   ├── m4/                           # E-Health Service
│   └── m5/                           # Analytics Service
│
└── mediconnect-video-call/           # Video Signaling Service
    └── src/main/java/.../handler/
        └── SignalingHandler.java     # WebSocket handler
```

---

## Prerequisites

Ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Java JDK** | 21 | [adoptium.net](https://adoptium.net/) |
| **Maven** | 3.9+ | [maven.apache.org](https://maven.apache.org/) |
| **MySQL** | 8.0+ | [mysql.com](https://www.mysql.com/) |

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AMANTHAKUR3/Mediconnect_integration.git
cd Mediconnect_integration
```

### 2. Database Setup

Create the required MySQL databases:

```sql
CREATE DATABASE m1_db;
CREATE DATABASE m2_db;
-- Create additional databases for M3, M4, M5 as needed
```

### 3. Backend Configuration

Update database credentials in each service's `application.properties`:

**Example: `m1/src/main/resources/application.properties`**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/m1_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**Example: `m2/src/main/resources/application.properties`**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/m2_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 4. Frontend Dependencies

```bash
cd Mediconnect_integration
npm install
```

---

## Running the Application

### Start Backend Services (in order)

Open separate terminals for each service:

**1. Eureka Discovery Server**
```bash
cd MediConnect-Micorservices/eureka-discovery-service
./mvnw spring-boot:run
```
> Runs on: http://localhost:8761

**2. API Gateway**
```bash
cd MediConnect-Micorservices/api-gatway
./mvnw spring-boot:run
```
> Runs on: http://localhost:8020

**3. Auth Service (M1)**
```bash
cd MediConnect-Micorservices/m1
./mvnw spring-boot:run
```
> Runs on: http://localhost:9069

**4. Appointment Service (M2)**
```bash
cd MediConnect-Micorservices/m2
./mvnw spring-boot:run
```
> Runs on: http://localhost:9169

**5. Video Call Signaling Service**
```bash
cd mediconnect-video-call
./mvnw spring-boot:run
```
> WebSocket endpoint: ws://localhost:5180/ws/video

### Start Frontend

```bash
cd Mediconnect_integration
npm run dev
```
> Runs on: http://localhost:5173

---

## Usage Guide

### Patient Flow

1. **Register** at `/register` with email, password, and personal details
2. **Login** at `/login` → redirects to Patient Dashboard
3. **Book Appointment** → Select specialization → Choose doctor → Pick date/time → Select Virtual or In-Person
4. **View Appointments** → See all booked appointments
5. **Join Video Call** → For virtual appointments, click "Join Call" to start WebRTC session

### Doctor Flow

1. **Login** with doctor credentials → redirects to Doctor Dashboard
2. **View Appointments** → See scheduled consultations
3. **Join Video Call** → Connect with patients for virtual consultations
4. **Complete Appointment** → Mark consultation as complete after call

### Admin Flow

1. **Login** with admin credentials → redirects to Admin Dashboard
2. **View Analytics** → Charts and statistics
3. **Manage Users** → User administration

---

## System Architecture

### Appointment API Lifecycle

```
┌─────────────┐    POST /api/appointments/book    ┌──────────────────┐
│   Frontend  │ ─────────────────────────────────►│ Appointment Svc  │
│  (React)    │                                   │     (M2)         │
└─────────────┘                                   └────────┬─────────┘
                                                           │
                                                           │ Feign Client
                                                           ▼
                                                  ┌──────────────────┐
                                                  │   Auth Service   │
                                                  │      (M1)        │
                                                  └──────────────────┘
```

1. **Patient selects doctor** → Frontend fetches doctors by specialization
2. **Submit booking** → POST to `/api/appointments/book?userId={id}`
3. **Resolve patient** → M2 calls M1 to create/find patient record
4. **Save appointment** → Stored in M2 database with status `SCHEDULED`

### WebRTC Video Call Flow

```
┌────────────┐                              ┌────────────┐
│  Patient   │                              │   Doctor   │
│  Browser   │                              │  Browser   │
└─────┬──────┘                              └─────┬──────┘
      │                                           │
      │  1. JOIN (appointmentId)                  │
      ├──────────────────►┌──────────────┐        │
      │                   │  Signaling   │        │
      │                   │   Server     │◄───────┤ 2. JOIN
      │                   │ (WebSocket)  │        │
      │                   └──────┬───────┘        │
      │                          │                │
      │◄─────── 3. USER_JOINED ──┤                │
      │                          │                │
      │──── 4. OFFER ───────────►│────────────────►
      │                          │                │
      │◄─────────────────────────│◄── 5. ANSWER ──┤
      │                          │                │
      │◄──── 6. ICE Candidates ──┼────────────────►
      │                          │                │
      └──────────── 7. P2P Media Stream ──────────┘
```

1. **JOIN** → Both peers connect to WebSocket with `appointmentId`
2. **USER_JOINED** → Server notifies when peer joins room
3. **OFFER** → Patient creates and sends SDP offer
4. **ANSWER** → Doctor responds with SDP answer
5. **ICE Candidates** → Exchange network path information
6. **P2P Stream** → Direct media connection established

---

## API Endpoints

### Auth Service (M1) - Port 9069

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| PUT | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/resolve` | Resolve/create patient |
| GET | `/api/auth/{id}/exists` | Check if user exists |
| GET | `/api/auth/{id}` | Get patient details |

### Appointment Service (M2) - Port 9169

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments/book?userId={id}` | Book appointment |
| GET | `/api/appointments?userId={id}` | Get user's appointments |
| GET | `/api/appointments/doctor-appointments?doctorId={id}` | Get doctor's appointments |
| PUT | `/api/appointments/update-status` | Update appointment status |
| GET | `/api/doctor/specialization` | Get doctors grouped by specialization |
| GET | `/api/appointments/{id}` | Get appointment by ID |
| GET | `/api/appointments/doctor/{doctorId}` | Get appointments for doctor |

### Video Signaling Service - Port 5180

| Type | Endpoint | Description |
|------|----------|-------------|
| WebSocket | `ws://localhost:5180/ws/video` | Video call signaling |

**Signaling Message Types:**
- `JOIN` - Join a video room
- `OFFER` - WebRTC offer
- `ANSWER` - WebRTC answer
- `ICE` - ICE candidate exchange
- `USER_JOINED` - Peer joined notification
- `ROOM_JOINED` - Room join confirmation

---

## Environment Variables

### Frontend (`.env` - optional)

```env
VITE_API_BASE_URL=http://localhost:9169
VITE_AUTH_API_URL=http://localhost:9069
VITE_WS_URL=ws://localhost:5180/ws/video
```

### Backend (application.properties)

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | varies | Service port |
| `spring.datasource.url` | - | MySQL connection URL |
| `spring.datasource.username` | root | DB username |
| `spring.datasource.password` | - | DB password |
| `eureka.client.service-url.defaultZone` | http://localhost:8761/eureka/ | Eureka URL |

---

## Swagger UI

> **Note:** Swagger UI can be enabled by adding the following dependency to backend services:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

Once enabled, access Swagger UI at:
- Auth Service: http://localhost:9069/swagger-ui.html
- Appointment Service: http://localhost:9169/swagger-ui.html

---

## Repository

🔗 **GitHub:** [https://github.com/AMANTHAKUR3/Mediconnect_integration](https://github.com/AMANTHAKUR3/Mediconnect_integration)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Additional Notes

### Known Issues

- Ensure all microservices are running before using the frontend
- WebRTC requires HTTPS in production (use localhost for development)
- Camera/microphone permissions must be granted for video calls

### Production Deployment

For production deployment:

1. Use environment variables for sensitive data
2. Enable HTTPS for WebRTC
3. Configure CORS for production domains
4. Set up a TURN server for NAT traversal
5. Use a reverse proxy (nginx) for the frontend

---

**Built with ❤️ by the MediConnect Team**
