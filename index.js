const axios = require('axios').create({
  baseURL: 'http://sandbox.tas-kit.com/api/v1/platform/',
})

function Taskit(appId, appKey) {
  this.appId = appId
  this.appKey = appKey
  this.defaultRootKey = 'root'
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
const LABEL_GROUP = 'GroupModel'
const LABEL_SCHEDULE = 'ScheduleModel'
const LABEL_STAFF = 'StaffModel'
const LABEL_REQUIREMENT = 'RequirementModel'
const LABEL_ROLE = 'RoleModel'
const LABEL_SETTING = 'SettingModel'
const LABEL_ARRANGEMENT = 'ArrangementModel'
const LABEL_AVAILABILITY = 'AvailabilityModel'


/**
 * Implementation
 */
function saveGroup(groupInfo, groupId = null, groupKey = null) {
  const data = {
    children: [{
      labels: [ LABEL_GROUP ],
      properties: groupInfo,
    }],
  }

  if (groupId && groupKey) {
    // Update Group
    return axios.post(`/tobject/${groupId}`, {
      headers: { key: groupKey },
      data,
    })
  }

  // Create Group
  return axios.post(`/tobject/${this.defaultRootKey}`, {
    headers: { key: this.appKey },
    data,
  })
}

function loadGroup(groupId, groupKey) {}

function deleteGroup(groupId, groupKey) {}

function saveSchedule(scheduleInfo, scheduleId = null, scheduleKey = null) {}

function loadSchedule(scheduleId, scheduleKey) {}

function deleteSchedule(scheduleId, scheduleKey) {}
