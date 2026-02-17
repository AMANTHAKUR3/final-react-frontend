import React, { createContext, useContext, useState, useEffect } from "react";

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider");
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem("appointments");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  // Generate unique ID
  const generateId = () => {
    return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add new appointment
  const addAppointment = (appointmentData) => {
    // Check if booking for someone else (has personal data fields)
    const isBookingForSomeoneElse = Boolean(appointmentData.fullName);

    // Normalize the data structure for consistent access
    const newAppointment = {
      id: generateId(),
      // Use personal data fields if booking for someone else, otherwise use placeholder
      patientName: isBookingForSomeoneElse ? appointmentData.fullName : "Self (Registered User)",
      patientPhone: isBookingForSomeoneElse ? appointmentData.phone : "",
      patientEmail: isBookingForSomeoneElse ? appointmentData.email : "",
      patientAge: isBookingForSomeoneElse && appointmentData.dob
        ? calculateAge(appointmentData.dob)
        : "",
      patientGender: isBookingForSomeoneElse ? appointmentData.gender : "",
      patientDob: isBookingForSomeoneElse ? appointmentData.dob : "",
      insurancePolicy: isBookingForSomeoneElse ? appointmentData.insurancePolicy : "",
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      doctorSpecialization: appointmentData.doctorSpecialization || appointmentData.specialization,
      specialization: appointmentData.doctorSpecialization || appointmentData.specialization,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      phoneNumber: isBookingForSomeoneElse ? appointmentData.phone : "",
      emailId: isBookingForSomeoneElse ? appointmentData.email : "",
      age: isBookingForSomeoneElse && appointmentData.dob
        ? calculateAge(appointmentData.dob)
        : "",
      consultationType: appointmentData.consultationType || appointmentData.consultationMode,
      consultationMode: appointmentData.consultationType === "virtual" ? "Virtual" : "In-Person",
      status: "Upcoming",
      createdAt: new Date().toISOString(),
      bookingForSomeoneElse: isBookingForSomeoneElse,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    return newAppointment;
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Update appointment status
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
  };

  // Cancel appointment
  const cancelAppointment = (id) => {
    updateAppointmentStatus(id, "Cancelled");
  };

  // Mark appointment as completed
  const completeAppointment = (id) => {
    updateAppointmentStatus(id, "Completed");
  };

  // Get all appointments
  const getAllAppointments = () => appointments;

  // Get appointments by status
  const getAppointmentsByStatus = (status) => {
    return appointments.filter((apt) => apt.status === status);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        completeAppointment,
        getAllAppointments,
        getAppointmentsByStatus,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
