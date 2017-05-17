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

var NavBarView = function() {};

NavBarView.prototype.listenExitEvent = function(callBack) {
    $('#exit').on('click', function() {
        callBack();
    });
};

NavBarView.prototype.listenMaximizeEvent = function(callBack) {
    $('#maximize').on('click', function() {
        callBack();
    });
};

NavBarView.prototype.listenMinimizeEvent = function(callBack) {
    $('#minimize').on('click', function() {
        callBack();
    });
};

module.exports = NavBarView;