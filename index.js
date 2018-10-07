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

Taskit.prototype.saveGroup = saveGroup
Taskit.prototype.loadGroup = loadGroup
Taskit.prototype.deleteGroup = deleteGroup

Taskit.prototype.saveSchedule = saveSchedule
Taskit.prototype.loadSchedule = loadSchedule
Taskit.prototype.deleteSchedule = deleteSchedule

module.exports = Taskit


/**
 * Constants
 */
var DEFAULT_ROOT_ID = 'root'

var LABEL_GROUP = 'GroupModel'
var LABEL_SCHEDULE = 'ScheduleModel'
var LABEL_STAFF = 'StaffModel'
var LABEL_REQUIREMENT = 'RequirementModel'
var LABEL_ROLE = 'RoleModel'
var LABEL_SETTING = 'SettingModel'
var LABEL_ARRANGEMENT = 'ArrangementModel'
var LABEL_AVAILABILITY = 'AvailabilityModel'


/**
 * Implementations
 */
function saveGroup(groupInfo) {
  if (!groupInfo || !groupInfo.name) {
    return new Promise(function (_, rej) { rej(MSG_ERR_PARAM.replace('{obj}', 'groupInfo')) })
  }

  return axios({
    method: 'POST',
    url: `/tobject/${DEFAULT_ROOT_ID}/`,
    headers: { key: this.appKey },
    data: {
      children: [{
        labels: [ LABEL_GROUP ],
        properties: { name: groupInfo.name },
      }],
    },
  })
}

function loadGroup() {
  return axios({
    method: 'GET',
    url: `/tobject/${DEFAULT_ROOT_ID}/`,
    headers: { key: this.appKey },
    data: '{}',
  })
}

function deleteGroup(deleteTargets) {
  if (!Array.isArray(deleteTargets) || deleteTargets.length === 0) {
    return new Promise(function (_, rej) { rej(MSG_ERR_PARAM.replace('{obj}', 'deleteTargets')) })
  }

  return axios({
    method: 'DELETE',
    url: `/tobject/${DEFAULT_ROOT_ID}/`,
    headers: { key: this.appKey },
    data: {
      oid_list: deleteTargets,
    },
  })
}

function saveSchedule(scheduleInfo, groupId = null, groupKey = null) {}

function loadSchedule(groupId, groupKey) {}

function deleteSchedule(groupId, groupKey) {}
