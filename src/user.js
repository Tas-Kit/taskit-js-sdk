var MSG_ERR_IDENTIFIER = 'Passed `oid`/`key` was invalid.'
var MSG_ERR_PARAM = 'Passed params was invalid.'

var win = (
  (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this
)

var axios = require('axios').create({
  baseURL: (win.location && win.location.origin && win.location.origin.indexOf('localhost') === -1
    ? win.location.origin + '/api/v1/userservice/'
    : 'http://sandbox.tas-kit.com/api/v1/userservice/'
  ),
})

function Userservice(){

}

Userservice.getCurrentUser = function(){
    return axios({
      method: 'GET',
      url: '/userinfo/',
      withCredentials: true,
    }).then(function (response) {
      return response.data;
    })
}

module.exports = Userservice;
