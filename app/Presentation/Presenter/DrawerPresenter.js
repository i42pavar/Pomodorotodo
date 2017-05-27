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

var shell = require('electron').shell;
var DrawerView = require('../View/DrawerView');
var Repository = require('../../Data/Repository.js');
var GetPreferencesCommand = require('../../Domain/Command/GetPreferencesCommand');
var SetPomodoroCommand = require('../../Domain/Command/SetPomodoroCommand');
var SetShortBreakCommand = require('../../Domain/Command/SetShortBreakCommand');
var SetLongBreakCommand = require('../../Domain/Command/SetLongBreakCommand');
var SetPomodorosBeforeLBCommand = require('../../Domain/Command/SetPomodorosBeforeLBCommand');
var ResetPomodoroDurationCommand = require('../../Domain/Command/ResetPomodoroDurationCommand');
var ResetShortBreakDurationCommand = require('../../Domain/Command/ResetShortBreakDurationCommand');
var ResetLongBreakDurationCommand = require('../../Domain/Command/ResetLongBreakDurationCommand');
var ResetNPomodorosBLBCommand = require('../../Domain/Command/ResetNPomodorosBLBCommand');

var DrawerPresenter = (function() {

    var drawerView = null;
    var getPreferencesCommand = null;
    var setPomodoroCommand = null;
    var setShortBreakCommand = null;
    var setLongBreakCommand = null;
    var setPomodorosBeforeLBCommand = null;
    var resetPomodoroDurationCommand = null;
    var resetShortBreakDurationCommand = null;
    var resetLongBreakDurationCommand = null;
    var resetNPomodorosBLBCommand = null;

    ////////////////////////////////////////DrawerViewCallBacks
    function onChangePomodoroCallBack(minutes) {
        setPomodoroCommand.execute(minutes, onPomodoroChangedCallBack);
    }

    function onChangeShortBreakCallBack(minutes) {
        setShortBreakCommand.execute(minutes, onShortBreakChangedCallBack);
    }

    function onChangeLongBreakCallBack(minutes) {
        setLongBreakCommand.execute(minutes, onLongBreakChangedCallBack);
    }

    function onChangePomodorosBeforeLBCallBack(nPomodoros) {
        setPomodorosBeforeLBCommand.execute(nPomodoros, onPomodorosBeforeLBChangedCallBack);
    }

    function onResetPomodoroCallBack() {
        resetPomodoroDurationCommand.execute(onPomodoroChangedCallBack);
    }

    function onResetShortBreakCallBack() {
        resetShortBreakDurationCommand.execute(onShortBreakChangedCallBack);
    }

    function onResetLongBreakCallBack() {
        resetLongBreakDurationCommand.execute(onLongBreakChangedCallBack);
    }

    function onResetPomodorosBeforeLBCallBack() {
        resetNPomodorosBLBCommand.execute(onPomodorosBeforeLBChangedCallBack);
    }

    function onMailtoCallBack() {
        shell.openExternal('mailto:i42pavar@uco.es');
    }

    function onLicenseCallBack() {
        shell.openExternal('https://github.com/i42pavar/Pomodorotodo/blob/master/LICENSE');
    }

    function onGithubCallBack() {
        shell.openExternal('https://github.com/i42pavar/Pomodorotodo');
    }

    ////////////////////////////////////////RepositoryCallBacks
    function onPomodoroChangedCallBack(minutes) {
        drawerView.setPomodoro(minutes);
    }

    function onShortBreakChangedCallBack(minutes) {
        drawerView.setShortBreak(minutes);
    }

    function onLongBreakChangedCallBack(minutes) {
        drawerView.setLongBreak(minutes);
    }

    function onPomodorosBeforeLBChangedCallBack(nPomodoros) {
        drawerView.setPomodorosBeforeLB(nPomodoros);
    }

    function onPreferencesRecoveredCallBack(preferences) {
        drawerView.setPreferences(preferences);
    }

    return {
        initArchitecture: function() {
            var repository = new Repository();
            getPreferencesCommand = new GetPreferencesCommand(repository);
            setPomodoroCommand = new SetPomodoroCommand(repository);
            setShortBreakCommand = new SetShortBreakCommand(repository);
            setLongBreakCommand = new SetLongBreakCommand(repository);
            setPomodorosBeforeLBCommand = new SetPomodorosBeforeLBCommand(repository);
            resetPomodoroDurationCommand = new ResetPomodoroDurationCommand(repository);
            resetShortBreakDurationCommand = new ResetShortBreakDurationCommand(repository);
            resetLongBreakDurationCommand = new ResetLongBreakDurationCommand(repository);
            resetNPomodorosBLBCommand = new ResetNPomodorosBLBCommand(repository);

            drawerView = new DrawerView();
            drawerView.listenChangePomodoroEvents(onChangePomodoroCallBack);
            drawerView.listenChangeShortBreakEvents(onChangeShortBreakCallBack);
            drawerView.listenChangeLongBreakEvents(onChangeLongBreakCallBack);
            drawerView.listenChangePomodorosBeforeLBEvents(onChangePomodorosBeforeLBCallBack);

            drawerView.listenResetPomodoroEvents(onResetPomodoroCallBack);
            drawerView.listenResetShorBreakEvents(onResetShortBreakCallBack);
            drawerView.listenResetLongBreakEvents(onResetLongBreakCallBack);
            drawerView.listenResetPomodoroBeforeLBEvents(onResetPomodorosBeforeLBCallBack);
            drawerView.listenMailtoEvents(onMailtoCallBack);
            drawerView.listenLicenseEvents(onLicenseCallBack);
            drawerView.listenGithubEvents(onGithubCallBack);

            getPreferencesCommand.execute(onPreferencesRecoveredCallBack);
        }
    };
})();

module.exports = DrawerPresenter;