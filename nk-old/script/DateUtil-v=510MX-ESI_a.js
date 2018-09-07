/**
*   Requires: 
*   - global.js
*/

// TODO: Remove this polyfill!!
// Adding Leap Year Method to Date Obj
if (!Date.prototype.isLeapYear) {
    Date.prototype.isLeapYear = function () {
        var year = this.getFullYear();
        return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
    };
}

var DateUtil = {
    getLastDay: function (dateObj) {
        var days = 31;
        var mon = (dateObj.getMonth() + 1);
        if (mon == 4 || mon == 6 || mon == 9 || mon == 11) {
            days = 30;
        } else if (mon == 2) {
            days = dateObj.isLeapYear() ? 29 : 28;
        }
        return days;
    },
    isDate: function (year, month, day) {
        var result = true;
        var compDay = new Date(year, (month - 1));
        var lastDay = this.getLastDay(compDay);
        if (day < 1 || day > lastDay) { result = false; }
        return result;
    },
    isNewerDate: function (year, month, day) {
        var result = true;
        if (this.isDate(year, (month - 1), day)) {
            var compDate = new Date(year, (month - 1), day);
            var today = new Date();
            result = (compDate > today);
        } else { result = false; }
        return result;
    }
};