import { makeAutoObservable } from 'mobx'
import axios from 'axios'

class Projects {
  projects = []

  constructor() {
    makeAutoObservable(this)
  }

  getProjects() {
    return this.projects
  }

  findProject(id) {
    return this.projects.find((project) => project.id === id)
  }

  setProjects(projects) {
    this.projects = projects
  }

  // STATE FUNCTIONS
  addProject(project) {
    this.setProjects([...this.projects, project])
  }
  removeProjects(ids) {
    this.setProjects(
      this.projects.filter((project) => !ids.includes(project.id))
    )
  }
  editProject(newData, id) {
    const projectIndex = this.projects.findIndex((obj) => obj.id === id)
    for (let i = 0; i < Object.keys(newData).length; i++) {
      const key = Object.keys(newData)[i]
      this.projects[projectIndex][key] = newData[key]
    }
  }

  // API FUNCTIONS
  async updateProject(body, id) {
    try {
      const response = await axios.put('/projects/' + id, body)
      if (response.status === 200) {
        this.editProject(response.data, id)
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async fetchProjects() {
    try {
      const response = await axios('/projects')
      this.setProjects(response.data)
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async createProject(project) {
    try {
      const response = await axios.post('/projects', {
        ...project,
      })
      this.addProject(response.data)
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteProject(id) {
    try {
      const response = await axios.delete('/projects/' + id)
      if (response.status === 204) {
        this.removeProjects([id])
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }

  // ONLOAD
  async loadProjects() {
    await this.fetchProjects()
  }
}

const projects = new Projects()

export default projects
