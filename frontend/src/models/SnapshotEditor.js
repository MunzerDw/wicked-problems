import { makeAutoObservable } from 'mobx'

// Model the application state.
class SnapshotEditor {
  editorSnapshot = {}
  open = false

  constructor() {
    makeAutoObservable(this)
  }

  getEditorSnapshot() {
    return this.editorSnapshot
  }

  setEditorSnapshot(editorSnapshot) {
    this.editorSnapshot = Object.assign({}, { ...editorSnapshot })
  }

  async setOpen(state) {
    this.open = state
    if (!state) {
      this.setEditorSnapshot({})
    }
  }
}

const snapshotEditor = new SnapshotEditor()

export default snapshotEditor
