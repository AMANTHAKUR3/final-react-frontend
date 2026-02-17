import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Restore role-specific data on app load
  useEffect(() => {
    // Check for stored role first
    const storedRole = localStorage.getItem("role");
    console.log("🔄 RoleContext - Checking localStorage for role:", storedRole);
    
    if (storedRole) {
      setRole(storedRole);
      
      // Load role-specific userId and email
      if (storedRole === "patient") {
        const patientUserId = localStorage.getItem("patientUserId");
        const patientEmail = localStorage.getItem("patientEmail");
        console.log("🔄 RoleContext - Restoring patient data:", { patientUserId, patientEmail });
        if (patientUserId) setUserId(patientUserId);
        if (patientEmail) setUserEmail(patientEmail);
      } else if (storedRole === "doctor") {
        const doctorUserId = localStorage.getItem("doctorUserId");
        const doctorEmail = localStorage.getItem("doctorEmail");
        console.log("🔄 RoleContext - Restoring doctor data:", { doctorUserId, doctorEmail });
        if (doctorUserId) setUserId(doctorUserId);
        if (doctorEmail) setUserEmail(doctorEmail);
      } else if (storedRole === "admin") {
        const adminUserId = localStorage.getItem("adminUserId");
        const adminEmail = localStorage.getItem("adminEmail");
        console.log("🔄 RoleContext - Restoring admin data:", { adminUserId, adminEmail });
        if (adminUserId) setUserId(adminUserId);
        if (adminEmail) setUserEmail(adminEmail);
      }
    }
  }, []);

  const loginAs = (newRole, newUserId = null, newEmail = null) => {
    console.log("💾 RoleContext - Saving:", { newRole, newUserId, newEmail });
    
    // Store the current role
    localStorage.setItem("role", newRole);
    setRole(newRole);
    
    // Store role-specific userId and email (does NOT overwrite other roles' data)
    if (newUserId) {
      if (newRole === "patient") {
        localStorage.setItem("patientUserId", newUserId.toString());
      } else if (newRole === "doctor") {
        localStorage.setItem("doctorUserId", newUserId.toString());
      } else if (newRole === "admin") {
        localStorage.setItem("adminUserId", newUserId.toString());
      }
      setUserId(newUserId);
    } else {
      console.warn("⚠️ userId is null/undefined - not saving to localStorage");
    }

    if (newEmail) {
      if (newRole === "patient") {
        localStorage.setItem("patientEmail", newEmail);
      } else if (newRole === "doctor") {
        localStorage.setItem("doctorEmail", newEmail);
      } else if (newRole === "admin") {
        localStorage.setItem("adminEmail", newEmail);
      }
      setUserEmail(newEmail);
    }
  };

  const clearRole = () => {
    const currentRole = localStorage.getItem("role");
    console.log("🗑️ RoleContext - Clearing data for role:", currentRole);
    
    // Only clear the current role's data, preserving other role sessions
    if (currentRole === "patient") {
      localStorage.removeItem("patientUserId");
      localStorage.removeItem("patientEmail");
      localStorage.removeItem("patientId");
    } else if (currentRole === "doctor") {
      localStorage.removeItem("doctorUserId");
      localStorage.removeItem("doctorEmail");
    } else if (currentRole === "admin") {
      localStorage.removeItem("adminUserId");
      localStorage.removeItem("adminEmail");
    }
    
    // Clear JWT token and role
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loginInfo");
    
    setRole(null);
    setUserId(null);
    setUserEmail(null);
  };

  const value = useMemo(
    () => ({ role, userId, userEmail, loginAs, clearRole }),
    [role, userId, userEmail]
  );

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
