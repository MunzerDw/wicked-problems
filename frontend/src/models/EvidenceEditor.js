import { makeAutoObservable } from 'mobx'

// Model the application state.
class EvidenceEditor {
  editorEvidence = {}
  open = false

  constructor() {
    makeAutoObservable(this)
  }

  getEditorEvidence() {
    return this.editorEvidence
  }

  setEditorEvidence(editorEvidence) {
    this.editorEvidence = Object.assign({}, { ...editorEvidence })
  }

  setOpen(state) {
    this.open = state
    if (!state) {
      setTimeout(() => {
        this.setEditorEvidence({})
      }, 200)
    }
  }

  //API FUNCTIONS
}

const evidenceEditor = new EvidenceEditor()

export default evidenceEditor
