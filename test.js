const config = require('./credentials.json')
const { TObject: MiniApp } = require('./index')

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
            service: new MiniApp(data.mini_app.aid, data.mini_app.key, {
              transformParams: {
                addChildren: function (labels, properties) {
                  return [{ labels, properties }]
                },
              },
            }),
          }
        })
      )
    })
    return Promise.all(promises)
  }).then(_ => {
    // // Test API here, e.g.,
    const aid = Object.keys(this.miniApps)[0]
    const app = this.miniApps[aid].service
    // console.log(this.platformRootKey)
    // console.log(JSON.stringify(this.miniApps, null, 4))

    // // Fetch all children nodes
    // app.getChildren().then(tobjs => tobjs[0].getChildren()).then(tobjs => console.log(JSON.stringify(tobjs, null, 4)))

    // // Add child node
    // app.addChildren(['GroupModel'], { name: 'TransformedGroup' })
    //   .then(tobjs => tobjs[0].addChildren(['ScheduleModel'], { name: 'TransformedSchedule' }))
    //   .then(tobjs => console.log(tobjs))

    // // Delete children nodes
    // app.getChildren().then(tobjs => app.removeChildren(tobjs.map(tobj => tobj.oid))).then(data => console.log(data))
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
