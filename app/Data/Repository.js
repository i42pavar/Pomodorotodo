/*
    Pomodoro, a simple todo-list Electron application combined with the Pomodoro technique
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

var storage = require('electron-json-storage');

var Repository = function() {};

Repository.prototype.getTaskList = function(callBack) {
    var tasks = { "tasks": [] };
    storage.get('taskList', function(error, data) {
        var isEmpty = true;
        for (var i in data) { isEmpty = false; break; }
        if (isEmpty) {
            storage.set('taskList', tasks, function(error) {});
            callBack(tasks);
        } else callBack(data);
    });
};

Repository.prototype.createTask = function(taskTitle, callBack) {
    var newTask = { "id": Date.now(), "title": taskTitle, "isDone": false };
    storage.get("taskList", function(error, data) {
        data.tasks.push(newTask);
        storage.set("taskList", data);
    });
    callBack(newTask);
};

Repository.prototype.deleteTask = function(taskId, callBack) {
    storage.get("taskList", function(error, data) {
        for (var i = 0; i < data.tasks.length; i++) {
            var task = data.tasks[i];
            if (task.id == taskId) {
                data.tasks.splice(i, 1);
                storage.set("taskList", data);
                break;
            }
        }
    });
    callBack(taskId);
};

Repository.prototype.changeTaskState = function(taskId, isDone, callBack) {
    storage.get("taskList", function(error, data) {
        for (var i = 0; i < data.tasks.length; i++) {
            var task = data.tasks[i];
            if (task.id == taskId) {
                data.tasks[i].isDone = isDone;
                storage.set("taskList", data);
                break;
            }
        }
    });
    callBack(taskId, isDone);
};

Repository.prototype.getPreferences = function(callBack) {
    var prefs = {
        "pomodoro": 25,
        "shortBreak": 5,
        "longBreak": 20,
        "pomodorosBeforeLongBreak": 4,
        "workChip": "Tiempo de trabajo",
        "shortBreakChip": "Tiempo de descanso corto",
        "longBreakChip": "Tiempo de descanso largo",
        "currentTime": 1500,
        "currentStep": 1,
        "currentInterval": 1, // 1-> work, 2-> shortBreak, 3-> longBreak
        "workedTime": 0,
        "shortBreakTime": 0,
        "longBreakTime": 0,
        "pomodoros": 0
    };
    storage.get('preferences', function(error, data) {
        var isEmpty = true;
        for (var i in data) { isEmpty = false; break; }
        if (isEmpty) {
            storage.set('preferences', prefs, function(error) {});
            callBack(prefs);
        } else callBack(data);
    });
};

Repository.prototype.updateTimerState = function(newData, callBack) {
    storage.get('preferences', function(error, data) {
        data.currentTime = newData.currentTime;
        data.currentStep = newData.currentStep;
        data.currentInterval = newData.currentInterval;
        data.workedTime = newData.workedTime;
        data.shortBreakTime = newData.shortBreakTime;
        data.longBreakTime = newData.longBreakTime;
        data.pomodoros = newData.pomodoros;

        storage.set('preferences', data, function(error) {});
        callBack(data);
    });
};

Repository.prototype.reset = function(callBack) {
    storage.get('preferences', function(error, data) {
        data.currentTime = data.pomodoro * 60; //minutes * secs
        data.currentStep = 1;
        data.currentInterval = 1;
        data.workedTime = 0;
        data.shortBreakTime = 0;
        data.longBreakTime = 0;
        data.pomodoros = 0;

        storage.set('preferences', data, function(error) {});
        callBack(data);
    });
};


Repository.prototype.getTimerState = function(callBack) {
    this.getPreferences(callBack);
};

Repository.prototype.setPomodoro = function(minutes, callBack) {
    var newDuration = Number(minutes);
    //var newDuration = ((newDuration > 0 && typeof(newDuration) === Number) ? newDuration : 25);
    storage.get('preferences', function(error, data) {
        data.pomodoro = newDuration;
        storage.set('preferences', data, function(error) {});
    });
    callBack(newDuration);
};

Repository.prototype.resetPomodoro = function(callBack) {
    storage.get('preferences', function(error, data) {
        data.pomodoro = 25;
        storage.set('preferences', data, function(error) {});
        callBack(data.pomodoro);
    });
};

Repository.prototype.setShortBreak = function(minutes, callBack) {
    var newDuration = Number(minutes);
    //var newDuration = ((newDuration > 0 && typeof(newDuration) === Number) ? newDuration : 5);
    storage.get('preferences', function(error, data) {
        data.shortBreak = newDuration;
        storage.set('preferences', data, function(error) {});
    });
    callBack(newDuration);
};

Repository.prototype.resetShortBreak = function(callBack) {
    storage.get('preferences', function(error, data) {
        data.shortBreak = 5;
        storage.set('preferences', data, function(error) {});
        callBack(data.shortBreak);
    });
};

Repository.prototype.setLongBreak = function(minutes, callBack) {
    var newDuration = Number(minutes);
    //var newDuration = ((newDuration > 0 && typeof(newDuration) === Number) ? newDuration : 20);
    storage.get('preferences', function(error, data) {
        data.longBreak = newDuration;
        storage.set('preferences', data, function(error) {});
    });
    callBack(newDuration);
};

Repository.prototype.resetLongBreak = function(callBack) {
    storage.get('preferences', function(error, data) {
        data.longBreak = 20;
        storage.set('preferences', data, function(error) {});
        callBack(data.longBreak);
    });
};

Repository.prototype.setPomodorosBeforeLongBreak = function(nPomodoros, callBack) {
    var nP = Number(nPomodoros);
    //var nP = ((nP >= 1 && typeof(nP) === Number) ? nP : 4);
    storage.get('preferences', function(error, data) {
        data.pomodorosBeforeLongBreak = nP;
        storage.set('preferences', data, function(error) {});
    });
    callBack(nP);
};

Repository.prototype.resetPomodorosBeforeLongBreak = function(callBack) {
    storage.get('preferences', function(error, data) {
        data.pomodorosBeforeLongBreak = 4;
        storage.set('preferences', data, function(error) {});
        callBack(data.pomodorosBeforeLongBreak);
    });
};

module.exports = Repository;