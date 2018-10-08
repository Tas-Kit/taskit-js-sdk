var axios = require('axios').create({
  baseURL: 'http://sandbox.tas-kit.com/api/v1/platform/',
})

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

var MSG_ERR_IDENTIFIER = 'Passed `oid`/`key` was invalid.'
var MSG_ERR_PARAM = 'Passed `{obj}` was invalid.'

function Taskit(appId, appKey) {
  if (!appId || !appKey) {
    throw new Error(MSG_ERR_IDENTIFIER)
  }
  this.appId = appId
  this.appKey = appKey
}

Taskit.prototype.createNode = function (props, oid, key) {
  var isInvalid = false
  var errMsgs = []

  if (!oid || !key) {
    isInvalid = true
    errMsgs.push(MSG_ERR_IDENTIFIER)
  }

  if ( !props || !props.name
    || !Array.isArray(props.labels) || props.labels.length === 0
  ) {
    isInvalid = true
    errMsgs.push(MSG_ERR_PARAM.replace('{obj}', 'props'))
  }

  if (isInvalid) {
    return new Promise(function (_, rej) { rej(errMsgs.join(' ')) })
  }

  return axios({
    method: 'POST',
    url: `/tobject/${oid}/`,
    headers: { key: key },
    data: {
      children: [{
        labels: props.labels,
        properties: { name: props.name },
      }],
    },
  })
}

Taskit.prototype.fetchNodes = function (oid, key) {
  var isInvalid = false
  var errMsgs = []

  if (!oid || !key) {
    isInvalid = true
    errMsgs.push(MSG_ERR_IDENTIFIER)
  }

  if (isInvalid) {
    return new Promise(function (_, rej) { rej(errMsgs.join(' ')) })
  }

  return axios({
    method: 'GET',
    url: `/tobject/${oid}/`,
    headers: { key: key },
    data: '{}',
  })
}

Taskit.prototype.deleteNodes = function (targets, oid, key) {
  var isInvalid = false
  var errMsgs = []

  if (!oid || !key) {
    isInvalid = true
    errMsgs.push(MSG_ERR_IDENTIFIER)
  }

  if (!Array.isArray(targets) || targets.length === 0) {
    isInvalid = true
    errMsgs.push(MSG_ERR_PARAM.replace('{obj}', 'targets'))
  }

  if (isInvalid) {
    return new Promise(function (_, rej) { rej(errMsgs.join(' ')) })
  }

  return axios({
    method: 'DELETE',
    url: `/tobject/${oid}/`,
    headers: { key: key },
    data: {
      oid_list: targets,
    },
  })
}

module.exports = Taskit
