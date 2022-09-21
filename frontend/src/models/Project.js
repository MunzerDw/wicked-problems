import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import nodeEditor from './NodeEditor'
import socketIOClient from 'socket.io-client'
import settings from './Settings'
import snapshots from './Snapshots'
import firebase from 'firebase/app'

// Model the application state.
class Project {
  project = {}
  nodes = []
  edges = []
  socket
  fetchedData = false

  constructor() {
    makeAutoObservable(this)
  }

  connectSocket() {
    // Real Time
    console.log('connecting to socket', process.env.REACT_APP_SOCKET_URL)
    this.socket = socketIOClient(process.env.REACT_APP_SOCKET_URL, {
      path: process.env.NODE_ENV === 'development' ? '' : '/api/socket.io',
      auth: {
        token: axios.defaults.headers.authorization?.replace('Bearer ', ''),
      },
      query: {
        projectId: this.project?.id,
      },
    })
    this.socket.on('connect', () => {
      console.log('Socket connected', this.socket?.id)
    })
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected', this.socket?.id)
      this.socket = null
    })
    this.socket.on('update-node', (id, body) => {
      if (Object.keys(body).includes('x')) {
        this.nodes = this.nodes.map((node) => {
          if (node.id !== id) return node
          return {
            id: node.id,
            position: {
              x: body.x,
              y: body.y,
            },
            data: { ...node.data, label: '' },
            type: node.type,
          }
        })
      } else {
        this.editNode(body, id)
      }
    })
    this.socket.on('create-node', (node) => {
      this.addNode(node)
    })
    this.socket.on('delete-nodes', (ids) => {
      this.removeNodes(ids)
    })
    this.socket.on('create-edge', (node) => {
      this.addEdge(node)
    })
    this.socket.on('delete-edges', (ids) => {
      this.removeEdges(ids)
    })
    this.socket.on('create-evidence', (evidence) => {
      this.addEvidence(evidence)
    })
    this.socket.on('delete-evidences', (ids, nodeId) => {
      this.removeEvidence(ids, nodeId)
    })
  }

  getProject() {
    return this.project
  }

  findNode(id) {
    return this.nodes.find((node) => node.id === id)
  }

  findEdge(id) {
    return this.edges.find((edge) => edge.id === id)
  }

  getNodes() {
    return this.nodes
  }

  getEdges() {
    return this.edges
  }

  setProject(project) {
    this.project = project
  }

  setNodes(nodes) {
    this.nodes = nodes
  }

  setEdges(edges) {
    this.edges = edges
  }

  reset() {
    this.project = {}
    this.nodes = []
    this.edges = []
  }

  // STATE FUNCTIONS
  isLoggedIn() {
    const user = firebase.auth().currentUser
    return user
  }
  addNode(node) {
    this.setNodes([
      ...this.nodes,
      {
        id: node.id,
        position: {
          x: node.x,
          y: node.y,
        },
        data: { ...node, label: '' },
        type: node.type,
      },
    ])
  }
  removeNodes(ids) {
    this.setNodes(this.nodes.filter((node) => !ids.includes(node.id)))
  }
  addEdge(edge) {
    this.setEdges([
      ...this.edges,
      {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'custom',
      },
    ])
  }
  addEvidence(evidence) {
    const nodeIndex = this.nodes.findIndex((obj) => obj.id === evidence.nodeId)
    this.nodes[nodeIndex].data.evidences = [
      ...(this.nodes[nodeIndex].data.evidences || []),
      evidence,
    ]
  }
  removeEvidence(ids, nodeId) {
    const nodeIndex = this.nodes.findIndex((obj) => obj.id === nodeId)
    this.nodes[nodeIndex].data.evidences = this.nodes[
      nodeIndex
    ].data.evidences.filter((ev) => !ids.includes(ev.id))
  }
  removeEdges(ids) {
    this.setEdges(this.edges.filter((edge) => !ids.includes(edge.id)))
  }
  editEdge(newData, id) {
    const edgeIndex = this.edges.findIndex((obj) => obj.id === id)
    if (this.edges[edgeIndex]) {
      this.edges[edgeIndex] = { ...this.edges[edgeIndex], ...newData }
    }
  }
  editNode(newData, id) {
    const nodeIndex = this.nodes.findIndex((obj) => obj.id === id)
    if (this.nodes[nodeIndex] && this.nodes[nodeIndex].data) {
      this.nodes[nodeIndex].data = { ...this.nodes[nodeIndex].data, ...newData }
      if (newData.labelId) {
        const label = settings.findLabel(newData.labelId)
        this.nodes[nodeIndex].data.label = { ...label }
      }
    }
  }
  editNodePos(id, x, y) {
    const nodeIndex = this.nodes.findIndex((obj) => obj.id === id)
    if (this.nodes[nodeIndex] && this.nodes[nodeIndex].data) {
      this.nodes[nodeIndex].position = { x: x, y: y }
    }
  }
  updateLabels(newData, id) {
    const nodes = this.nodes.filter((obj) => obj.data.labelId === id)
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      node.data.label = { ...node.data.label, ...newData }
    }
  }
  deleteLabels(id) {
    const nodes = this.nodes.filter((obj) => obj.data.labelId === id)
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      node.data.label = null
      node.data.labelId = null
    }
  }
  hideQuestionBranch(id, hiddenState) {
    const qnode = this.findNode(id)
    if (qnode.type === 'QUESTION') {
      this.updateNode({ isHidden: hiddenState }, id)
      this.recursiveHide(qnode, hiddenState)
    }
    console.log(this.edges.length)
  }
  recursiveHide(node, hiddenState) {
    const connectedNodes = this.findConnectedNodesWithIndex(node.id)
    if (connectedNodes.length === 0) return
    for (let i = 0; i < connectedNodes.length; i++) {
      const connectedNode = connectedNodes[i]
      this.hideNode(connectedNode.id, hiddenState)
      this.hideEdge(connectedNode.edgeId, hiddenState)
      this.recursiveHide(connectedNode, hiddenState)
    }
  }

  // HELPERS
  hideNode(id, hiddenState) {
    const node = this.findNode(id)
    if (node.type !== 'QUESTION') {
      const nodeIndex = this.nodes.findIndex((obj) => obj.id === id)
      this.nodes[nodeIndex] = { ...node, isHidden: hiddenState }
      this.updateNode({ isHidden: hiddenState }, id)
    }
  }
  hideEdge(id, hiddenState) {
    const edge = this.findEdge(id)
    const edgeIndex = this.edges.findIndex((obj) => obj.id === id)
    this.edges[edgeIndex] = { ...edge, isHidden: hiddenState }
    this.updateEdge({ isHidden: hiddenState }, id)
  }
  nodesConnected(id1, id2) {
    return this.edges.filter(
      (edge) =>
        (edge.source === id1 && edge.target === id2) ||
        (edge.source === id2 && edge.target === id1)
    )
  }
  findConnectedNodesWithIndex(id) {
    const edges = this.edges.filter((edge) => edge.source === id)
    const edgest = this.edges.filter((edge) => !edge.source)
    console.log(edgest, id)
    return edges.map((edge, i) => ({
      edgeId: edge.id,
      id: edge.target,
      index: i,
    }))
  }

  // API FUNCTIONS
  async updateProject(body) {
    try {
      const response = await axios.put('/projects/' + this.project.id, body)
      if (response.status === 200) {
        this.setProject({ ...this.project, ...body })
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async selectNode(id) {
    try {
      const response = await axios.put(
        '/nodes/select/' + (id || nodeEditor.editorNode.id),
        { projectId: this.project.id }
      )
      if (response.status === 200) {
        this.editNode(response.data, id || nodeEditor.editorNode.id)
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deSelectNode(id) {
    try {
      const response = await axios.put(
        '/nodes/deselect/' + (id || nodeEditor.editorNode.id),
        { projectId: this.project.id }
      )
      if (response.status === 200) {
        this.editNode(response.data, id || nodeEditor.editorNode.id)
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async updateNode(body, id) {
    try {
      this.editNode(body, id || nodeEditor.editorNode.id)
      const response = await axios.put(
        '/nodes/' + (id || nodeEditor.editorNode.id),
        body
      )
      if (response.status === 200) {
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async vote(body) {
    try {
      const response = await axios.put('/votes', body)
      if (response.status === 200) {
        const node = this.findNode(body.nodeId)
        const newVote = response.data
        const oldVote = node.data.votes?.find((vote) => {
          return vote.id === newVote?.id
        })
        if (oldVote) {
          const votesFiltered = node.data.votes?.filter((vote) => {
            return vote.id !== oldVote.id
          })
          project.editNode(
            {
              vote: newVote,
              votes: [...votesFiltered, newVote],
            },
            node.id
          )
        } else if (newVote) {
          project.editNode(
            {
              votes: [...(node.data.votes || []), newVote],
              vote: newVote,
            },
            node.id
          )
        }
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async fetchProject(name) {
    try {
      const response = await axios('/projects/' + name)
      this.setProject(response.data)
      return response.data
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async fetchNodes(id) {
    try {
      if (!id) return
      const response = await axios('/nodes?projectId=' + id)
      this.setNodes(
        response.data.map((node) => ({
          id: node.id,
          position: {
            x: node.x,
            y: node.y,
          },
          isHidden: node.type !== 'QUESTION' ? node.isHidden : false,
          data: { ...node, label: node.label || '' },
          type: node.type,
        }))
      )
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async fetchEdges(id) {
    try {
      if (!id) return
      const response = await axios('/edges?projectId=' + id)
      this.setEdges(
        response.data.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          isHidden: edge.isHidden,
          type: 'custom',
        }))
      )
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async createNode(node) {
    try {
      const response = await axios.post('/nodes', {
        ...node,
        projectId: this.project.id,
      })
      this.addNode(response.data)
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteNodes(ids) {
    try {
      this.removeNodes(ids)
      const response = await axios.delete('/nodes', { data: { ids: ids } })
      if (response.status === 204) {
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async updateEdge(body, id) {
    try {
      const response = await axios.put('/edges/' + id, body)
      if (response.status === 200) {
        this.editEdge(response.data, id)
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async createEdge(edge) {
    try {
      const response = await axios.post('/edges', {
        ...edge,
        projectId: this.project.id,
      })
      this.addEdge(response.data)
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteEdges(ids) {
    try {
      this.removeEdges(ids)
      const response = await axios.delete('/edges', { data: { ids: ids } })
      if (response.status === 204) {
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async createEvidence(evidence) {
    try {
      const data = new FormData()
      const keys = Object.keys(evidence)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        data.append(key, evidence[key])
      }
      const response = await axios.post('/evidences', data)
      this.addEvidence(response.data)
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteEvidences(evidences) {
    try {
      const response = await axios.delete('/evidences', {
        data: { ids: evidences.map((ev) => ev.id) },
      })
      if (response.status === 204) {
        this.removeEvidence(
          evidences.map((ev) => ev.id),
          evidences[0]?.nodeId
        )
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async createInvite(email) {
    try {
      const response = await axios.post('/invites', {
        email: email,
        projectId: this.project.id,
      })
      if (response.status === 201) {
        this.project?.invites?.push(response.data)
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteInvite(id) {
    try {
      const response = await axios.delete('/invites/' + id)
      if (response.status === 204) {
        this.project.invites = this.project?.invites?.filter(
          (invite) => invite.id !== id
        )
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }

  // ONLOAD
  async loadProjectAndNodes(name) {
    if (!this.fetchedData || name !== this.project?.urlSafeName) {
      this.reset()
      const project = await this.fetchProject(name)
      await this.fetchNodes(project?.id)
      await this.fetchEdges(project?.id)
      await settings.fetchLabels(name)
      await snapshots.loadSnapshots(name)
      if (!this.socket) {
        this.connectSocket()
      }
      this.fetchedData = true
    }
  }
}

const project = new Project()

export default project
