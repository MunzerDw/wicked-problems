import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import project from './Project'

// Model the application state.
class Settings {
  labels = []
  open = false
  editorLabel = {}

  constructor() {
    makeAutoObservable(this)
  }

  getEditorLabel() {
    return this.editorLabel
  }

  getLabels() {
    return this.labels
  }

  setLabels(labels) {
    this.labels = labels
  }

  setEditorLabel(editorLabel) {
    this.editorLabel = editorLabel
  }

  setOpen(state) {
    this.open = state
    if (!state) {
      this.editorLabel = {}
    }
  }

  // STATE FUNCTIONS
  addLabel(label) {
    this.labels = [...this.labels, label]
  }
  editLabel(newData, id) {
    const labelIndex = this.labels.findIndex((obj) => obj.id === id)
    for (let i = 0; i < Object.keys(newData).length; i++) {
      const key = Object.keys(newData)[i]
      this.labels[labelIndex][key] = newData[key]
    }
  }
  removeLabel(id) {
    this.setLabels(this.labels.filter((label) => id !== label.id))
  }
  findLabel(id) {
    return this.labels.find((label) => label.id === id)
  }

  //API FUNCTIONS
  async fetchLabels(name) {
    try {
      const response = await axios('/labels?urlSafeName=' + name)
      this.setLabels(response.data)
      return response.data
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async createLabel(label) {
    try {
      const response = await axios.post('/labels', {
        ...label,
        projectId: project.project?.id,
      })
      this.addLabel(response.data)
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async updateLabel(body, id) {
    try {
      const response = await axios.put(
        '/labels/' + (id || this.editorLabel.id),
        body
      )
      if (response.status === 200) {
        this.editLabel(response.data, id || this.editorLabel.id)
        project.updateLabels(response.data, id || this.editorLabel.id)
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteLabel(id) {
    try {
      const response = await axios.delete('/labels/' + id)
      if (response.status === 204) {
        this.removeLabel(id)
        project.deleteLabels(id || this.editorLabel.id)
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }

  // ONLOAD
  async loadLabels(name) {
    await this.fetchLabels(name)
  }
}

const settings = new Settings()

export default settings
