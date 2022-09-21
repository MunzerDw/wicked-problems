import { makeAutoObservable } from 'mobx'
import axios from 'axios'
import project from './Project'
import moment from 'moment'

// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
function uniq_fast(a) {
  var seen = {}
  var out = []
  var len = a.length
  var j = 0
  for (var i = 0; i < len; i++) {
    var item = a[i]
    if (seen[item] !== 1) {
      seen[item] = 1
      out[j++] = item
    }
  }
  return out
}

// Model the application state.
class Snapshots {
  snapshots = []
  view = 'list'
  dates = []
  filteredSnapshots = []
  filteredLabels = []
  timelineOpen = false
  correlationsOpen = false
  correlations = []
  correlationsLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  getView() {
    return this.view
  }

  getDatGroups() {
    return this.snapshots
  }

  setTimelineOpen(state) {
    this.timelineOpen = state
  }

  setCorrelationsOpen(state) {
    this.correlationsOpen = state
  }

  setFilteredSnapshots(filteredSnapshots) {
    this.filteredSnapshots = filteredSnapshots
  }

  setFilteredLabels(filteredLabels) {
    this.filteredLabels = filteredLabels
  }

  setView(view) {
    this.view = view
  }

  setSnapshots(snapshots) {
    this.snapshots = snapshots
  }

  findSnapshot(id) {
    return this.snapshots.find((snapshot) => snapshot.id === id)
  }

  getFilteredActions() {
    const labelIds = this.filteredLabels.map((label) => label?.id || null)
    return project
      .getNodes()
      ?.filter(
        (node) =>
          node.data.type === 'ACTION' &&
          node.data.doneAt &&
          labelIds.includes(node.data.labelId)
      )
  }

  // STATE FUNCTIONS
  addSnapshot(snapshot) {
    this.snapshots = [...this.snapshots, snapshot]
  }
  editSnapshot(newData, id) {
    const snapshotIndex = this.snapshots.findIndex((obj) => obj.id === id)
    for (let i = 0; i < Object.keys(newData).length; i++) {
      const key = Object.keys(newData)[i]
      this.snapshots[snapshotIndex][key] = newData[key]
    }
  }
  addSnapshotData(newData, id) {
    const snapshotIndex = this.snapshots.findIndex((obj) => obj.id === id)
    if (this.snapshots[snapshotIndex]['data']) {
      this.snapshots[snapshotIndex]['data'] = [
        ...this.snapshots[snapshotIndex]['data'],
        ...newData,
      ]
    } else {
      this.snapshots[snapshotIndex]['data'] = [...newData]
    }
  }
  removeSnapshot(id) {
    this.setSnapshots(this.snapshots.filter((snapshot) => id !== snapshot.id))
  }

  // API FUNCTIONS
  async fetchSnapshots(name) {
    try {
      if (!name) return
      const response = await axios('/snapshots?urlSafeName=' + name)
      this.setSnapshots(response.data)

      const actions = project
        .getNodes()
        ?.filter((node) => node.data.type === 'ACTION' && node.data.doneAt)
      const data = [].concat.apply(
        [],
        response.data?.map((obj) => obj.data)
      )
      let dates = [
        ...new Set([
          ...data.map(
            (obj) => new Date(new Date(obj.date).setHours(0, 0, 0, 0))
          ),
          ...actions.map(
            (action) =>
              new Date(new Date(action.data.doneAt).setHours(0, 0, 0, 0))
          ),
        ]),
      ]
        ?.slice()
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      dates = uniq_fast(dates)
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i]
        const nextDate = dates[i + 1]
        if (nextDate) {
          if (moment(nextDate).diff(moment(date), 'days') > 1) {
            dates.splice(i + 1, 0, moment(date).add(1, 'days').toDate())
          }
        }
      }
      this.dates = dates
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async createSnapshot(snapshot) {
    try {
      const response = await axios.post('/snapshots', {
        ...snapshot,
        projectId: project.project?.id,
      })
      this.addSnapshot(response.data)
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteSnapshot(id) {
    try {
      const response = await axios.delete('/snapshots/' + id)
      if (response.status === 204) {
        this.removeSnapshot(id)
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async deleteSnapshotData(id) {
    try {
      const response = await axios.delete('/snapshots/' + id + '/data')
      if (response.status === 204) {
        this.editSnapshot({ data: [] }, id)
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async updateSnapshot(body, id) {
    try {
      const response = await axios.put('/snapshots/' + id, body)
      if (response.status === 200) {
        this.editSnapshot(response.data, id)
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async calculateStatistics(id) {
    try {
      const response = await axios.post('/snapshots/calculatestatistics/' + id)
      if (response.status === 200) {
        this.editSnapshot(response.data, id)
        return response.data
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
  async calculateCorrelations(name) {
    try {
      if (!this.correlations.length) this.correlationsLoading = true
      const response = await axios.post(
        '/snapshots/calculatecorrelations?urlSafeName=' + name
      )
      if (response.status === 200) {
        const correlations = response.data.sort((a, b) =>
          Math.abs(a.correlation) > Math.abs(b.correlation) ? -1 : 1
        )
        this.correlations = correlations
        return correlations
      } else {
        alert(response.status)
      }
    } catch (error) {
      alert(error.response?.data?.message)
    } finally {
      this.correlationsLoading = false
    }
  }

  // ONLOAD
  async loadSnapshots(name) {
    await this.fetchSnapshots(name)
  }
}

const snapshots = new Snapshots()

export default snapshots
