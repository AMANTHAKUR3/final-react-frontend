import LineChart from './ChartComponents/LineChart';
import PieChart from './ChartComponents/PieChart';

function ChartView({ VIRTUAL, IN_PERSON, LineData }) {
    const readmitted = LineData.map(item => item.readmitted);
    const recovered = LineData.map(item => item.recovered);
    return (<div>
        <div className='flex flex-row flex-wrap justify-center gap-10 m-10'>
            <PieChart
                VIRTUAL={VIRTUAL}
                IN_PERSON={IN_PERSON}
            />
            <LineChart
                readmitted={readmitted}
                recovered={recovered}
            />
        </div>

    </div>

    )
}

export default ChartView
