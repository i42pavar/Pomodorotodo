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

var TaskListView = function(_taskList) {
    this.taskList = _taskList || null;
};

TaskListView.prototype.drawTaskList = function(taskList) {
    for (var i = 0; i < taskList.tasks.length; i++) {
        var task = taskList.tasks[i];
        this.addTask(task);
    }
};

TaskListView.prototype.addTask = function(task) {
    $('#taskList').append(
        '<li class="collection-item dissmisable">' +
        '   <p><input type="checkbox" id="' + task.id + '" ' + (task.isDone ? 'checked="checked"' : '') + '/>' +
        '       <label class="' + (task.isDone ? 'tachado' : '') + '" for="' + task.id + '">' + task.title + '</label>' +
        '       <a href="#!" class="secondary-content">' +
        '           <i class="material-icons" id="delTask" data-id="' + task.id + '">delete</i>' +
        '       </a>' +
        '   </p>' +
        '</li>'
    );
};

TaskListView.prototype.removeTask = function(taskId) {
    $("#" + taskId).parent().parent().remove();
};

TaskListView.prototype.changeTaskState = function(taskId, isDone) {
    var taskLabel = $('#taskList>li>p>label[for="' + taskId + '"]');
    if (isDone) {
        taskLabel.addClass('tachado');
    } else {
        taskLabel.removeClass('tachado');
    }
};

TaskListView.prototype.listenAddTaskEvents = function(callBack) {
    $("#addTaskForm").on("submit", function(e) {
        e.preventDefault();
        var taskTitle = $("#newTaskTitle").val();
        $("#newTaskTitle").val("");
        callBack(taskTitle);
    });
};

TaskListView.prototype.listenDeleteTaskEvents = function(callBack) {
    $('#taskList').on('click', '#delTask', function() {
        var taskIdToDelete = $(this).attr('data-id');
        callBack(taskIdToDelete);
    });
};

TaskListView.prototype.listenChangeTaskStateEvents = function(callBack) {
    $('#taskList').on('click', 'input[type=checkbox]', function() {
        var taskId = $(this).attr('id');
        var isDone = false;
        if ($(this).is(':checked')) {
            isDone = true;
        }
        callBack(taskId, isDone);
    });
};

module.exports = TaskListView;