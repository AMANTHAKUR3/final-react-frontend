import React, { useState, useEffect } from "react";
import AnalyticsHeader from "../components/AnalyticsComponents/AnalyticsHeader";
import AnalyticsFilter from "../components/AnalyticsComponents/AnalyticsFilter";
import RecoveryReadmissionChart from "../components/AnalyticsComponents/Chartcomponents/RecoveryReadmissionChart";
import PatientFlowChart from "../components/AnalyticsComponents/Chartcomponents/PatientFlowChart";
import DiseaseAnalyticsTable from "../components/AnalyticsComponents/DiseaseAnalyticsTable";
import AnalyticsInsights from "../components/AnalyticsComponents/AnalyticsInsights";

export default function Analytics() {
  // 1. STATE: Store filters and the fetched dashboard data
  const [filters, setFilters] = useState({
    period: "12m",
    patientType: "all",
    department: "all",
    metric: "all",
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
    const [fscren,setFscreen] = useState(false);


  // 2. EFFECT: Fetch data whenever 'filters' change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Call your Spring Boot API
        console.log("This is",filters);
        const response = await fetch("http://localhost:8020/admin/api/admin/Analytics", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...filters})
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const result = await response.json();
        setDashboardData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // 3. HANDLER: Update state when user clicks "Apply" in the filter
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="m-auto max-w-[70%] bg-gray-50 min-h-screen pb-10">
      <AnalyticsHeader />

      {/* Pass the handler to the Filter component */}
      <AnalyticsFilter
        defaultValues={filters}
        onApply={handleFilterApply}
      />

      {/* Show Loading or Real Data */}
      {loading || !dashboardData ? (
        <div className="p-10 text-center text-gray-500 animate-pulse">
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Chart 1: Recovery vs Readmission */}
            <RecoveryReadmissionChart
              data={dashboardData.recoveryVsReadmissionTrend}
              fscren = {fscren}
              setFscreen = {setFscreen}
            />

            {/* Chart 2: In vs Out Patients */}
            <PatientFlowChart
              data={dashboardData.inVsOutTrend}
              fscren = {fscren}
              setFscreen = {setFscreen}
            />
          </div>

          <div className="mt-8">
            {/* Table: Disease Stats */}
            <DiseaseAnalyticsTable
              data={dashboardData.readmissionByDisease}
            />

            {/* Insights Panel */}
            {/* <AnalyticsInsights
              data={dashboardData.insights}
            /> */}
          </div>
        </>
      )}
    </div>
  );
}