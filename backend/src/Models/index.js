const Test = require('./test.js')
const Project = require('./project.js')
const Node = require('./node.js')
const Edge = require('./edge.js')
const Vote = require('./vote.js')
const Log = require('./log.js')
const Evidence = require('./evidence.js')
const Invite = require('./invite.js')
const Snapshot = require('./snapshot.js')
const Data = require('./data.js')
const Label = require('./label.js')

// Snapshots & Data
Snapshot.Data = Snapshot.hasMany(Data, {
  as: 'data',
  foreignKey: 'snapshotId',
})
Data.Snapshot = Data.belongsTo(Snapshot, {
  as: 'snapshot',
  foreignKey: 'snapshotId',
})

// Labels & Nodes
Label.Node = Label.hasMany(Node, {
  as: 'nodes',
  foreignKey: 'labelId',
})
Node.Label = Node.belongsTo(Label, {
  as: 'label',
  foreignKey: 'labelId',
})

// Projects & Labels
Project.Snapshot = Project.hasMany(Label, {
  as: 'labels',
  foreignKey: 'projectId',
})
Label.Project = Label.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
})

// Projects & Snapshots
Project.Snapshot = Project.hasMany(Snapshot, {
  as: 'snapshots',
  foreignKey: 'projectId',
})
Snapshot.Project = Snapshot.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
})

// Projects & Edges
Project.Edge = Project.hasMany(Edge, { as: 'edges', foreignKey: 'projectId' })
Edge.Project = Edge.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
})

// Projects & Nodes
Project.Node = Project.hasMany(Node, { as: 'nodes', foreignKey: 'projectId' })
Node.Project = Node.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
})

// Nodes & Votes
Node.Vote = Node.hasMany(Vote, { as: 'votes', foreignKey: 'nodeId' })
Vote.Node = Vote.belongsTo(Node, { as: 'node', foreignKey: 'nodeId' })

// Nodes & Edges
Node.Edge = Node.hasMany(Edge, {
  as: 'sourceEdges',
  foreignKey: 'source',
  onDelete: 'CASCADE',
})
Node.Edge = Node.hasMany(Edge, {
  as: 'targetEdges',
  foreignKey: 'target',
  onDelete: 'CASCADE',
})
Edge.Node = Edge.belongsTo(Node, {
  as: 'sources',
  foreignKey: 'source',
})
Edge.Node = Edge.belongsTo(Node, {
  as: 'targets',
  foreignKey: 'target',
})

// Projects & Logs
Project.Log = Project.hasMany(Log, {
  as: 'logs',
  foreignKey: 'projectId',
})
Log.Project = Log.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
})

// Nodes & Logs
Node.Log = Node.hasMany(Log, {
  as: 'logs',
  foreignKey: 'nodeId',
  onDelete: 'SET NULL',
})
Log.Node = Log.belongsTo(Node, {
  as: 'node',
  foreignKey: 'nodeId',
})

// Nodes & Evidences
Node.Evidence = Node.hasMany(Evidence, {
  as: 'evidences',
  foreignKey: 'nodeId',
})
Evidence.Node = Evidence.belongsTo(Node, {
  as: 'node',
  foreignKey: 'nodeId',
})

// Projects & Invites
Project.Invite = Project.hasMany(Invite, {
  as: 'invites',
  foreignKey: 'projectId',
})
Invite.Project = Invite.belongsTo(Project, {
  as: 'project',
  foreignKey: 'projectId',
})

module.exports = {
  Test,
  Project,
  Node,
  Edge,
  Vote,
  Log,
  Evidence,
  Invite,
  Snapshot,
  Data,
  Label,
}
