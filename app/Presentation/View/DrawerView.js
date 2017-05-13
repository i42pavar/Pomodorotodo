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

var DrawerView = function() {};

DrawerView.prototype.setPomodoro = function(minutes) {
    $('#pomodoroPref').val(minutes);
};

DrawerView.prototype.setShortBreak = function(minutes) {
    $('#shortBreakPref').val(minutes);
};

DrawerView.prototype.setLongBreak = function(minutes) {
    $('#longBreakPref').val(minutes);
};

DrawerView.prototype.setPomodorosBeforeLB = function(nPomodoros) {
    $('#nPBeforeLBPref').val(nPomodoros);
};

DrawerView.prototype.setPreferences = function(preferences) {
    this.setPomodoro(preferences.pomodoro);
    this.setShortBreak(preferences.shortBreak);
    this.setLongBreak(preferences.longBreak);
    this.setPomodorosBeforeLB(preferences.pomodorosBeforeLongBreak);
};

DrawerView.prototype.updateStatistic = function(statistics) {
    $('#wTime').html(statistics.workedTime);
    $('#sbTime').html(statistics.shortBreakTime);
    $('#lbTime').html(statistics.longBreakTime);
    $('#nPomodoros').html(statistics.pomodoros);
};

DrawerView.prototype.listenChangePomodoroEvents = function(callBack) {
    $('#pomodoroPref').on('change', function() {
        callBack($(this).val());
    });
};

DrawerView.prototype.listenChangeShortBreakEvents = function(callBack) {
    $('#shortBreakPref').on('change', function() {
        callBack($(this).val());
    });
};

DrawerView.prototype.listenChangeLongBreakEvents = function(callBack) {
    $('#longBreakPref').on('change', function() {
        callBack($(this).val());
    });
};

DrawerView.prototype.listenChangePomodorosBeforeLBEvents = function(callBack) {
    $('#nPBeforeLBPref').on('change', function() {
        callBack($(this).val());
    });
};

DrawerView.prototype.listenResetPomodoroEvents = function(callBack) {
    $('#resetP').on('click', function() {
        callBack();
    });
};

DrawerView.prototype.listenResetShorBreakEvents = function(callBack) {
    $('#resetSB').on('click', function() {
        callBack();
    });
};

DrawerView.prototype.listenResetLongBreakEvents = function(callBack) {
    $('#resetLB').on('click', function() {
        callBack();
    });
};

DrawerView.prototype.listenResetPomodoroBeforeLBEvents = function(callBack) {
    $('#resetPBLB').on('click', function() {
        callBack();
    });
};

DrawerView.prototype.listenMailtoEvents = function(callBack) {
    $('.email').on('click', function() {
        callBack();
    });
};

DrawerView.prototype.listenLicenseEvents = function(callBack) {
    $('.license').on('click', function() {
        callBack();
    });
};

DrawerView.prototype.listenGithubEvents = function(callBack) {
    $('.github').on('click', function() {
        callBack();
    });
};

module.exports = DrawerView;