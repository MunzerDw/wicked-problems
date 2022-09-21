import { makeAutoObservable } from 'mobx'

// Model the application state.
class ProjectEditor {
  editorProject = {}
  open = false

  constructor() {
    makeAutoObservable(this)
  }

  getEditorProject() {
    return this.editorProject
  }

  setEditorProject(editorProject) {
    this.editorProject = Object.assign({}, { ...editorProject })
  }

  setOpen(state) {
    this.open = state
    if (!state) {
      setTimeout(() => {
        this.setEditorProject({})
      }, 200)
    }
  }

  //API FUNCTIONS
}

const projectEditor = new ProjectEditor()

export default projectEditor
