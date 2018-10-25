const { TaskModel } = require('../index')

function testTaskModel(){
  let i = 10;
  let j = '1a';
  console.log({ i, j });

    // console.log(TaskModel);
    // TaskModel.getTask('e5ca9f7067f745c1b51948aec776f7c0').then(function(result){
    //     let task = result;
    //     // task.invite('Lazy-Y').then(response => {
    //     //     console.log(response);
    //     // })
    //     // task.revoke_invitation('e43a2063-704e-4809-8e05-57212a98ecea').then(r => {
    //     //     console.log(r);
    //     // })
    //
    //     // task.getGraph().then(function(taskGraph){
    //     //     // let from = taskGraph.addStep({
    //     //     //     name: 'from',
    //     //     //     status: 'ip',
    //     //     // });
    //     //     // let to = taskGraph.addStep({
    //     //     //     name: 'to',
    //     //     //     status: 'ip',
    //     //     // });
    //     //     // taskGraph.connect(from, to);
    //     //     let s = taskGraph.steps['7c20d70256f943ff90e845790017dc09'];
    //     //     taskGraph.deleteComponents(s, ['9aab1346-70e8-40e9-9e96-0a2b5d473400']).then(data => {
    //     //       console.log(data)
    //     //     });
    //     //     // taskGraph.deleteStep(s);
    //     //     // // console.log(taskGraph.serialize());
    //     //     // taskGraph.save().then(taskGraph => {
    //     //     //     console.log(taskGraph);
    //     //     // });
    //     // })
    // })


    // TaskModel.createTask({
    //     name: 'new task'
    // }).then(function(taskGraph) {
    //     taskGraph.save();
    // })
}

testTaskModel();
