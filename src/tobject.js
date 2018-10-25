var MSG_ERR_IDENTIFIER = 'Passed `oid`/`key` was invalid.'
var MSG_ERR_PARAM = 'Passed params was invalid.'

var win = (
  (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this
)

var axios = require('axios').create({
  baseURL: (win.location && win.location.origin && win.location.origin.indexOf('localhost') === -1
    ? win.location.origin + '/api/v1/platform/'
    : 'http://sandbox.tas-kit.com/api/v1/platform/'
  ),
})

axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

function TObject(nodeInfo) {
  if (!nodeInfo || !nodeInfo.oid || !nodeInfo.key) {
    throw new Error(MSG_ERR_IDENTIFIER)
  }

  var key, prop;

  for (key in nodeInfo) {
    if (key === 'properties') {
      for (prop in nodeInfo[key]) {
        this[prop] = nodeInfo[key][prop]
      }
    } else {
      this[key] = nodeInfo[key]
    }
  }
}

TObject.prototype.getChildren = function () {
  return axios({
    method: 'GET',
    url: '/tobject/' + this.oid + '/',
    headers: { key: this.key },
    withCredentials: true,
  }).then(function (response) {
    return Object.keys(response.data.result).map(function (oid) {
      return new TObject(response.data.result[oid])
    })
  })
}

TObject.prototype.addChildren = function (props) {
  if (this.transformParams && this.transformParams.addChildren) {
    props = this.transformParams.addChildren.apply(null, arguments)
  }

  if (!Array.isArray(props)) {
    return Promise.reject({ data: { message: MSG_ERR_PARAM } })
  }

  return axios({
    method: 'POST',
    url: '/tobject/' + this.oid + '/',
    headers: { key: this.key },
    data: { children: props },
    withCredentials: true,
  }).then(function (response) {
    return Object.keys(response.data.result).map(function (oid) {
      return new TObject(response.data.result[oid])
    })
  })
}

TObject.prototype.changePermission = function (target_uid, oid, target_role){
    return axios({
        method: 'PATCH',
        url: '/tobject/' + this.oid + '/',
        headers: { key: this.key },
        data: { target_uid, oid, target_role },
        withCredentials: true
    })
}

TObject.prototype.removeChildren = function (childIds) {
  if (this.transformParams && this.transformParams.removeChildren) {
    childIds = this.transformParams.removeChildren.apply(null, arguments)
  }

  if (!Array.isArray(childIds)) {
    return Promise.reject({ data: { message: MSG_ERR_PARAM } })
  }

  return axios({
    method: 'DELETE',
    url: '/tobject/' + this.oid + '/',
    headers: { key: this.key },
    data: { oid_list: childIds },
    withCredentials: true,
  })
}

function MiniApp(appId, appKey, config) {
  this.appId = appId
  this.appKey = appKey

  if (config && config.transformParams) {
    TObject.prototype.transformParams = Object.assign({
      addChildren: null,
      removeChildren: null,
    }, config.transformParams)
  }

  TObject.call(this, { oid: 'root', key: appKey })

  for (var method in TObject.prototype) {
    if (!MiniApp.prototype.hasOwnProperty(method)) {
      MiniApp.prototype[method] = TObject.prototype[method]
    }
  }
}

module.exports = MiniApp
