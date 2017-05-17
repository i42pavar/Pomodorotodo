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

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var remote = require('electron').remote;
var NavBarView = require('./Presentation/View/NavBarView');
var TaskListPresenter = require('./Presentation/Presenter/TaskListPresenter');
var DrawerPresenter = require('./Presentation/Presenter/DrawerPresenter');
var TimerPresenter = require('./Presentation/Presenter/TimerPresenter');

(function() {
    $(".button-collapse").sideNav();

    var navBarView = new NavBarView();
    var appWindow = remote.getCurrentWindow();

    navBarView.listenExitEvent(function() {
        appWindow.close();
    });

    navBarView.listenMaximizeEvent(function() {
        if (appWindow.isMaximized()) {
            appWindow.setSize(800, 600, true);
        } else {
            appWindow.maximize();
        }
    });

    navBarView.listenMinimizeEvent(function() {
        appWindow.minimize();
    });

    TaskListPresenter.initArchitecture();
    TimerPresenter.initArchitecture();
    DrawerPresenter.initArchitecture();
})();