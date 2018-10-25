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

class ComponentModel{
    constructor(app, oid, cmp){
        this.app = app;
        this.oid = oid;
        this.cmp = cmp;
    }
}

class StepModel{
    constructor(sid, props){
        this.sid = sid;
        this.props = props;
    }

    serialize(){
        return this.props;
    }

    static buildSteps(nodes){
        let steps = {};
        for (let step of nodes){
            steps[step.sid] = new StepModel(step.sid, step);
        }
        return steps;
    }
}

class TaskGraph{
    constructor(taskModel, steps, edges){
        this.taskModel = taskModel;
        this.steps = steps;
        this.edges = edges;
    }

    getComponents(stepModel){
        return axios({
            method: 'GET',
            url: `task/${this.taskModel.tid}/${stepModel.sid}/component/`,
            withCredentials: true
        }).then(function(response){
            return response.data.components;
        })
    }

    deleteComponents(stepModel, oid_list){
        return axios({
            method: 'DELETE',
            url: `task/${this.taskModel.tid}/${stepModel.sid}/component/`,
            withCredentials: true,
            data: {
                oid_list: oid_list
            }
        }).then(function(response){
            return response.data.components;
        })
    }

    addComponents(stepModel, components){
        return axios({
            method: 'POST',
            url: `task/${this.taskModel.tid}/${stepModel.sid}/component/`,
            withCredentials: true,
            data: {
                components: components
            }
        }).then(response => response.data.components);
    }

    connect(fromStep, toStep, label=null){
        this.edges.push({
            to: toStep.sid,
            from: fromStep.sid,
            label: label
        });
    }

    deleteStep(stepModel){
        let sid = stepModel.sid;
        delete this.steps[sid];
        for( var i = this.edges.length - 1; i >= 0; i--){
            let edge = this.edges[i];
            console.log(sid, edge.from, edge.to);
            if (edge.from === sid || edge.to === sid) {
                this.edges.splice(i, 1);
            }
        }
    }

    addStep(step){
        let sid = guidGenerator();
        step.sid = sid;
        let stepModel = new StepModel(sid, step);
        this.steps[sid] = stepModel;
        return stepModel;
    }

    serialize(){
        let data = {};
        data.task_info = this.taskModel.task;
        data.nodes = [];
        for (let stepModel of Object.values(this.steps)){
            data.nodes.push(stepModel.serialize())
        }
        data.edges = this.edges;
        return data;
    }

    save(){
        let data = this.serialize();
        console.log(data);
        return axios({
            method: 'PATCH',
            url: `task/graph/${this.taskModel.tid}/`,
            withCredentials: true,
            data: data
        }).then(function(response){
            return TaskGraph.buildTaskGraph(response.data);
        });
    }

    static buildTaskGraph(data){
        let task = data.task_info;
        let taskModel = new TaskModel(task.tid, task, data.users[0].has_task);
        let taskGraph = new TaskGraph(taskModel, StepModel.buildSteps(data.nodes), data.edges);
        return taskGraph;
    }
}

class TaskModel{
    constructor(tid, task, has_task){
        this.tid = tid;
        this.task = task;
        this.has_task = has_task;
    }

    trigger(step=null){
        let that = this;
        return axios({
            method: 'POST',
            url: `task/trigger/${that.tid}/`,
            withCredentials: true,
        }).then(function(response){
            return TaskGraph.buildTaskGraph(response.data);
        });
    }

    invite(username){
        let that = this;
        return axios({
            method: 'POST',
            url: `task/invitation/${that.tid}/`,
            withCredentials: true,
            data: {
                username: username
            }
        }).then(response => {
          return response.data;
        })
    }

    revoke_invitation(uid){
        let that = this;
        return axios({
            method: 'POST',
            url: `task/invitation/revoke/${that.tid}/`,
            withCredentials: true,
            data: {
                uid: uid
            }
        }).then(response => {
            return response.data;
        })
    }

    static createTask(task_info){
        return axios({
            method: 'POST',
            url: 'task/',
            data: task_info,
            withCredentials: true
        }).then(function(response){
            return TaskGraph.buildTaskGraph(response.data);
        });
    }

    getGraph(){
        let that = this;
        return axios({
            method: 'GET',
            url: `task/graph/${this.tid}/`,
            withCredentials: true
        }).then(function(response) {
            let taskGraph = new TaskGraph(that, StepModel.buildSteps(response.data.nodes), response.data.edges);
            return taskGraph;
        });
    }

    static getTask(tid){
        return axios({
            method: 'GET',
            url: `task/${tid}/`,
            withCredentials: true,
        }).then(function(response){
            return new TaskModel(tid, response.data, {});
        });
    }

    static getAllTasks(){
        return axios({
            method: 'GET',
            url: 'task/',
            withCredentials: true,
        }).then(function(response) {
            let result = {};
            for (let tid of Object.keys(response.data)){
                let taskData = response.data[tid];
                result[tid] = new TaskModel(tid, taskData.task, taskData.has_task);
            }
            return result;
        });
    }
}

module.exports = TaskModel
