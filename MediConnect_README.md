# 🏥 MediConnect — Backend (Spring Boot)

**MediConnect** is a healthcare management platform designed for hospitals, clinics, and healthcare providers to efficiently manage patient records, enable telehealth consultations, and streamline care coordination.

The backend is built using **Java (Spring Boot)** and is designed to maintain architectural parity with a future **.NET (ASP.NET Core)** implementation.

---

## ✨ Core Capabilities

- Patient registration, onboarding, and profile management
- Appointment scheduling & telehealth workflow support
- Electronic Health Records (EHR) CRUD operations
- Prescription & medicine management
- Health analytics and reporting
- Secure authentication & role-based authorization

---

## 🧱 Architecture & Modules

**Base Package:** `com.Team2.Mediconnect`

---

## 🧰 Tech Stack

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- H2 / MySQL / PostgreSQL
- Maven

---

## 🚀 Run Locally

```bash
mvn clean install
mvn spring-boot:run
```

Application runs on:
```
http://localhost:8083
```

---

## 🔐 Security

- Role-based access control
- JWT authentication (planned)

---

## 🔄 Roadmap

- Complete EHR module
- Telehealth integration
- JWT authentication
- Audit logging
