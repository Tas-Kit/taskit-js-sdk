// const config = require('./credentials.json')
const { TObject: MiniApp } = require('../index')

const axios = require('axios').create({
  baseURL: 'http://sandbox.tas-kit.com/api/v1/platform/',
})

axios.defaults.headers.common['Cookie'] = `JWT=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMDA0NWY2YTAtZmIxOS00MGEwLTg2NTAtMWJmMzM4MTFjMTI3IiwidXNlcm5hbWUiOiJyb290IiwiZXhwIjoxNTQwNDE4MjIzLCJlbWFpbCI6InpoZW55YW5nemhvbmcxOTk1QGdtYWlsLmNvbSIsIm9yaWdfaWF0IjoxNTQwMzMxODIzfQ.HLHQ8XmoN3r4Hi9XMN1FkyEvigBFiF6Kcpia7ScMWDRNLvlJpzvrMGy3_G0XISpgV_vX8OwPJIBw67HWv-h0P0H9TV0oISP0LOE3YDIZV72aV_e8wWTqOaQJV035P_E3BY9fQBIRCRB9zWgI-VaGWhbbxxC2FcHoR4mzWGLmwWqodB4TV-m9rYdFxiei9w5B7OIWsMcxPNZcPVQt6620xvJSpHxY-JBBNmd_YisVTb4sMY-tIZ1CISNM4Uomz0pL3zlWo3S12Ta6CjwTok2ZqH2CCJF8I-Mx29EMUu7xJ6TSlSYsvKVwrqrLZUC9zjoZL0RpeVYpdo48Eqy9ag66BXZ3gsD3a-KY8h5CQLRd6w89r1jsgHDnF0qfQfZanRLgv3zW_IukTguaNRxxHlyOBMG2VZ59oRcpqqm2knHz0XIxeA4ERlHalBrUYgDwNOSZt7Jo_0TTszv0ogeHOOkV4PoOqOI4GSg0GfJau40ivJWg8jvIwiRpd3shSiijhiPIwXCWQ6eh5OkYvhqN2uG2JuFpWbdnHPoFEQr_CbTOqfuIJCeBY31zzpaNY_O7F1UC254e1BSsEmGQG17WH40yUDCyAWIpeDuIeAiGJ6TIoYjOkrXuNDrR95xT5C0KEjYDQGNw6hN8djyTSGLA0RTfhD9ekzi4PqmLyt0KVD0nGiQ`

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
            service: new MiniApp(data.mini_app.aid,
                                 data.mini_app.key,
                                 {
                                    transformParams: {
                                      addChildren: function (labels, properties) {
                                        return [{ labels, properties }]
                                      }
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

    // Fetch all children nodes
    app.getChildren().then(tobjs => tobjs[0].getChildren()).then(tobjs => {
      console.log(JSON.stringify(tobjs, null, 4));
      // tobjs[0].getChildren().then(tobjs => {
      //   console.log(JSON.stringify(tobjs, null, 4));
      // })
      tobjs[0].changePermission('0045f6a0-fb19-40a0-8650-1bf33811c127', '6d8b2126-a77d-4afd-b875-46ecbd7dec08', -1).catch(err => console.log(err))
    }).catch(err => console.log(err))

    // app.replaceChildren(['GroupModel'], { name: 'TransformedGroup' });

    // app.getChildren().then(tobjs => console.log(tobjs)).catch(err => console.log(err))

    // // Add child node
    // app.addChildren(['GroupModel'], { name: 'TransformedGroup' })
      // .then(tobjs => tobjs[0].addChildren(['ScheduleModel'], { name: 'TransformedSchedule' }))
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
