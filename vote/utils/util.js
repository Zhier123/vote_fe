const formatTime_date = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')}`
}
const formatTime_time = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[hour, minute].map(formatNumber).join(':')}`
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const deepClone = function(initalObj) {
  var obj = {};
  obj = JSON.parse(JSON.stringify(initalObj));
  return obj;
}

module.exports = {
  formatTime_date,
  formatTime_time,
  deepClone
}
