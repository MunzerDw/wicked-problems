import CanvasPage from 'components/CanvasPage/CanvasPage'
import Flex from 'components/Flex'
import NumberStat from 'components/NumberStat'
import project from 'models/Project'
import { Bar, Line } from 'react-chartjs-2'
import { observer } from 'mobx-react'
import Table from 'components/Table'
import Badge from 'components/Badge'
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import { useDarkMode } from 'hooks/useDarkMode'
import moment from 'moment'

function formatDate(date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}

function calculateStatistics() {
  const nodes = project.nodes
  const edges = project.edges
  const date = new Date(project.project.createdAt)
  let result = {}
  result.totalNodes = nodes.length
  result.actionsTaken = nodes.filter((node) => {
    return node.type === 'ACTION' && node.data.doneAt
  }).length
  result.users = (project.project.invites?.length || 0) + 1
  result.created = formatDate(date)
  const ideaNodesIds = nodes
    .filter((node) => node.type === 'IDEA')
    .map((node) => node.id)
  const questionsEdgesToIdeas = nodes
    .filter((node) => node.type === 'QUESTION')
    .map((node) => {
      const edgesFromQuestionToIdeas = edges.filter(
        (edge) => edge.source === node.id && ideaNodesIds.includes(edge.target)
      )
      return edgesFromQuestionToIdeas.length
    })
  result.maxIdeasPerQuestion = questionsEdgesToIdeas.length
    ? Math.max(...questionsEdgesToIdeas)
    : 0
  result.minIdeasPerQuestion = Math.min(...questionsEdgesToIdeas)
  try {
    result.avgIdeasPerQuestion =
      Math.round(
        (questionsEdgesToIdeas.reduce((x, y) => x + y, 0) * 100) /
          questionsEdgesToIdeas.length
      ) / 100
  } catch (error) {
    result.avgIdeasPerQuestion = '-'
  }
  result.nodes = [
    nodes.filter((node) => {
      return node.type === 'QUESTION'
    }).length,
    nodes.filter((node) => {
      return node.type === 'IDEA'
    }).length,
    nodes.filter((node) => {
      return node.type === 'ACTION'
    }).length,
    nodes.filter((node) => {
      return node.type === 'ARGUMENT' && node.data.for
    }).length,
    nodes.filter((node) => {
      return node.type === 'ARGUMENT' && !node.data.for
    }).length,
    nodes.filter((node) => {
      return node.type === 'CONSTRAINT'
    }).length,
  ]
  return result
}

const Statistics = observer(() => {
  const { darkMode } = useDarkMode()
  const statistics = calculateStatistics()
  let logsDates = {}
  project.project.logs?.forEach((log) => {
    const dateObj = new Date(log.createdAt)
    const formatedDate = new Date(dateObj.setHours(0, 0, 0, 0))
    logsDates[formatedDate] = isNaN(logsDates[formatedDate])
      ? 0
      : logsDates[formatedDate] + 1
  })

  let dates = Object.keys(logsDates)
    ?.slice()
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]
    const nextDate = dates[i + 1]
    if (nextDate) {
      if (moment(nextDate).diff(moment(date), 'days') > 1) {
        dates.splice(i + 1, 0, moment(date).add(1, 'days').toDate())
      }
    }
  }

  const lineData = {
    labels: dates.map((d) => formatDate(new Date(d))),
    datasets: [
      {
        lineTension: 0.3,
        label: false,
        borderColor: 'rgb(129, 140, 248)',
        borderWidth: 1,
        pointBorderWidth: 1,
        pointRadius: 2,
        data: dates.map((date) => logsDates[date] || 0),
      },
    ],
  }
  const barData = {
    labels: [
      'Questions',
      'Ideas',
      'Actions',
      'Arguments For',
      'Arguments Against',
      'Constraints',
    ],
    datasets: [
      {
        legend: {
          display: false,
        },
        data: statistics.nodes,
        backgroundColor: [
          'rgb(252, 231, 30, .9)',
          'rgb(245, 158, 11, .9)',
          'rgb(129, 140, 248, .9)',
          'rgb(16, 185, 129, .9)',
          'rgb(239, 68, 68, .9)',
          'rgb(0,0,0, .9)',
        ],
        borderColor: [
          'rgb(252, 231, 30)',
          'rgb(245, 158, 11)',
          'rgb(129, 140, 248)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(0,0,0)',
        ],
        borderWidth: 2,
      },
    ],
  }
  return (
    <CanvasPage className="p-12">
      <div className="text-4xl font-medium mb-16">Statistics</div>
      <div className="grid grid-cols-2 gap-8">
        <Flex.Col className="bg-white rounded shadow p-4 dark:bg-gray-700">
          <div className="text-2xl">Details</div>
          <div className="grid grid-cols-2 pa-y-2 gap-x-8 flex items-center">
            <div className="opacity-75">
              Average number of ideas to a question
            </div>
            <div className="font-bold text-lg">
              {statistics.avgIdeasPerQuestion || '-'}
            </div>
            <div className="opacity-75">
              Maximum number of ideas to a question
            </div>
            <div className="font-bold text-lg">
              {statistics.maxIdeasPerQuestion || '-'}
            </div>
            <div className="opacity-75">Project created at</div>
            <div className="font-bold text-lg">{statistics.created}</div>
          </div>
        </Flex.Col>
        <Flex.Row
          space="8"
          className="bg-white rounded shadow p-4 dark:bg-gray-700"
        >
          <NumberStat.Medium
            value={statistics.totalNodes}
            text="nodes"
            icon="FaProjectDiagram"
            className="bg-gradient-to-r from-indigo-300 to-indigo-400 text-white w-full"
          />
          <NumberStat.Medium
            value={statistics.actionsTaken}
            text="actions taken"
            icon="FaArrowsAlt"
            className="bg-gradient-to-r from-green-300 to-green-400 text-white w-full"
          />
          <NumberStat.Medium
            value={statistics.users}
            text="users"
            icon="FaUsers"
            className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-white w-full"
          />
        </Flex.Row>
        <Flex.Col className="bg-white rounded shadow p-4 dark:bg-gray-700">
          <div className="text-2xl">Nodes</div>
          <div className="w-full" style={{ minHeight: '400px' }}>
            <Bar
              options={{
                animation: {
                  duration: 0,
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      color: darkMode ? 'white' : 'black',
                      beginAtZero: true,
                      userCallback: function (label, index, labels) {
                        if (Math.floor(label) === label) {
                          return label
                        }
                      },
                    },
                    grid: {
                      color: 'gray',
                    },
                  },
                  x: {
                    ticks: {
                      beginAtZero: true,
                      stepSize: 1,
                      color: darkMode ? 'white' : 'black',
                    },
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
              data={barData}
            />
          </div>
        </Flex.Col>
        <Flex.Col className="bg-white rounded shadow p-4 dark:bg-gray-700">
          <div className="text-2xl">Activity</div>
          <div className="w-full" style={{ minHeight: '400px' }}>
            <Line
              options={{
                animation: {
                  duration: 0,
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      beginAtZero: true,
                      display: false,
                    },
                    grid: {
                      color: 'gray',
                    },
                  },
                  x: {
                    ticks: {
                      color: darkMode ? 'white' : 'black',
                      maxRotation: 45,
                      minRotation: 45,
                      maxTicksLimit: 10,
                    },
                    gridLines: {
                      display: false,
                    },
                  },
                },
              }}
              data={lineData}
            />
          </div>
        </Flex.Col>
        {project.isLoggedIn() && (
          <Flex.Col
            className="col-span-2 bg-white rounded shadow p-4 dark:bg-gray-700"
            style={{ maxHeight: '700px' }}
          >
            <div className="text-2xl">Logs</div>
            <Table>
              <Table.Head className="bg-gray-200 dark:bg-gray-900">
                <Table.Cell>User</Table.Cell>
                <Table.Cell>Date</Table.Cell>
                <Table.Cell>Action</Table.Cell>
                <Table.Cell>Node</Table.Cell>
                <Table.Cell>Details</Table.Cell>
              </Table.Head>
              <Table.Body>
                {project.project.logs
                  ?.slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((log, i) => {
                    return (
                      <Table.Row key={i}>
                        <Table.Cell>
                          <FirebaseAuthConsumer>
                            {({
                              isSignedIn,
                              user,
                              providerId,
                              ...authState
                            }) => {
                              return user.uid === log.userId &&
                                user.uid === project.project.userId
                                ? 'Admin (you)'
                                : user.uid !== log.userId &&
                                  log.userId === project.project.userId
                                ? 'Admin'
                                : user.uid === log.userId &&
                                  log.userId !== project.project.userId
                                ? 'Collaborator (you)'
                                : 'Collaborator'
                            }}
                          </FirebaseAuthConsumer>
                        </Table.Cell>
                        <Table.Cell>
                          {formatDate(new Date(log.createdAt))}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            color={
                              log.type === 'CREATE'
                                ? 'indigo-400'
                                : log.type === 'UPDATE'
                                ? 'yellow-500'
                                : 'red-500'
                            }
                            text={log.type}
                            className="text-white"
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {log.nodeId ? (
                            <>
                              <span className="font-bold">{log.node.type}</span>
                              <span>
                                {log.node.text ? ': ' + log.node.text : ''}
                              </span>
                            </>
                          ) : (
                            '-'
                          )}
                        </Table.Cell>
                        <Table.Cell>{JSON.stringify(log.details)}</Table.Cell>
                      </Table.Row>
                    )
                  })}
              </Table.Body>
            </Table>
          </Flex.Col>
        )}
      </div>
    </CanvasPage>
  )
})

export default Statistics
