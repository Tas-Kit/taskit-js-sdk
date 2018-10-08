const config = require('./credentials.json')
const Taskit = require('./index')

const axios = require('axios').create({
  baseURL: 'http://sandbox.tas-kit.com/api/v1/platform/',
})

axios.defaults.headers.common['Cookie'] = `JWT=${config.JWT}`

function TestTaskit() {
  axios.get('/internal/').then(({ data }) => {
    this.platformRootKey = data.platform_root_key
    return this.getApps()
  }).then(({ data }) => {
    var promises = []
    this.miniApps = {}
    data.mini_apps.forEach(info => {
      promises.push(
        this.getAppInfo(info.aid).then(({ data }) => {
          this.miniApps[info.aid] = {
            ...data.mini_app,
            service: new Taskit(data.mini_app.aid, data.mini_app.key),
          }
        })
      )
    })
    return Promise.all(promises)
  }).then(_ => {
    // // Test API here, e.g.,
    // const aid = Object.keys(this.miniApps)[0]

    // // Create Group
    // return this.miniApps[aid].service.createNode({
    //   name: 'FirstGroup',
    //   labels: ['GroupModel'],
    // }, 'root', this.miniApps[aid].key).then(({ data }) => {
    //   console.log(data)
    //   return data
    // })

    // // Fetch all groups
    // return this.miniApps[aid].service.fetchNodes('root', this.miniApps[aid].key).then(({ data }) => {
    //   console.log(data)
    //   return data
    // })

    // // Fetch and delete all groups
    // return this.miniApps[aid].service.fetchNodes('root', this.miniApps[aid].key).then(({ data }) => {
    //   return this.miniApps[aid].service.deleteNodes(Object.keys(data.result), 'root', this.miniApps[aid].key)
    // })
  }).catch(error => {
    console.error(error)
  })
}

TestTaskit.prototype.getApps = function () {
  return axios.get('/miniapp/', { headers: { PlatformRootKey: this.platformRootKey } })
}

TestTaskit.prototype.getAppInfo = function (aid) {
  return axios.get(`/miniapp/${aid}/`, { headers: { PlatformRootKey: this.platformRootKey } })
}

module.exports = (new TestTaskit)
