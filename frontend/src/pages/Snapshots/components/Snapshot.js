import Button from 'components/Button'
import Flex from 'components/Flex'
import { observer } from 'mobx-react'
import importData from 'models/ImportData'
import snapshotEditor from 'models/SnapshotEditor'
import snapshots from 'models/Snapshots'
import { useState } from 'react'
import { Chart, Line } from 'react-chartjs-2'
import { useDarkMode } from 'hooks/useDarkMode'
import moment from 'moment'
import InfoPopup from 'components/InfoPopup'
import copy from 'copy-to-clipboard'
import SimpleButton from 'components/SimpleButton'
import firebase from 'firebase/app'
import project from 'models/Project'

function formatDate(date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}
Chart.register({
  id: 'actions',
  beforeDraw: function (chart, args, options) {
    const nodes = options.nodes
    const maxValue = options.maxValue
    const ctx = chart.ctx
    const topY = chart.scales['y'].getPixelForValue(maxValue)
    const bottomY = chart.scales['y'].bottom
    for (let i = 0; i < nodes?.length; i++) {
      const node = nodes[i]
      const x = chart.scales['x'].getPixelForValue(
        formatDate(new Date(node.data.doneAt))
      )
      if (x) {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 2
        ctx.strokeStyle = node.data.label?.color || '#e23fa9'
        ctx.stroke()
        ctx.restore()
      }
    }
  },
})

const Snapshot = observer(({ id, index, ...props }) => {
  const user = firebase.auth()?.currentUser
  const { darkMode } = useDarkMode()
  const [expanded, setExpanded] = useState(false)
  const snapshot = snapshots.findSnapshot(id)
  let actions = snapshots.getFilteredActions()
  let dates = [...(snapshot.data?.map((d) => d.date) || [])]
    ?.slice()
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  actions = actions?.filter((action) => {
    const date = new Date(action.data?.doneAt).getTime()
    const minDate = new Date(dates[0]).getTime()
    const maxDate = new Date(dates[dates.length - 1]).getTime()
    if (minDate <= date && date <= maxDate) {
      console.log('date between')
      return true
    }
  })
  console.log(actions)
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]
    const nextDate = dates[i + 1]
    if (nextDate) {
      if (moment(nextDate).diff(moment(date), 'days') > 1) {
        dates.splice(i + 1, 0, moment(date).add(1, 'days').toDate())
      }
    }
  }
  const data = snapshot.data || []
  const maxValue = Math.max(...data.map((d) => d.value))
  const lineData = {
    labels: dates?.map((date) => formatDate(new Date(date))),
    datasets: [
      {
        lineTension: 0.3,
        label: 'data',
        borderColor: 'rgb(129, 140, 248)',
        borderWidth: 2,
        pointBorderWidth: 1,
        pointRadius: 2,
        spanGaps: true,
        data: dates?.map((d) => {
          const value = data.find((da) => da.date === d)?.value
          return value
        }),
      },
      {
        lineTension: 0.3,
        label: 'actions',
        borderColor: '#6B7280',
        backgroundColor: '#6B7280',
        borderWidth: 4,
        pointBorderWidth: 4,
        pointRadius: 4,
        data: dates?.map((d) => {
          const actionExists = actions.find(
            (action) =>
              formatDate(new Date(action.data.doneAt)) ===
              formatDate(new Date(d))
          )
          return actionExists ? maxValue : null
        }),
      },
    ],
  }
  return (
    <Flex.Col
      id={id}
      className="w-full rounded bg-white dark:bg-gray-700 shadow-md trans hover:shadow-lg"
    >
      <Flex.Row align="start" justify="between" className="w-full p-4">
        <Flex.Col space="1">
          <div
            className="text-3xl font-bold hover:underline cursor-default"
            onClick={() => setExpanded(!expanded)}
          >
            {snapshot.name}
          </div>
          {(dates.length && (
            <div className="">
              {formatDate(new Date(dates[0])) +
                ' to ' +
                formatDate(new Date(dates[dates.length - 1]))}
            </div>
          )) ||
            ''}
        </Flex.Col>
        <Flex.Row space="0">
          <Flex.Row className="mr-4">
            {project.isLoggedIn() && (
              <InfoPopup
                onClick={() => {
                  copy(
                    window.origin + '/api/snapshots/' + snapshot.id + '/data'
                  )
                }}
                text="data endpoint"
                expandDown={!index}
              >
                <div className="">{snapshot.name}</div>
                <br />
                <div className="text-sm">Endpoint to add data</div>
                <div className="dark:bg-gray-900 bg-gray-200 w-full h-full font-mono rounded p-2">
                  <div className="whitespace-normal font-bold">POST</div>
                  <div className="whitespace-normal font-bold">
                    -h Authorization: {'Bearer <BEARER_TOKEN>'}
                  </div>
                  <div className="whitespace-normal font-bold">
                    {process.env.NODE_ENV === 'development'
                      ? process.env.REACT_APP_BACKEND_URL +
                        '/snapshots/' +
                        snapshot.id +
                        '/data'
                      : window.origin +
                        '/api/snapshots/' +
                        snapshot.id +
                        '/data'}
                  </div>
                </div>
                <div className="text-sm">Request body format</div>
                <div className="dark:bg-gray-900 bg-gray-200 w-full h-full font-mono rounded p-2">
                  <div>{'{'}</div>
                  <div className="ml-2">
                    <div>{'text: String, // csv text string'}</div>
                    <div>{'dateColumn?: String,'}</div>
                    <div>{'valueColumn?: String,'}</div>
                    <div>{'dateFormat?: String,'}</div>
                    <div>{'separator?: String'}</div>
                  </div>
                  <div>{'}'}</div>
                </div>
                <div className="text-sm">Response on success (200)</div>
                <div className="dark:bg-gray-900 bg-gray-200 w-full h-full font-mono rounded p-2">
                  <div>{'[{'}</div>
                  <div className="ml-2">
                    <div>{'date: Date,'}</div>
                    <div>{'value: Number'}</div>
                  </div>
                  <div>{'}]'}</div>
                </div>
                <br />
                <SimpleButton
                  text="copy bearer token"
                  icon="FaCopy"
                  onClick={() => {
                    copy(user.za)
                  }}
                />
                <SimpleButton
                  text="copy endpoint url"
                  icon="FaCopy"
                  onClick={() => {
                    copy(
                      process.env.NODE_ENV === 'development'
                        ? process.env.REACT_APP_BACKEND_URL +
                            '/snapshots/' +
                            snapshot.id +
                            '/data'
                        : window.origin +
                            '/api/snapshots/' +
                            snapshot.id +
                            '/data'
                    )
                  }}
                />
              </InfoPopup>
            )}
            <InfoPopup
              text="statistics"
              icon="FaChartLine"
              expandDown={!index}
              onClick={() => {
                snapshots.calculateStatistics(snapshot.id)
              }}
            >
              <div className="">{snapshot.name}</div>
              <br />
              <div className="grid grid-cols-2 pa-y-2 gap-x-8 flex items-center">
                <div className="opacity-75">Max</div>
                <div className="font-bold text-lg">
                  {snapshot.statistics?.max === undefined
                    ? '-'
                    : snapshot.statistics?.max}
                </div>
                <div className="opacity-75">Average</div>
                <div className="font-bold text-lg">
                  {snapshot.statistics?.avg === undefined
                    ? '-'
                    : snapshot.statistics?.avg}
                </div>
                <div className="opacity-75">Min</div>
                <div className="font-bold text-lg">
                  {snapshot.statistics?.min === undefined
                    ? '-'
                    : snapshot.statistics?.min}
                </div>
              </div>
            </InfoPopup>
          </Flex.Row>
          {project.isLoggedIn() && (
            <Flex.Row space="0">
              <Button
                basic
                title="edit snapshot"
                icon="FaEdit"
                color="indigo"
                onClick={() => {
                  snapshotEditor.setEditorSnapshot(snapshot)
                  snapshotEditor.setOpen(true)
                }}
              />
              <Button
                basic
                title="delete snapshot and its data"
                icon="FaTrashAlt"
                color="yellow"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete this snapshot?'
                    )
                  ) {
                    snapshots.deleteSnapshot(id)
                  }
                }}
              />
              <Button
                basic
                title="import data"
                icon="FaDatabase"
                color="green"
                onClick={() => {
                  importData.setSnapshotId(id)
                  importData.setOpen(true)
                }}
              />
              <Button
                basic
                title="delete imported data"
                icon="FaMinus"
                color="yellow"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete the data of this snapshot?'
                    )
                  ) {
                    snapshots.deleteSnapshotData(id)
                  }
                }}
              />
            </Flex.Row>
          )}
        </Flex.Row>
      </Flex.Row>
      {(expanded && data.length && (
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
                  maxValue: maxValue,
                },
                tooltip: {
                  callbacks: {
                    beforeTitle: (items) => {
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
                        console.log(item)
                        if (item['datasetIndex'] === 1) {
                          return null
                        }
                        const value = JSON.parse(item.raw)
                        if (typeof value === 'number') {
                          return value.toLocaleString('de-DE')
                        }
                        return value
                      } catch (error) {
                        return item.value
                      }
                    },
                  },
                },
              },
              lineAtIndex: [2, 4, 30],
              responsive: true,
              maintainAspectRatio: false,
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
      )) ||
        ''}
    </Flex.Col>
  )
})

export default Snapshot
