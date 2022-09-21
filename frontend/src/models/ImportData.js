import { makeAutoObservable } from 'mobx'
import snapshots from 'models/Snapshots'
import axios from 'axios'

// Model the application state.
class ImportData {
  snapshotId = ''
  file = ''
  dateFormat = ''
  dateColumn = ''
  valueColumn = ''
  separator = ''
  text = ''
  open = false
  useFile = true

  constructor() {
    makeAutoObservable(this)
  }

  setUseFile(state) {
    this.useFile = state
  }

  setSnapshotId(id) {
    this.snapshotId = id
  }

  setSeparator(separator) {
    this.separator = separator
  }

  setFile(file) {
    this.file = file
  }

  setText(text) {
    this.text = text
  }

  setDateColumn(name) {
    this.dateColumn = name
  }

  setValueColumn(name) {
    this.valueColumn = name
  }

  setDateFormat(dateFormat) {
    this.dateFormat = dateFormat
  }

  setOpen(state) {
    this.open = state
    if (!state) {
      this.file = ''
      this.dateFormat = ''
      this.snapshotId = ''
      this.dateColumn = ''
      this.valueColumn = ''
      this.separator = ''
    }
  }

  //API FUNCTIONS
  async uploadData() {
    try {
      const upload = {
        dateColumn: this.dateColumn,
        valueColumn: this.valueColumn,
        file: this.useFile ? this.file : null,
        dateFormat: this.dateFormat,
        separator: this.separator,
        text: this.useFile ? '' : this.text,
      }
      const data = new FormData()
      const keys = Object.keys(upload)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        data.append(key, upload[key])
      }
      const response = await axios.post(
        '/snapshots/' + this.snapshotId + '/data',
        data
      )
      snapshots.addSnapshotData(response.data, this.snapshotId)
      return response.data
    } catch (error) {
      alert(error.response?.data?.message)
    }
  }
}

const importData = new ImportData()

export default importData
