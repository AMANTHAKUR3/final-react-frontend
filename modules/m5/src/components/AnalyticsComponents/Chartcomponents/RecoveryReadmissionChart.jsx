import { Line } from "react-chartjs-2";

function RecoveryReadmissionChart({ data }) {
  const PRIMARY = "#1DB1A2"; // teal
  const ACCENT  = "#aa4a3a"; // warm accent


  console.log(data);
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: "Recovery Rate (%)",
        data: data.map(item => item.recoveryRate),
        borderColor: PRIMARY,
        backgroundColor: "rgba(29, 177, 162, 0.15)", // soft fill
        pointBorderColor: PRIMARY,
        pointBackgroundColor: "#ffffff",
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Readmission Rate (%)",
        data: data.map(item => item.readmissionRate),
        borderColor: ACCENT,
        backgroundColor: "rgba(170, 74, 58, 0.12)",  // soft fill
        pointBorderColor: ACCENT,
        pointBackgroundColor: "#ffffff",
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'line',
          boxWidth: 20,
          boxHeight: 6,
          color: '#445569', // readable slate
          padding: 12,
          font: { size: 12, weight: 600 },
        },
      },
      title: {
        display: false, // we use the card header instead
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.96)',
        titleColor: '#ffffff',
        bodyColor: '#e9eef7',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        displayColors: true,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#6b7f92',
          font: { size: 11, weight: 500 },
          padding: 6,
        },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(99, 115, 129, 0.15)',
          borderDash: [4, 4],
        },
        ticks: {
          color: '#6b7f92',
          font: { size: 11, weight: 500 },
          padding: 6,
        },
        border: { display: false },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 2,
        hitRadius: 8,
      },
      line: {
        capBezierPoints: true,
      },
    },
  };

  return (
    <>
      <div
        className="
          group relative rounded-xl border p-4 md:p-5
          bg-white shadow-sm transition-all duration-200
          hover:shadow-md hover:-translate-y-0.5
        "
        style={{
          backgroundImage: 'linear-gradient(180deg, #ffffff, #f6fbfc)',
          borderColor: '#dbe5ef',
          boxShadow: '0 4px 20px -4px rgba(33, 45, 63, 0.08)',
        }}
      >
        {/* Accent strip on top */}
        <span
          className="absolute left-0 top-0 h-[2px] w-full rounded-t-xl"
          style={{ backgroundColor: PRIMARY }}
          aria-hidden="true"
        />

        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1f2a37]">
            Recovery Rate vs Readmission Rate
          </h2>
          <span
            className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
            style={{
              color: ACCENT,
              borderColor: 'rgba(29, 177, 162, 0.35)',
              backgroundColor: 'rgba(29, 177, 162, 0.08)',
            }}
          >
            Monthly
          </span>
        </div>

        {/* Chart */}
        <div className="h-64 md:h-72">
          <Line data={chartData} options={options} />
        </div>

        {/* Footer hint */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#6b7f92]">
            Tip: hover to compare series
          </span>
          <span
            className="inline-block h-1 w-10 rounded-full"
            style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}

export default RecoveryReadmissionChart;


