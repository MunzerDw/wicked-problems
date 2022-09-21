class SocketConnections {
  connections = []

  addConnection(connection) {
    this.connections.push(connection)
    console.log('CONNECTION ADDED')
  }

  removeConnection(socketId) {
    this.connections = this.connections.filter((c) => c.socket.id !== socketId)
  }

  getConnections() {
    return this.connections
  }

  sendToSockets(hostId, userId, command, ...data) {
    const filteredConnections = this.connections.filter((con) => {
      return con.hostId === hostId && con.user.uid !== userId
    })
    console.log(
      'SENDING ' +
        command +
        ' TO ' +
        filteredConnections.length +
        ' CONNECTIONS | HOSTID ' +
        hostId +
        ' | USERID ' +
        userId
    )
    for (let i = 0; i < filteredConnections.length; i++) {
      const connection = filteredConnections[i]
      console.log(
        'CONNECTION | HOSTID ' +
          connection.hostId +
          ' | USERID ' +
          connection.user.uid +
          ' SOCKET ID ' +
          connection.socket.id
      )
      connection.socket.emit(command, ...data)
    }
  }
}

const socketConnections = new SocketConnections()

module.exports = {
  socketConnections,
}
