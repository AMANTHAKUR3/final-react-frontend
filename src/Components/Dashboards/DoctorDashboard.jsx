import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Stethoscope, CalendarCheck, FolderHeart, Video, User } from "lucide-react";
import { useRole } from "../../Context/RoleContext";
import { Header } from "../../../modules/m3/src/components/Header";
import { getDoctorByEmail } from "../../api/user";


const DoctorDashboard = () => {
  const primaryColor = "#aa4a3a";
  const accentColor = "#1DB1A2";
  const softBg = "#f6f8f7";

  const [login, setLogin] = useState(false);
  const { userId, userEmail } = useRole();
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = localStorage.getItem('role');
    if (checkLogin) {
      setLogin(true);
    }
    else {
      navigate("/login")
    }
  }, [navigate]);

  // Fetch doctor data by email
  useEffect(() => {
    const fetchDoctorData = async () => {
      // Get email from context or fallback to localStorage
      const email = userEmail || localStorage.getItem("userEmail");
      console.log("🔍 DoctorDashboard - Fetching doctor data for email:", email);
      
      if (!email) {
        console.warn("⚠️ No email found in context or localStorage");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getDoctorByEmail(email);
        console.log("✅ Doctor data received:", response);
        setDoctorData(response);
      } catch (err) {
        console.error("❌ Failed to fetch doctor data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (login) {
      fetchDoctorData();
    }
  }, [login, userEmail]);
  return (<>
  <div className="fixed top-0 left-0 right-0">
    <Header />
  </div>
    
  <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10 pt-20 sm:pt-24" style={{ backgroundColor: softBg, backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor}12, transparent 45%), radial-gradient(circle at 80% 0%, ${primaryColor}14, transparent 40%)` }}>

      <div className="w-full max-w-4xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)] overflow-auto" style={{ borderColor: `${accentColor}55`, backgroundColor: "#f9fbfa", backgroundImage: `linear-gradient(180deg, ${accentColor}0f, ${primaryColor}0e)` }}>

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white shadow-md border" style={{ backgroundColor: accentColor, borderColor: `${primaryColor}70`, boxShadow: `0 12px 30px -12px ${primaryColor}aa` }}>
            <User className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14" strokeWidth={2.2} color="#fff" />
          </div>

          <h2 className="mt-3 sm:mt-4 text-lg sm:text-2xl font-semibold" style={{ color: primaryColor }}>
            {loading ? "Loading..." : `${doctorData?.fullName || "Doctor"}`}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            {doctorData?.specialization || "Specialist"} • Doctor ID: {userId || "00000"}
          </p>
        </div>

        {/* Action Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-10">

          {/* View Appointments */}
          <Link to="/doctor/appointments" className="block">
            <div className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto"
              style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, borderColor: `${accentColor}70` }}
            >
              <div className="flex items-center gap-3 sm:gap-4 h-full">
                <CalendarCheck className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">View Appointments</h3>
                  <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">Manage patient visits</p>
                </div>
              </div>
            </div>
          </Link>

          {/* EHR Management */}
          <Link to="/EHR" className="block">
            <div className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto"
              style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`, borderColor: `${primaryColor}70` }}
            >
              <div className="flex items-center gap-3 sm:gap-4 h-full">
                <FolderHeart className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">EHR Management</h3>
                  <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">View & update medical records</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Video Call */}
          <Link to="/doctor/videocall" className="block">
            <div className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto"
              style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`, borderColor: `${primaryColor}70` }}
            >
              <div className="flex items-center gap-3 sm:gap-4 h-full">
                <Video className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">Video Call</h3>
                  <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">Join virtual consultations</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Prescription */}
          <Link to="/prescription" className="block">
            <div className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto"
              style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, borderColor: `${accentColor}70` }}
            >
              <div className="flex items-center gap-3 sm:gap-4 h-full">
                <FolderHeart className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">Prescription</h3>
                  <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">Generate prescriptions</p>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>

  </>

  );
};

export default DoctorDashboard;
