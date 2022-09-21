const calculateStatistics = require('./calculateStatistics')

function calculateCorrelations(snapshots) {
  let correlations = []
  for (let i = 0; i < snapshots.length; i++) {
    let snapshot1 = snapshots[i]
    for (let ii = i + 1; ii < snapshots.length; ii++) {
      let snapshot2 = snapshots[ii]
      if (snapshot1.data?.length && snapshot2.data?.length) {
        correlations.push(
          calculateCorrelation(
            Object.assign({}, snapshot1),
            Object.assign({}, snapshot2)
          )
        )
      }
    }
  }
  return correlations
}

function cleanSnapshots(snapshot1, snapshot2) {
  // statistics
  const stats1 = calculateStatistics(snapshot1.data)
  const stats2 = calculateStatistics(snapshot2.data)
  // sort data
  let data1 = snapshot1.data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  let data2 = snapshot2.data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  let data = {}
  for (let i = 0; i < data1.length; i++) {
    const d = data1[i]
    data[d.date] = {}
    data[d.date].value1 = d.value / stats1.max
  }
  for (let i = 0; i < data2.length; i++) {
    const d = data2[i]
    if (!data[d.date]) {
      data[d.date] = {}
    }
    data[d.date].value2 = d.value / stats2.max
  }
  let dates = Object.keys(data).filter(
    (date) =>
      data[date]['value1'] !== undefined && data[date]['value2'] !== undefined
  )
  snapshot1.data = dates.map((date) => ({
    date: date,
    value: data[date]['value1'],
  }))
  snapshot2.data = dates.map((date) => ({
    date: date,
    value: data[date]['value2'],
  }))
  return [snapshot1, snapshot2]
}

function calculateCorrelation(snapshot1, snapshot2) {
  const cleaned = cleanSnapshots(snapshot1, snapshot2)
  snapshot1 = cleaned[0]
  snapshot2 = cleaned[1]
  // snapshot 1
  const data1 = snapshot1.data
  const values1 = data1.map((d) => {
    return d.value
  })
  const values1Sum = values1.reduce((x, y) => {
    return x + y
  }, 0)
  const avg1 = values1Sum / values1.length
  const sd1 = calculateSd(values1, avg1)

  // snapshot 2
  const data2 = snapshot2.data
  const values2 = data2.map((d) => {
    return d.value
  })
  const values2Sum = values2.reduce((x, y) => {
    return x + y
  }, 0)
  const avg2 = values2Sum / values2.length
  const sd2 = calculateSd(values2, avg2)

  // R
  let sum = 0
  for (let i = 0; i < values1.length; i++) {
    const value1 = values1[i]
    const value2 = values2[i]
    sum += (value1 - avg1) * (value2 - avg2)
  }
  const div = sum / (sd1 * sd2)
  const result = div / (values1.length - 1)
  return {
    snapshot1: snapshot1,
    snapshot2: snapshot2,
    correlation: result,
  }
}

function calculateSd(values, avg) {
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    const diff = value - avg
    sum += diff * diff
  }
  const sd = Math.sqrt(sum / (values.length - 1))
  return sd
}

module.exports = calculateCorrelations
