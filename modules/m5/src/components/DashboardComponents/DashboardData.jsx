import React, { useEffect, useState } from 'react';
import { StatCard } from './StatCard';

// 1. Destructuring props clarifies what data is expected
export const DashboardData = ({  recovery, readmission ,TA, TP,}) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const data = [
      {
        name: "Total Patients",
        count: TP,
      },
      {
        name: "Total Appointments", // Fixed typo
        count: TA,
      },
      {
        name: "Recovery Rate",
        count: recovery,
        isPercentage: true, // Added a flag for cleaner logic later
      },
      {
        name: "Readmission Rate",
        count: readmission,
        isPercentage: true,
      }
    ];
    setCards(data);
    console.log(data);
  }, [TP, TA, recovery, readmission]); // 2. Updates when data changes

  return (
    <>
      <div className="flex justify-center w-full px-3 pt-5 md:px-4">
        <h2 className="mb-4 max-w-[1200px] text-xl font-semibold tracking-tight text-slate-800">
          Dashboard Overview
        </h2>
      </div>

      <div className="StatsData flex flex-row flex-wrap justify-center gap-20 p-2 transition-all delay-300">
        {cards.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          cards.map((item) => (
            <StatCard
              key={item.id ?? item.name}
              Title={item.name}
              // 3. Logic moved inside the prop value to avoid duplicate component blocks
              count={item.isPercentage ? `${item.count}%` : item.count}
            />
          ))
        )}
      </div>
    </>
  );
};