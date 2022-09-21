function calculateStatistics(data) {
  let statistics = {}
  data = data.map((d) => d.value)
  console.log(data)
  // calculate
  statistics.max = Math.max(...data)
  statistics.min = Math.min(...data)
  statistics.avg = data.reduce((x, y) => x + y, 0) / data.length
  // round
  statistics.max = Math.round(statistics.max * 100) / 100
  statistics.min = Math.round(statistics.min * 100) / 100
  statistics.avg = Math.round(statistics.avg * 100) / 100
  return statistics
}

module.exports = calculateStatistics
