import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Phone, Video, Building2, X, CheckCircle, XCircle, FileText, Stethoscope, Loader2 } from "lucide-react";
import axios from "axios";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch doctor appointments from API on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      const userId = localStorage.getItem("doctorUserId");
      if (!userId) {
        setError("Doctor not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:9169/api/appointments/doctor-appointments?doctorId=${userId}`
        );
        // Map API response to UI format
        const mappedAppointments = response.data.map((apt) => ({
          id: apt.appointmentId,
          patientName: apt.patientName || "Patient",
          appointmentDate: apt.appointmentDate,
          appointmentTime: apt.timeSlot?.split("-")[0] || apt.timeSlot,
          timeSlot: apt.timeSlot,
          status: apt.status === "SCHEDULED" ? "Upcoming" : apt.status === "BOOKED" ? "Booked" : apt.status === "COMPLETED" ? "Completed" : apt.status === "CANCELLED" ? "Cancelled" : apt.status,
          consultationType: apt.mode?.toLowerCase() === "virtual" ? "virtual" : "in-person",
          phoneNumber: apt.phoneNumber || "",
          age: apt.age || "",
        }));
        setAppointments(mappedAppointments);
      } catch (err) {
        console.error("Failed to fetch doctor appointments:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Cancel appointment via API
  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:9169/api/appointments/update-status?appointmentId=${appointmentId}&status=CANCELLED`
      );
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
        )
      );
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      alert("Failed to cancel appointment");
    }
  };

  // Complete appointment via API
  const completeAppointment = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:9169/api/appointments/update-status?appointmentId=${appointmentId}&status=COMPLETED`
      );
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Completed" } : apt
        )
      );
    } catch (err) {
      console.error("Failed to complete appointment:", err);
      alert("Failed to complete appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Booked":
        return "bg-green-100 text-green-700 border-green-200";
      case "Completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCompleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCompleteModal(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointment) {
      cancelAppointment(selectedAppointment.id);
    }
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const handleConfirmComplete = () => {
    if (selectedAppointment) {
      completeAppointment(selectedAppointment.id);
    }
    setShowCompleteModal(false);
    setSelectedAppointment(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1DB1A2]/6 via-white to-[#aa4a3a]/6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#1DB1A2] animate-spin" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1DB1A2]/6 via-white to-[#aa4a3a]/6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/doctor-dashboard"
            className="text-[#1DB1A2] hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Empty state
  if (appointments.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1DB1A2]/6 via-white to-[#aa4a3a]/6">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link
              to="/doctor-dashboard"
              className="flex items-center gap-2 text-[#1DB1A2] hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1DB1A2]/20 rounded-full mb-4">
              <Calendar className="w-10 h-10 text-[#1DB1A2]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Yet</h2>
            <p className="text-gray-500">Patient appointments will appear here once booked.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1DB1A2]/6 via-white to-[#aa4a3a]/6">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            to="/doctor-dashboard"
            className="flex items-center gap-2 text-[#1DB1A2] hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1DB1A2]/20 rounded-full mb-4">
            <Stethoscope className="w-8 h-8 text-[#1DB1A2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Appointments</h1>
          <p className="text-gray-500 mt-2">Manage and update patient appointment statuses</p>
        </div>

        {/* Mobile Cards View */}
        <div className="block lg:hidden space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
                <span className="text-xs text-gray-500">#{appointment.id}</span>
              </div>

              {/* Patient Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-800">{appointment.patientName}</span>
                  <span className="text-sm text-gray-500">{appointment.age ? `(${appointment.age} yrs)` : ""}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{appointment.phoneNumber}</span>
                </div>
              </div>

              {/* Date, Time, Mode */}
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Clock size={14} className="text-gray-400" />
                  <span>{formatTime(appointment.appointmentTime)}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg ${appointment.consultationType === "virtual"
                    ? "bg-[#1DB1A2]/10 text-[#1DB1A2]"
                    : "bg-[#aa4a3a]/10 text-[#aa4a3a]"
                  }`}>
                  {appointment.consultationType === "virtual" ? (
                    <Video size={14} />
                  ) : (
                    <Building2 size={14} />
                  )}
                  <span className="capitalize">{appointment.consultationType}</span>
                </div>
              </div>

              {/* Reason for Visit */}
              {appointment.reasonForVisit && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FileText size={14} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Reason for Visit</p>
                      <p className="text-sm text-gray-700">{appointment.reasonForVisit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleCompleteClick(appointment)}
                  disabled={appointment.status === "Completed" || appointment.status === "Cancelled"}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                    appointment.status === "Completed" || appointment.status === "Cancelled"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-[#1DB1A2] text-white hover:opacity-90"
                  }`}
                >
                  <CheckCircle size={16} />
                  Complete
                </button>
                <button
                  onClick={() => handleCancelClick(appointment)}
                  disabled={appointment.status === "Completed" || appointment.status === "Cancelled"}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                    appointment.status === "Completed" || appointment.status === "Cancelled"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-[#aa4a3a] text-white hover:bg-[#aa4a3a]/80"
                  }`}
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                  <th className="px-0 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Schedule</th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mode</th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    {/* Patient */}
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1DB1A2]/20 rounded-full flex items-center justify-center">
                          <User size={18} className="text-[#1DB1A2]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">{appointment.age} Booked via website</p>
                        </div>
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="px-0 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Calendar size={12} className="text-gray-400" />
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock size={12} className="text-gray-400" />
                          {formatTime(appointment.appointmentTime)}
                        </div>
                      </div>
                    </td>

                    {/* Mode */}
                    <td className="px-2 py-4">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${appointment.consultationType === "virtual"
                          ? "bg-[#1DB1A2]/10 text-[#1DB1A2]"
                          : "bg-[#aa4a3a]/10 text-[#aa4a3a]"
                        }`}>
                        {appointment.consultationType === "virtual" ? (
                          <Video size={12} />
                        ) : (
                          <Building2 size={12} />
                        )}
                        <span className="capitalize">{appointment.consultationType}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleCompleteClick(appointment)}
                          disabled={appointment.status === "Completed" || appointment.status === "Cancelled"}
                          className={`p-2 rounded-md transition-colors shadow-sm ${
                            appointment.status === "Completed" || appointment.status === "Cancelled"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                              : "bg-[#1DB1A2] text-white hover:bg-[#1DB1A2]/80"
                          }`}
                          title={appointment.status === "Completed" || appointment.status === "Cancelled" ? "Cannot modify completed or cancelled appointment" : "Complete Appointment"}
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleCancelClick(appointment)}
                          disabled={appointment.status === "Completed" || appointment.status === "Cancelled"}
                          className={`p-2 rounded-md transition-colors shadow-sm ${
                            appointment.status === "Completed" || appointment.status === "Cancelled"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                              : "bg-[#aa4a3a] text-white hover:bg-[#aa4a3a]/80"
                          }`}
                          title={appointment.status === "Completed" || appointment.status === "Cancelled" ? "Cannot modify completed or cancelled appointment" : "Cancel Appointment"}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Cancel Appointment</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to cancel the appointment with{" "}
                <span className="font-semibold">{selectedAppointment.patientName}</span> on{" "}
                <span className="font-semibold">{formatDate(selectedAppointment.appointmentDate)}</span>?
              </p>
              <p className="text-sm text-red-500 mt-3">This action cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-2.5 bg-[#aa4a3a] text-white rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Complete Appointment</h3>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Mark the appointment with{" "}
                <span className="font-semibold">{selectedAppointment.patientName}</span> as completed?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmComplete}
                className="flex-1 px-4 py-2.5 bg-[#1DB1A2] text-white rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
