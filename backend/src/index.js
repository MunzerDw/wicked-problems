const logger = require('morgan')
require('dotenv').config()
require('babel-polyfill')
const express = require('express')
const routers = require('./Routes')
const middlewares = require('./Middlewares')
const cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')
const admin = require('./Services/firebase.js')
const { Project, Invite, Node } = require('./Models')
const { Op } = require('sequelize')
const { socketConnections } = require('./Services/realtime')
const compression = require('compression')

//APP
const app = express()

//MIDDLEWARES
app.use(cors())
app.use(compression())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const middlewaresHandlers = Object.values(middlewares)
for (let i = 0; i < middlewaresHandlers.length; i++) {
  const middlewaresHandler = middlewaresHandlers[i]
  app.use(middlewaresHandler)
}

//ROUTES
const routes = Object.keys(routers)
for (let i = 0; i < routes.length; i++) {
  const route = routes[i]
  app.use('/' + route, routers[route])
}

// HTTP SERVER
const server = http.createServer(app)

// SOCKETS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  },
})
io.on('connection', async (socket) => {
  try {
    const user = await admin.auth().verifyIdToken(socket.handshake.auth.token)
    const projectId = socket.handshake.query.projectId
    const project = await Project.findOne({
      where: {
        id: projectId,
        [Op.or]: [{ '$invites.guestId$': user.uid }, { userId: user.uid }],
      },
      include: [{ model: Invite, as: 'invites' }],
    })
    if (!project) {
      throw new Error('Project not found')
    }
    socketConnections.addConnection({
      user: user,
      hostId: project.userId,
      projectId: project.id,
      socket: socket,
    })
    console.log(
      'SOCKET CLIENT CONNECTED',
      socketConnections.getConnections().length,
      socket.id,
      user.uid
    )
    socket.on('disconnect', async () => {
      const result = await Node.update(
        { selectedBy: null },
        {
          where: {
            projectId: project.id,
            selectedBy: user.uid,
          },
          returning: true,
        }
      )
      socketConnections.sendToSockets(
        project.userId,
        user.uid,
        'update-node',
        result[1][0]?.dataValues?.id,
        { selectedBy: null }
      )
      socketConnections.removeConnection(socket.id)
      console.log(
        'SOCKET CLIENT DISCONNECTED',
        socketConnections.getConnections().length,
        socket.id
      )
    })
  } catch (error) {
    console.log(error)
  }
})

server.listen(process.env.PORT, () => {
  console.log(`Successfully listening at http://localhost:${process.env.PORT}`)
})
