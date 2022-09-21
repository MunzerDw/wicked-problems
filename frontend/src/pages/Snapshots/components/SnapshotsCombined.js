import Flex from 'components/Flex'
import { observer } from 'mobx-react'
import snapshots from 'models/Snapshots'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useDarkMode } from 'hooks/useDarkMode'
import SelectMultiple from 'components/SelectMultiple'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Icon from 'components/Icon'

function formatDate(date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}
function getColor(i) {
  const blueShades = [
    '#5F9EA0',
    '#4682B4',
    '#B0C4DE',
    '#ADD8E6',
    '#87CEFA',
    '#6495ED',
    '#00BFFF',
    '#1E90FF',
    '#4169E1',
    '#0000FF',
    '#00008B',
  ]
  return blueShades[i % blueShades.length]
}
// https://renatello.com/javascript-array-of-years/
function generateArrayOfYears() {
  var max = new Date().getFullYear()
  var min = 1970
  var years = []

  for (var i = max; i >= min; i--) {
    years.push(i)
  }
  return years
}

const years = generateArrayOfYears()
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const SnapshotsCombined = observer(() => {
  const { darkMode } = useDarkMode()
  const [expanded, setExpanded] = useState(true)
  let actions = snapshots.getFilteredActions()
  const datesUnfiltered = snapshots.dates
  const minDate = new Date(datesUnfiltered[0] || new Date())
  const maxDate = new Date(
    datesUnfiltered[datesUnfiltered.length - 1] || new Date()
  )
  const [startDate, setStartDate] = useState(minDate)
  const [endDate, setEndDate] = useState(maxDate)
  console.log(minDate, maxDate, startDate, endDate)
  const dates = snapshots.dates?.filter((date) => {
    if (startDate) {
      if (startDate.getTime() > new Date(date).getTime()) {
        return false
      }
    }
    if (endDate) {
      if (endDate.getTime() < new Date(date).getTime()) {
        return false
      }
    }
    return true
  })
  actions = actions?.filter((action) => {
    const date = new Date(action.data?.doneAt).getTime()
    const minDate = new Date(dates[0]).getTime()
    const maxDate = new Date(dates[dates.length - 1]).getTime()
    if (minDate <= date && date <= maxDate) {
      console.log('date between')
      return true
    }
  })
  const lineData = {
    labels: dates?.map((date) => formatDate(new Date(date))),
    datasets: [
      {
        label: 'Actions',
        borderColor: '#6B7280',
        backgroundColor: '#6B7280',
        borderWidth: 2,
        pointBorderWidth: 4,
        pointRadius: 4,
        data: dates?.map((d) => {
          const actionExists = actions.find(
            (action) =>
              formatDate(new Date(action.data.doneAt)) ===
              formatDate(new Date(d))
          )
          return actionExists ? 100 : null
        }),
      },
      ...snapshots.filteredSnapshots.map((ss, i) => {
        const values = ss.data.map((d) => d.value)
        const maxValue = Math.max(...values)
        let dataObject = {}
        ss.data.forEach((d) => {
          dataObject[formatDate(new Date(d.date))] = d.value
        })
        return {
          label: ss.name,
          lineTension: 0.3,
          borderColor: getColor(i),
          borderWidth: 2,
          pointBorderWidth: 1,
          pointRadius: 1,
          spanGaps: true,
          data: dates?.map((date) => {
            const value = dataObject[formatDate(new Date(date))]
            if (value) {
              return (value * 100) / maxValue
            }
            return null
          }),
        }
      }),
    ],
  }
  return (
    <Flex.Col className="w-full rounded bg-white dark:bg-gray-700 shadow-md trans hover:shadow-lg">
      <Flex.Row justify="between" className="w-full p-4">
        <Flex.Row>
          <div
            className="text-3xl cursor-default hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            Snapshots combined
          </div>
          <DatePicker
            renderCustomHeader={({
              customHeaderCount,
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div
                style={{
                  margin: 10,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  {'<'}
                </button>
                <select
                  value={
                    (date.getMonth() + customHeaderCount) % months.length === 0
                      ? date.getFullYear() + customHeaderCount
                      : date.getFullYear()
                  }
                  onChange={({ target: { value } }) => changeYear(value)}
                >
                  {years.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  value={
                    months[
                      (date.getMonth() + customHeaderCount) % months.length
                    ]
                  }
                  onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                  }
                >
                  {months.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  {'>'}
                </button>
              </div>
            )}
            monthsShown={2}
            selected={startDate}
            onChange={(dates, e) => {
              e.stopPropagation()
              e.preventDefault()
              const [start, end] = dates
              setStartDate(start)
              setEndDate(end)
            }}
            customInput={
              <Flex.Row
                space="1"
                className="rounded p-2 py-1 dark:bg-gray-800 dark:hover:bg-gray-700 bg-gray-100 hover:bg-white shadow-md cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <div>Date range</div>
                <Icon name="FaCalendarAlt" />
                {startDate && (
                  <div>
                    from <b>{formatDate(startDate)}</b>
                  </div>
                )}
                {endDate && (
                  <div>
                    to <b>{formatDate(endDate)}</b>
                  </div>
                )}
              </Flex.Row>
            }
            startDate={startDate}
            endDate={endDate}
            selectsRange
          />
        </Flex.Row>
        <Flex.Row space="2">
          <SelectMultiple
            label="filter snapshots"
            data={snapshots.snapshots.map((s) => ({
              key: s.name,
              value: s,
            }))}
            selectedItems={snapshots.filteredSnapshots.map((s) => ({
              key: s.name,
              value: s,
            }))}
            setSelectedItems={(data) =>
              snapshots.setFilteredSnapshots(data.map((d) => d.value))
            }
          />
        </Flex.Row>
      </Flex.Row>
      {expanded && (
        <div className="w-full p-4" style={{ minHeight: '500px' }}>
          <Line
            options={{
              animation: {
                duration: 0,
              },
              plugins: {
                legend: {
                  labels: {
                    color: darkMode ? 'white' : 'black',
                  },
                },
                actions: {
                  nodes: JSON.parse(JSON.stringify(actions)),
                  maxValue: 100,
                },
                tooltip: {
                  callbacks: {
                    beforeTitle: (items, data) => {
                      const date = items[0].label
                      const filteredActions = actions.filter(
                        (action) =>
                          formatDate(new Date(action.data.doneAt)) === date &&
                          action.data.text
                      )
                      let result = '\n\nActions:\n\n'
                      for (let i = 0; i < filteredActions.length; i++) {
                        const action = filteredActions[i]
                        if (action.data.text) {
                          result += i + 1 + ') ' + action.data.text + '\n\n'
                        }
                      }
                      return filteredActions.length ? result : ''
                    },
                    label: (item, data) => {
                      try {
                        if (item['datasetIndex'] === 0) return null
                        const value = JSON.parse(item.raw)
                        if (typeof value === 'number') {
                          return value.toLocaleString('de-DE') + ' %'
                        }
                        return value
                      } catch (error) {
                        return item.value
                      }
                    },
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (val, index) => {
                      if (typeof val === 'number') {
                        return val.toLocaleString('de-DE') + ' %'
                      } else {
                        return val + ' %'
                      }
                    },
                    color: darkMode ? 'white' : 'black',
                    beginAtZero: true,
                  },
                  grid: {
                    color: 'gray',
                    lineWidth: 1,
                  },
                },
                x: {
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
      )}
    </Flex.Col>
  )
})

export default SnapshotsCombined
