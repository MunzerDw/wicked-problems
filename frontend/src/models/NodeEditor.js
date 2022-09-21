import { makeAutoObservable } from 'mobx'
import evidenceEditor from './EvidenceEditor'
import project from './Project'

// Model the application state.
class NodeEditor {
  editorNode = {}
  open = false

  constructor() {
    makeAutoObservable(this)
  }

  getEditorNode() {
    return this.editorNode
  }

  setEditorNode(editorNode) {
    this.editorNode = Object.assign({}, { ...editorNode })
  }

  async setOpen(state) {
    this.open = state
    console.log('called set oopn: ' + state)
    if (!state) {
      setTimeout(async () => {
        const id = this.editorNode.id
        this.setEditorNode({})
        evidenceEditor.setOpen(false)
        if (id) {
          await project.deSelectNode(id)
        }
      }, 100)
    }
  }

  setOnChange(onChange) {
    this.onChange = onChange
  }

  //API FUNCTIONS
}

const nodeEditor = new NodeEditor()

export default nodeEditor
