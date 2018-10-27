var win = (
  (typeof self === 'object' && self.self === self && self) ||
  (typeof global === 'object' && global.global === global && global) ||
  this
)

var axios = require('axios').create({
  baseURL: (win.location && win.location.origin && win.location.origin.indexOf('localhost') === -1
    ? win.location.origin + '/api/v1/taskservice/'
    : 'http://sandbox.tas-kit.com/api/v1/taskservice/'
  )
})

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function ComponentModel(app, oid, cmp){
    this.app = app;
    this.oid = oid;
    this.cmp = cmp;
}

function StepModel(sid, props){
    this.sid = sid;
    this.props = props;
}

StepModel.prototype.serialize = function(){
    return this.props;
}

StepModel.buildSteps = function(nodes){
    var steps = {};
    for (var i = 0; i < nodes.length; i++){
        var step = nodes[i];
        steps[step.sid] = new StepModel(step.sid, step);
    }
    return steps;
}

function TaskGraph(taskModel, steps, edges){
    this.taskModel = taskModel;
    this.steps = steps;
    this.edges = edges;
}

TaskGraph.prototype.getComponents = function(stepModel){
    return axios({
        method: 'GET',
        url: 'task/' + this.taskModel.tid + '/' + stepModel.sid + '/component/',
        withCredentials: true
    }).then(function(response){
        return response.data.components;
    })
}

TaskGraph.prototype.deleteComponents = function(stepModel, oid_list){
    return axios({
        method: 'DELETE',
        url: 'task/' + this.taskModel.tid + '/' + stepModel.sid + '/component/',
        withCredentials: true,
        data: {
            oid_list: oid_list
        }
    }).then(function(response){
        return response.data.components;
    })
}

TaskGraph.prototype.addComponents = function(stepModel, components){
    return axios({
        method: 'POST',
        url: 'task/' + this.taskModel.tid + '/' + stepModel.sid + '/component/',
        withCredentials: true,
        data: {
            components: components
        }
    }).then(function(response){
      response.data.components
    });
}

TaskGraph.prototype.connect = function(fromStep, toStep, label){
    this.edges.push({
        to: toStep.sid,
        from: fromStep.sid,
        label: label
    });
}

TaskGraph.prototype.deleteStep = function(stepModel){
    var sid = stepModel.sid;
    delete this.steps[sid];
    for( var i = this.edges.length - 1; i >= 0; i--){
        var edge = this.edges[i];
        if (edge.from === sid || edge.to === sid) {
            this.edges.splice(i, 1);
        }
    }
}

TaskGraph.prototype.addStep = function(step){
    var sid = guidGenerator();
    step.sid = sid;
    var stepModel = new StepModel(sid, step);
    this.steps[sid] = stepModel;
    return stepModel;
}

TaskGraph.prototype.serialize = function(){
    var data = {};
    data.task_info = this.taskModel.task;
    data.nodes = [];
    for (var key in this.steps){
        var stepModel = this.steps[key];
        data.nodes.push(stepModel.serialize())
    }
    data.edges = this.edges;
    return data;
}

TaskGraph.prototype.save = function(){
    var data = this.serialize();
    return axios({
        method: 'PATCH',
        url: 'task/graph/' + this.taskModel.tid + '/',
        withCredentials: true,
        data: data
    }).then(function(response){
        return TaskGraph.buildTaskGraph(response.data);
    });
}

TaskGraph.buildTaskGraph = function(data){
    var task = data.task_info;
    var taskModel = new TaskModel(task.tid, task, data.users[0].has_task);
    var taskGraph = new TaskGraph(taskModel, StepModel.buildSteps(data.nodes), data.edges);
    return taskGraph;
}

function TaskModel(tid, task, has_task){
    this.tid = tid;
    this.task = task;
    this.has_task = has_task;
}

TaskModel.prototype.trigger = function(){
    var that = this;
    return axios({
        method: 'POST',
        url: 'task/trigger/' + that.tid + '/',
        withCredentials: true,
    }).then(function(response){
        return TaskGraph.buildTaskGraph(response.data);
    });
}

TaskModel.prototype.invite = function(username){
    var that = this;
    return axios({
        method: 'POST',
        url: 'task/invitation/' + that.tid + '/',
        withCredentials: true,
        data: {
            username: username
        }
    }).then(function(response){
      return response.data;
    })
}

TaskModel.prototype.revoke_invitation = function(uid){
    var that = this;
    return axios({
        method: 'POST',
        url: 'task/invitation/revoke/' + that.tid + '/',
        withCredentials: true,
        data: {
            uid: uid
        }
    }).then(function(response){
        return response.data;
    })
}

TaskModel.createTask = function(task_info){
    return axios({
        method: 'POST',
        url: 'task/',
        data: task_info,
        withCredentials: true
    }).then(function(response){
        return TaskGraph.buildTaskGraph(response.data);
    });
}

TaskModel.prototype.getGraph = function(){
    var that = this;
    return axios({
        method: 'GET',
        url: 'task/graph/' + this.tid + '/',
        withCredentials: true
    }).then(function(response) {
        var taskGraph = new TaskGraph(that, StepModel.buildSteps(response.data.nodes), response.data.edges);
        return taskGraph;
    });
}

TaskGraph.getTask = function(tid){
    return axios({
        method: 'GET',
        url: 'task/' + tid + '/',
        withCredentials: true,
    }).then(function(response){
        return new TaskModel(tid, response.data, {});
    });
}

TaskGraph.getAllTasks = function(){
    return axios({
        method: 'GET',
        url: 'task/',
        withCredentials: true,
    }).then(function(response) {
        var result = {};
        for (var tid in response.data){
            var taskData = response.data[tid];
            result[tid] = new TaskModel(tid, taskData.task, taskData.has_task);
        }
        return result;
    });
}

module.exports = TaskModel
