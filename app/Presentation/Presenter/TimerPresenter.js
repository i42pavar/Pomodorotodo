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

var moment = require('moment');
var notifier = require('node-notifier');
var TimerView = require('../View/TimerView');
var DrawerView = require('../View/DrawerView');
var Repository = require('../../Data/Repository.js');
var GetTimerStateCommand = require('../../Domain/Command/GetTimerStateCommand');
var ResetCommand = require('../../Domain/Command/ResetCommand');
var UpdateTimerStateCommand = require('../../Domain/Command/UpdateTimerStateCommand');

var TimerPresenter = (function() {

    var timerView = null;
    var drawerView = null;
    var timerState = null;
    var timerIsRunning = false;
    var timer = null;
    var intervalEnum = { "WORK": 1, "SHORT_BREAK": 2, "LONG_BREAK": 3 };

    var getTimerStateCommand = null;
    var resetCommand = null;
    var updateTimerStateCommand = null;

    function nextInterval(currentStep, pomodorosBeforeLongBreak) {
        if (currentStep % 2 !== 0) {
            return intervalEnum.WORK;
        } else if (currentStep % (2 * pomodorosBeforeLongBreak) !== 0) {
            return intervalEnum.SHORT_BREAK;
        } else {
            return intervalEnum.LONG_BREAK;
        }
    }

    function timeFromSeconds(seconds) {
        var currentTime = moment.duration(seconds, 'seconds');
        var sec = currentTime.seconds() < 10 ? ('0' + currentTime.seconds()) : currentTime.seconds();
        var min = currentTime.minutes() < 10 ? ('0' + currentTime.minutes()) : currentTime.minutes();

        return { "minutes": min, "seconds": sec };
    }

    function onStepFinished() {
        //update statistics
        if (timerState.currentInterval === intervalEnum.WORK) {
            timerState.workedTime += timerState.pomodoro;
            timerState.pomodoros += 1;
        } else if (timerState.currentInterval === intervalEnum.SHORT_BREAK) {
            timerState.shortBreakTime += timerState.shortBreak;
        } else {
            timerState.longBreakTime += timerState.longBreak;
        }

        //steps +1
        timerState.currentStep = timerState.currentStep + 1;

        //updates next interval (work, shor break or long break)
        timerState.currentInterval = nextInterval(timerState.currentStep, timerState.pomodorosBeforeLongBreak);

        //updates duration next step and prepares notification message
        var msg = "Ahora toca ";
        if (timerState.currentInterval === intervalEnum.WORK) {
            msg = msg + timerState.workChip;
            timerState.currentTime = timerState.pomodoro * 60;
        } else if (timerState.currentInterval === intervalEnum.SHORT_BREAK) {
            msg = msg + timerState.shortBreakChip;
            timerState.currentTime = timerState.shortBreak * 60;
        } else {
            timerState.currentTime = timerState.longBreak * 60;
            msg = msg + timerState.longBreakChip;
        }

        //Notify user
        notifier.notify({
                title: 'Pomodorotodo',
                message: msg,
                icon: './app/View/images/logo_512.ico',
                sound: true, // Only Notification Center or Windows Toasters
                wait: true // Wait with callback, until user action is taken against notification
            },
            function(err, response) {});

        //update statistics and timer state
        updateTimerStateCommand.execute(timerState, onTimerStateUpdatedCallBack);
    }

    ////////////////////////////////////////TimerViewCallBacks
    function onPauseCallBack() {
        timerIsRunning = false;
        clearInterval(timer);
    }

    function onPlayCallBack() {
        // Execute every second
        if (!timerIsRunning) {
            timerIsRunning = true;
            timer = setInterval(function() {
                // Remove one second
                timerState.currentTime = timerState.currentTime - 1;
                // Print out the time
                var time = timeFromSeconds(timerState.currentTime);
                timerView.setMinutes(time.minutes);
                timerView.setSeconds(time.seconds);
                // When reaching 0. Stop.
                if (timerState.currentTime <= 0) {
                    clearInterval(timer);
                    timerIsRunning = false;
                    onStepFinished();
                }
            }, 1000); // 1 second
        }
    }

    function onResetCallBack() {
        timerIsRunning = false;
        clearInterval(timer);
        resetCommand.execute(onResetedCallBack);
    }

    ////////////////////////////////////////RepositoryCallBacks
    function onTimerStateRecoveredCallBack(_timerState) {
        timerState = _timerState;

        drawerView.updateStatistic({
            "workedTime": timerState.workedTime,
            "shortBreakTime": timerState.shortBreakTime,
            "longBreakTime": timerState.longBreakTime,
            "pomodoros": timerState.pomodoros
        });

        var time = timeFromSeconds(timerState.currentTime);
        timerView.setMinutes(time.minutes);
        timerView.setSeconds(time.seconds);

        if (timerState.currentInterval === 1)
            timerView.setIntervalChip(timerState.workChip);
        else if (timerState.currentInterval === 2)
            timerView.setIntervalChip(timerState.shortBreakChip);
        else
            timerView.setIntervalChip(timerState.longBreakChip);
    }

    function onResetedCallBack(_timerState) {
        onTimerStateRecoveredCallBack(_timerState);
    }

    function onTimerStateUpdatedCallBack(_timerState) {
        onTimerStateRecoveredCallBack(_timerState);
        onPlayCallBack();
    }

    return {
        initArchitecture: function() {
            timerView = new TimerView();
            drawerView = new DrawerView();
            var repository = new Repository();
            getTimerStateCommand = new GetTimerStateCommand(repository);
            getTimerStateCommand.execute(onTimerStateRecoveredCallBack);
            resetCommand = new ResetCommand(repository);
            updateTimerStateCommand = new UpdateTimerStateCommand(repository);


            timerView.listenPauseEvents(onPauseCallBack);
            timerView.listenPlayEvents(onPlayCallBack);
            timerView.listenResetEvents(onResetCallBack);
        }
    };
})();

module.exports = TimerPresenter;