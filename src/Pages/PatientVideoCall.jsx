import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Phone, ArrowLeft, Clock, User, Mic, MicOff, VideoOff, Calendar, Loader2 } from "lucide-react";
import axios from "axios";

const PatientVideoCall = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // WebRTC & Media Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const websocket = useRef(null);
  const localStream = useRef(null);

  // Fetch appointments from API on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      const userId = localStorage.getItem("patientUserId");
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:9169/api/appointments?userId=${userId}`
        );
        // Map API response and filter for VIRTUAL mode only
        const mappedAppointments = response.data
          .filter((apt) => apt.mode?.toUpperCase() === "VIRTUAL")
          .map((apt) => ({
            id: apt.id,
            patientName: apt.patientName || "Self",
            appointmentDate: apt.date,
            appointmentTime: apt.timeSlot?.split("-")[0] || apt.timeSlot,
            timeSlot: apt.timeSlot,
            status: apt.status === "SCHEDULED" ? "BOOKED" : apt.status === "COMPLETED" ? "Completed" : apt.status === "CANCELLED" ? "Cancelled" : apt.status,
            consultationType: "virtual",
            consultationMode: "Virtual",
            doctorId: apt.doctorId,
            doctorName: apt.doctorName || `Dr. Unknown`,
            specialization: apt.doctorSpecialization || "",
          }));
        
        setAppointments(mappedAppointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter only Virtual + BOOKED appointments
  const virtualAppointments = appointments.filter(
    (apt) => apt.consultationMode === "Virtual" && apt.status === "BOOKED"
  );

  const handleJoinCall = (appointment) => {
    setActiveCall(appointment);
  };

  const handleEndCall = () => {
    if (websocket.current) {
      websocket.current.close();
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    setActiveCall(null);
    setIsMuted(false);
    setIsCameraOff(false);
  };

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  useEffect(() => {
    if (activeCall) {
      startCall();
    }
    return () => {
      // Cleanup happens in handleEndCall effectively or manually here if component unmounts
      if (activeCall) { // If unmounting while in call
        if (websocket.current) websocket.current.close();
        if (peerConnection.current) peerConnection.current.close();
        if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCall]);

  const startCall = async () => {
    // 1. Setup WebSocket
    websocket.current = new WebSocket("ws://localhost:5180/ws/video");

    websocket.current.onopen = async () => {
      console.log("WebSocket Connected");
      await initializeWebRTC();
      sendMessage({ type: "JOIN", appointmentId: activeCall.id });
    };

    websocket.current.onmessage = handleSignalingMessage;

    websocket.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  };

  const initializeWebRTC = async () => {
    try {
      // 2. Get User Media
      console.log("Requesting access to camera/microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("Camera/microphone access granted.");
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // 3. Create PeerConnection
      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
      peerConnection.current = new RTCPeerConnection(configuration);

      // Add tracks
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // Handle ICE Candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendMessage({
            type: "ICE",
            candidate: event.candidate,
            appointmentId: activeCall.id,
          });
        }
      };

      // Handle Remote Stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // 4. Create Offer - MOVED to handleSignalingMessage (wait for peer)
      // const offer = await peerConnection.current.createOffer();
      // await peerConnection.current.setLocalDescription(offer);
      // sendMessage({...});

    } catch (error) {
      console.error("Error initializing WebRTC:", error);
    }
  };

  /* 
   * Patient Logic:
   * 1. On Connect -> Send JOIN.
   * 2. On ROOM_JOINED (if hasPeer=true) -> Send OFFER.
   * 3. On USER_JOINED (someone else joined) -> Send OFFER.
   * 4. Don't send OFFER immediately on open.
   */
  const handleSignalingMessage = async (event) => {
    const message = JSON.parse(event.data);
    console.log("Received signaling message:", message.type);

    if (message.type === "ROOM_JOINED") {
      if (message.hasPeer) {
        console.log("Peer already in room, sending offer...");
        createOffer();
      } else {
        console.log("Waiting for peer to join...");
      }
    } else if (message.type === "USER_JOINED") {
      console.log("Peer joined, sending offer...");
      createOffer();
    } else if (message.type === "ANSWER") {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.sdp));
    } else if (message.type === "ICE") {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate));
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    }
  };

  const createOffer = async () => {
    // Only create offer if we haven't already or if we need to renegotiate (simple case: just do it)
    // Note: In a robust app, check signalingState.
    if (peerConnection.current && peerConnection.current.signalingState === 'stable') {
      console.log("Creating proper offer");
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      sendMessage({
        type: "OFFER",
        sdp: offer,
        appointmentId: activeCall.id,
      });
    }
  };

  const sendMessage = (message) => {
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(message));
    }
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
          <button
            onClick={() => navigate("/patient-dashboard")}
            className="text-[#1DB1A2] hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Video Call Screen
  if (activeCall) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Video Call Header */}
        <div className="bg-gray-900 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-700 gap-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1DB1A2] rounded-full flex items-center justify-center animate-pulse">
              <Video className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Virtual Consultation</h2>
              <p className="text-gray-400 text-sm">Connected with {activeCall.doctorName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800 px-3 py-1.5 rounded-lg text-sm">
              <Calendar size={14} />
              <span>{activeCall.appointmentDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 bg-gray-800 px-3 py-1.5 rounded-lg text-sm">
              <Clock size={14} />
              <span>{activeCall.appointmentTime}</span>
            </div>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
          <div className="w-full max-w-4xl">
            {/* Doctor Video (Main) */}
            <div className="relative w-full aspect-video bg-gray-800 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-700 overflow-hidden">
              {/* WebRTC Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              <div className="text-center z-10 pointer-events-none">
                <div className="w-32 h-32 bg-[#1DB1A2]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl opacity-0">
                </div>
              </div>

              {/* Patient Self View (Small) */}
              <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-40 sm:h-28 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-600 overflow-hidden z-20">
                {/* WebRTC Local Video */}
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] ${isCameraOff ? 'hidden' : ''}`}
                />

                <div className="text-center">
                  {!localStream.current && (
                    <div className="w-12 h-12 bg-[#1DB1A2] rounded-full flex items-center justify-center mx-auto mb-1">
                      <User size={24} className="text-white" />
                    </div>
                  )}
                  <span className="text-gray-300 text-xs relative z-10 drop-shadow-md">You</span>
                </div>
                {isCameraOff && (
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-90 rounded-xl flex items-center justify-center z-30">
                    <VideoOff size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Call Info Banner */}
            {/* <div className="mt-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-4 text-center border border-blue-700">
              <p className="text-blue-200 text-sm">
                Session ID: {activeCall.id} | Secure End-to-End Encrypted
              </p>
            </div> */}
          </div>
        </div>

        {/* Call Controls Footer */}
        <div className="bg-gray-900 px-4 sm:px-6 py-4 sm:py-6 border-t border-gray-700">
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${isMuted
                ? "bg-[#aa4a3a] hover:bg-[#aa4a3a]/80 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* Camera Button */}
            <button
              onClick={toggleCamera}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${isCameraOff
                ? "bg-[#aa4a3a] hover:bg-[#aa4a3a]/80 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
            >
              {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#aa4a3a] hover:bg-[#aa4a3a]/80 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg"
              title="Leave Call"
            >
              <Phone size={22} className="rotate-135" />
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-3 sm:mt-4">
            Please wait for the doctor to complete the consultation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1DB1A2]/6 via-white to-[#aa4a3a]/6 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/patient-dashboard")}
          className="flex items-center gap-2 text-[#1DB1A2] hover:text-[#1DB1A2]/80 mb-6 transition font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1DB1A2]/15 rounded-xl flex items-center justify-center shadow-sm">
              <Video className="text-[#1DB1A2]" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Video Consultations
              </h1>
              <p className="text-gray-500">Join your virtual appointments</p>
            </div>
          </div>

          {/* Appointments List */}
          {virtualAppointments.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-[#1DB1A2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-[#1DB1A2]" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No BOOKED Virtual Appointments
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                You don't have any booked virtual consultations at the moment.
              </p>
              <button
                onClick={() => navigate("/appointments")}
                className="px-6 py-3 bg-[#1DB1A2] text-white rounded-lg hover:bg-[#1DB1A2]/90 transition font-medium shadow-md"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {virtualAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-linear-to-r from-[#1DB1A2]/5 to-white border border-[#1DB1A2]/20 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#1DB1A2]/10 text-[#1DB1A2] text-xs font-semibold rounded-full">
                          Virtual Consultation
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          BOOKED
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {apt.doctorName}
                      </h3>
                      <p className="text-[#1DB1A2] font-medium text-sm mb-3">{apt.specialization}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          <Calendar size={16} className="text-[#1DB1A2]" />
                          {apt.appointmentDate}
                        </span>
                        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          <Clock size={16} className="text-[#1DB1A2]" />
                          {apt.appointmentTime}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinCall(apt)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1DB1A2] hover:bg-[#1DB1A2]/90 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Video size={20} />
                        Join Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientVideoCall;
