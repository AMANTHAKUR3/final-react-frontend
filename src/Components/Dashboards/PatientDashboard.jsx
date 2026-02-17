import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { CalendarDays, FileText, ClipboardList, Video, User } from "lucide-react";
import { useRole } from "../../Context/RoleContext";
import PrescriptionModal from "../PrescriptionModal"
import { Header } from "../../../modules/m3/src/components/HeaderPatient";
import { getUserById } from "../../api/user";

const PatientDashboard = () => {

  const primaryColor = "#aa4a3a";
  const accentColor = "#1DB1A2";
  const softBg = "#f6f8f7";

  const [login, setLogin] = useState(false);
  const { userId } = useRole();
  const navigate = useNavigate();
  const [ViewPrescriptions, setViewPrescriptions] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const checkLogin = localStorage.getItem('role');
    if (checkLogin) {
      setLogin(true);
    }
    else {
      navigate("/login")
    }
  }, [navigate]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("🔍 Fetching user data for userId:", userId);
      
      if (!userId) {
        console.log("❌ No userId found");
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📡 Calling API: /api/auth/" + userId);
        const response = await getUserById(userId);
        console.log("✅ API Response:", response);
        setUserData(response);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch user data:", err);
        setError("User info unavailable");
      } finally {
        setLoading(false);
      }
    };

    if (login && userId) {
      console.log("🚀 Starting fetch - login:", login, "userId:", userId);
      fetchUserData();
    } else {
      console.log("⏸️ Not fetching - login:", login, "userId:", userId);
    }
  }, [login, userId])

  return (<>
    {ViewPrescriptions && <PrescriptionModal patientId={userData?.userId || userId || "123456"} setViewPrescriptions={setViewPrescriptions} />}
    
    <Header />
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: softBg, backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor}12, transparent 45%), radial-gradient(circle at 80% 0%, ${primaryColor}14, transparent 40%)` }}>

      <div className="w-full max-w-4xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)] overflow-auto" style={{ borderColor: `${accentColor}55`, backgroundColor: "#f9fbfa", backgroundImage: `linear-gradient(180deg, ${accentColor}0f, ${primaryColor}0e)` }}>

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white shadow-md border" style={{ backgroundColor: accentColor, borderColor: `${primaryColor}70`, boxShadow: `0 12px 30px -12px ${primaryColor}aa` }}>
            <User className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14" strokeWidth={2.2} color="#fff" />
          </div>

          {loading ? (
            <div className="mt-3 sm:mt-4">
              <div className="animate-pulse">
                <div className="h-6 sm:h-8 rounded w-36 sm:w-48 mb-2" style={{ backgroundColor: `${accentColor}30` }}></div>
                <div className="h-3 sm:h-4 rounded w-28 sm:w-32" style={{ backgroundColor: `${accentColor}20` }}></div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-3 sm:mt-4">
              <h2 className="text-lg sm:text-2xl font-semibold" style={{ color: primaryColor }}>User info unavailable</h2>
              <p className="text-gray-600 text-xs sm:text-sm">Please try again later</p>
            </div>
          ) : (
            <>
              <h2 className="mt-3 sm:mt-4 text-lg sm:text-2xl font-semibold" style={{ color: primaryColor }}>
                {userData?.fullName || "Guest User"}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                {userData?.dob && `Age: ${calculateAge(userData.dob)}`}
                {userData?.dob && userData?.userId && " • "}
                {userData?.userId && `Patient ID: ${userData.userId}`}
              </p>
            </>
          )}
        </div>

        {/* Action Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-10">

          {/* Book Appointment */}
          <div 
            className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto"
            style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, borderColor: `${accentColor}70` }}
            onClick={() => navigate("/appointments")}
          >
            <div className="flex items-center gap-3 sm:gap-4 h-full">
              <CalendarDays className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
                  Book Appointment
                </h3>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">
                  Schedule a visit
                </p>
              </div>
            </div>
          </div>

          {/* View Prescriptions */}
          <div 
            className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto" 
            style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`, borderColor: `${primaryColor}70` }} 
            onClick={() => setViewPrescriptions(prev => !prev)}
          >
            <div className="flex items-center gap-3 sm:gap-4 h-full">
              <FileText className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
                  View Prescriptions
                </h3>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">
                  Check your medications
                </p>
              </div>
            </div>
          </div>

          {/* View My Appointments */}
          <div 
            className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto"
            style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`, borderColor: `${primaryColor}70` }}
            onClick={() => navigate("/appointments/view")}
          >
            <div className="flex items-center gap-3 sm:gap-4 h-full">
              <ClipboardList className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
                  View Appointments
                </h3>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">
                  Check your scheduled visits
                </p>
              </div>
            </div>
          </div>

          {/* Video Call */}
          <div 
            className="transition rounded-xl p-4 sm:p-5 md:p-6 text-white cursor-pointer shadow-lg border transform hover:-translate-y-1 hover:shadow-2xl duration-200 h-20 sm:h-auto"
            style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, borderColor: `${accentColor}70` }}
            onClick={() => navigate("/patient/videocall")}
          >
            <div className="flex items-center gap-3 sm:gap-4 h-full">
              <Video className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
                  Video Call
                </h3>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5 hidden sm:block">
                  Join virtual consultations
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </>

  );
};

export default PatientDashboard
