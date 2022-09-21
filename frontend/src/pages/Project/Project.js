import CanvasPage from 'components/CanvasPage/CanvasPage'
import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
} from 'react-flow-renderer'
import NodesBar from './components/NodesBar'
import Question from './components/Question'
import { v4 as uuidv4 } from 'uuid'
import Idea from './components/Idea'
import Action from './components/Action'
import Argument from './components/Argument'
import Constraint from './components/Constraint'
import NodeEditor from './components/NodeEditor'
import projectModel from 'models/Project'
import CustomEdge from './components/CustomEdge'
import project from 'models/Project'

// HELPERS
const nodeTypes = {
  QUESTION: Question,
  IDEA: Idea,
  ACTION: Action,
  ARGUMENT: Argument,
  CONSTRAINT: Constraint,
}
const edgeTypes = {
  custom: CustomEdge,
}

const Project = observer(() => {
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  console.log('Project')
  const onLoad = (_reactFlowInstance) => {
    setReactFlowInstance(_reactFlowInstance)
    // setTimeout(() => _reactFlowInstance.fitView(), 0)
  }
  const onElementsRemove = (elementsToRemove) => {
    const nodes = elementsToRemove.filter(
      (element) => !element.source && !element.target
    )
    console.log(nodes)
    const edges = elementsToRemove.filter(
      (element) => element.source && element.target
    )
    console.log(edges)
    nodes.length && projectModel.deleteNodes(nodes.map((element) => element.id))
    edges.length && projectModel.deleteEdges(edges.map((element) => element.id))
  }
  const onConnect = (params) => {
    projectModel.createEdge({ source: params.source, target: params.target })
  }
  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }
  const onDrop = (event) => {
    event.preventDefault()

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')
    const argumentFor = event.dataTransfer.getData('text/plain')
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })
    const newNodeFormated = {
      id: uuidv4(),
      type: type,
      for:
        argumentFor === 'true' || argumentFor === 'false'
          ? JSON.parse(argumentFor)
          : null,
      x: position.x,
      y: position.y,
    }
    projectModel.createNode(newNodeFormated)
  }
  return (
    <CanvasPage>
      <div className="dndflow w-full h-full">
        <ReactFlowProvider>
          <div
            className="reactflow-wrapper w-full h-full"
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodeTypes={nodeTypes}
              elements={[
                ...projectModel.getNodes(),
                ...projectModel.getEdges(),
              ]}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              defaultZoom={0.01}
              edgeTypes={edgeTypes}
              minZoom={0.01}
            >
              <Background variant="dots" gap={12} />
              <MiniMap
                maskColor="rgb(0, 0, 0, 0.5)"
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                }}
                nodeStrokeColor={(n) => {
                  if (n.style?.background) return n.style.background
                  if (n.type === 'CONSTRAINT') return 'black'
                  if (n.type === 'IDEA') return 'orange'
                  if (n.type === 'ARGUMENT' && !n.data.for) return 'red'
                  if (n.type === 'ARGUMENT' && n.data.for) return 'green'
                  if (n.type === 'ACTION') return 'indigo'
                  if (n.type === 'QUESTION') return 'orange'

                  return '#eee'
                }}
                nodeColor={(n) => {
                  if (n.style?.background) return n.style.background
                  if (n.type === 'CONSTRAINT') return 'black'
                  if (n.type === 'IDEA') return 'orange'
                  if (n.type === 'ARGUMENT' && !n.data.for) return 'red'
                  if (n.type === 'ARGUMENT' && n.data.for) return 'green'
                  if (n.type === 'ACTION') return 'indigo'
                  if (n.type === 'QUESTION') return 'orange'
                }}
                nodeBorderRadius={2}
              />
              <Controls />
            </ReactFlow>
          </div>
          {project.isLoggedIn() && <NodesBar />}
        </ReactFlowProvider>
      </div>
      <NodeEditor />
    </CanvasPage>
  )
})

export default Project
