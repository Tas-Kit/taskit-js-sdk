var MSG_ERR_IDENTIFIER = 'Passed `oid`/`key` was invalid.'
var MSG_ERR_PARAM = 'Passed params was invalid.'

var axios = require('axios').create({
  baseURL: 'http://sandbox.tas-kit.com/api/v1/platform/',
})

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

function MiniApp(appId, appKey) {
  this.appId = appId
  this.appKey = appKey

  TObject.call(this, { oid: 'root', key: appKey })

  for (var method in TObject.prototype) {
    if (!MiniApp.prototype.hasOwnProperty(method)) {
      MiniApp.prototype[method] = TObject.prototype[method]
    }
  }
}

function TObject(nodeInfo) {
  if (!nodeInfo || !nodeInfo.oid || !nodeInfo.key) {
    throw new Error(MSG_ERR_IDENTIFIER)
  }

  this.oid = nodeInfo.oid
  this.key = nodeInfo.key
}

TObject.prototype.getChildren = function () {
  return axios({
    method: 'GET',
    url: '/tobject/' + this.oid + '/',
    headers: { key: this.key },
    data: '{}',
  }).then(function (response) {
    return Object.keys(response.data.result).map(function (oid) {
      return new TObject(response.data.result[oid])
    })
  })
}

TObject.prototype.addChildren = function (props) {
  if (!Array.isArray(props)) {
    return new Promise(function (_, rej) { rej(MSG_ERR_PARAM) })
  }

  return axios({
    method: 'POST',
    url: '/tobject/' + this.oid + '/',
    headers: { key: this.key },
    data: { children: props },
  }).then(function (response) {
    return Object.keys(response.data.result).map(function (oid) {
      return new TObject(response.data.result[oid])
    })
  })
}

TObject.prototype.removeChildren = function (childIds) {
  if (!Array.isArray(childIds)) {
    return new Promise(function (_, rej) { rej(MSG_ERR_PARAM) })
  }

  return axios({
    method: 'DELETE',
    url: '/tobject/' + this.oid + '/',
    headers: { key: this.key },
    data: { oid_list: childIds },
  })
}

module.exports = MiniApp
