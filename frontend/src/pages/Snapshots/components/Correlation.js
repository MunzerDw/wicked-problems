import Flex from 'components/Flex'
import { Line } from 'react-chartjs-2'
import { useDarkMode } from 'hooks/useDarkMode'

function formatDate(date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}

function Correlation({ correlation, ...props }) {
  const { darkMode } = useDarkMode()
  const dates = correlation.snapshot1.data.map((d) => new Date(d.date))
  const values1 = correlation.snapshot1.data.map((d) => d.value)
  const values2 = correlation.snapshot2.data.map((d) => d.value)
  const lineData = {
    labels: dates?.map((date) => formatDate(date)),
    datasets: [
      {
        lineTension: 0.3,
        label: correlation.snapshot1.name,
        borderColor: 'rgb(129, 140, 248)',
        borderWidth: 2,
        pointBorderWidth: 1,
        pointRadius: 2,
        spanGaps: true,
        data: values1,
      },
      {
        lineTension: 0.3,
        label: correlation.snapshot2.name,
        borderColor: 'rgb(129, 80, 220)',
        borderWidth: 2,
        pointBorderWidth: 1,
        pointRadius: 2,
        spanGaps: true,
        data: values2,
      },
    ],
  }
  return (
    <Flex.Col className="w-full p-2 bg-white dark:bg-gray-700 shadow rounded">
      <div>
        Correlation: <b>{Math.round(correlation.correlation * 100) / 100}</b>
      </div>
      <div className="w-full p-4" style={{ minHeight: '250px' }}>
        <Line
          options={{
            animation: {
              duration: 0,
            },
            lineAtIndex: [2, 4, 30],
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: darkMode ? 'white' : 'black',
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (val, index) => {
                    if (typeof val === 'number') {
                      return val.toLocaleString('de-DE')
                    } else {
                      return val
                    }
                  },
                  color: darkMode ? 'white' : 'black',
                  beginAtZero: true,
                },
                grid: {
                  display: false,
                },
              },
              x: {
                grid: {
                  display: false,
                },
                barPercentage: 0.4,
                ticks: {
                  color: darkMode ? 'white' : 'black',
                  maxRotation: 45,
                  minRotation: 45,
                  maxTicksLimit: 20,
                },
              },
            },
          }}
          data={lineData}
        />
      </div>
    </Flex.Col>
  )
}

export default Correlation
