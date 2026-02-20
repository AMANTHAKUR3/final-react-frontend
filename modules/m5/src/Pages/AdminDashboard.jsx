import React, { useState, useEffect } from 'react';
import { DashboardData } from '../components/DashboardComponents/DashboardData';
import ChartView from '../components/DashboardComponents/ChartView';
import { PatientInOutCard } from '../components/DashboardComponents/PatientInOutCard';

export const AdminDashboard = () => {
  // 1. Renamed state to avoid conflict with the imported component name
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true); // 2. Start loading as true
  const [error, setError] = useState(null); // Added error state for better UX

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8020/admin/api/admin/dashboard");

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        
        const data = await response.json();
         setDashboardStats(data);
        console.log(data);
        // 3. Fixed the setter function name (was setReport)
        // console.log(dashboardStats);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <>
        <div>
         <DashboardData
          recovery={dashboardStats.recoveryRate}
          readmission={dashboardStats.readmissionRate}
          TA={dashboardStats.totalAppointments}
          TP={dashboardStats.totalPatients}
        />

          <ChartView 
          VIRTUAL = {dashboardStats.appointmentDistribution.VIRTUAL}
          IN_PERSON = {dashboardStats.appointmentDistribution.IN_PERSON}

          LineData = {dashboardStats.monthlyTrends}
          />

          <PatientInOutCard 
            inoutdata = {dashboardStats.patientStatusDistribution}
          />
        </div>
    </>
  );
};