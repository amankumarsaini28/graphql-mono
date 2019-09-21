const HttpStatus = require('http-status');

let tasks = [
  {
    id: 1,
    title: 'Start Working',
    description: 'Please Start Working',
    dueDate: '20/01/2019',
    created: '21/01/2018',
    started: '15/2/2018',
    createdBy: 'admin.user',
    assignee: 'super.user'
  },
  {
    id: 2,
    title: 'Stop Working',
    description: 'Please Stop Working',
    dueDate: '20/01/2020',
    created: '21/01/2021',
    started: '15/2/2022',
    createdBy: 'admin.user',
    assignee: 'super.user'
  }
];

class TaskController {
  constructor(app, baseUrl) {
    app.get(baseUrl, this.fetchTaskList.bind(this));
    app.post(baseUrl, this.addTask.bind(this));
  }

  fetchTaskList(req, res, next) {
    const { assignee, createdBy, id } = req.query;
    const filteredTasks = tasks.filter(task => (
      (!assignee || task.assignee === assignee) &&
      (!createdBy || task.createdBy === createdBy) &&
      (!id || task.id == id)
    ));
    res
      .status(HttpStatus.OK)
      .json(filteredTasks);
  }

  addTask(req, res, next) {
    const { task } = req.body;
    tasks.push(task);
    res
      .status(HttpStatus.CREATED)
      .json(task);
  }
}

module.exports = TaskController;