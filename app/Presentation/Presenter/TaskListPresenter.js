/*
    Pomodorotodo, a simple todo-list Electron application combined with the Pomodoro technique
    Copyright (C) <2017>  Rafael Jesús Palomino Vargas

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var TaskListView = require('../View/TaskListView');
var Repository = require('../../Data/Repository.js');
var GetTaskListCommand = require('../../Domain/Command/GetTaskListCommand');
var CreateTaskCommand = require('../../Domain/Command/CreateTaskCommand');
var DeleteTaskCommand = require('../../Domain/Command/DeleteTaskCommand');
var ChangeTaskStateCommand = require('../../Domain/Command/ChangeTaskStateCommand');

var TaskListPresenter = (function() {

    var taskListView = null;
    var getTaskListCommand = null;
    var createTaskCommand = null;
    var deleteTaskCommand = null;
    var changeTaskStateCommand = null;

    ////////////////////////////////////////TaskListViewCallBacks
    function onAddTaskCallBack(taskTitle) {
        createTaskCommand.execute(taskTitle, onTaskCreatedCallBack);
    }

    function onDeleteTaskCallBack(taskId) {
        deleteTaskCommand.execute(taskId, onTaskDeletedCallBack);
    }

    function onChangeTaskSateCallBack(taskId, isDone) {
        changeTaskStateCommand.execute(taskId, isDone, onTaskStateChangedCallBack);
    }

    ////////////////////////////////////////RepositoryCallBacks
    function onTaskListRecoveredCallBack(taskList) {
        taskListView.drawTaskList(taskList);
    }

    function onTaskCreatedCallBack(task) {
        taskListView.addTask(task);
    }

    function onTaskDeletedCallBack(taskId) {
        taskListView.removeTask(taskId);
    }

    function onTaskStateChangedCallBack(taskId, newState) {
        taskListView.changeTaskState(taskId, newState);
    }

    return {
        initArchitecture: function() {
            var repository = new Repository();
            getTaskListCommand = new GetTaskListCommand(repository);
            createTaskCommand = new CreateTaskCommand(repository);
            deleteTaskCommand = new DeleteTaskCommand(repository);
            changeTaskStateCommand = new ChangeTaskStateCommand(repository);

            taskListView = new TaskListView();
            taskListView.listenAddTaskEvents(onAddTaskCallBack);
            taskListView.listenDeleteTaskEvents(onDeleteTaskCallBack);
            taskListView.listenChangeTaskStateEvents(onChangeTaskSateCallBack);

            getTaskListCommand.execute(onTaskListRecoveredCallBack);
        }
    };
})();

module.exports = TaskListPresenter;