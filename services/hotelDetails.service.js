(function () {
    'use strict';
    angular
        .module('hotelApp')
        .factory('hotelDetailsService', hotelDetailsService);

    hotelDetailsService.$inject = [];
    function hotelDetailsService() {
        return {
            spliceArrayByGroups: spliceArrayByGroups,
            spliceArrayByNGroups: spliceArrayByNGroups,
            moreThanOneRoomsSameAdultCount: moreThanOneRoomsSameAdultCount,
            allRoomsSameAdultsCount: allRoomsSameAdultsCount,
            findAllCombinations: findAllCombinations,
            getDaysStayRequested: getDaysStayRequested,
            getRoomsCount: getRoomsCount,
            filterByBoardAndCharacteristics: filterByBoardAndCharacteristics
        };

        /**
         * Splicing an array bu group of {groupSize}
         * Input - [1,2,3,4,5,6], 2.
         * Output - [[1,2], [3,4], [5,6], [7,8]]
         * @param array
         * @param groupSize
         * @returns {Array}
         */
        function spliceArrayByGroups(array, groupSize) {
            var a = [];
            while (array.length > 0)
                a.push(array.splice(0, groupSize));
            return a;
        }

        /**
         * Input - [1,2,3,4,5,6], 2.
         * Output - [[1,2,3,4], [5,6,7,8]]
         * @param arr
         * @param n
         * @returns {Array}
         */
        function spliceArrayByNGroups(arr, n) {
            var rest = arr.length % n, // how much to divide
                restUsed = rest, // to keep track of the division over the elements
                partLength = Math.floor(arr.length / n),
                result = [];

            for(var i = 0; i < arr.length; i += partLength) {
                var end = partLength + i,
                    add = false;

                if(rest !== 0 && restUsed) { // should add one element for the division
                    end++;
                    restUsed--; // we've used one division element now
                    add = true;
                }

                result.push(arr.slice(i, end)); // part of the array

                if(add) {
                    i++; // also increment i in the case we added an extra element for division
                }
            }

            return result;
        }

        /**
         * Checking is more than one room has same adults quantity.
         * Examples:
         * 1. 3 rooms. 1room - 2adults, 2room - 2adults, 3room - 3adults  // {2: 2, 3: 1}
         * 1. 3 rooms. 1room - 1adults, 2room - 2adults, 3room - 3adults  // false
         * @param searchParams
         * @returns {*}
         */
        function moreThanOneRoomsSameAdultCount(searchParams) {
            var moreThanOneRoomsSameAdultCount = false;
            var allAdultsRequested =  _
                .chain(searchParams)
                .filter(function (t, key) { return key.indexOf('adultCount') !== -1 })
                .value();


            var roomsCountByAdults = {};

            _.each(allAdultsRequested, function (adults) {
                if (!roomsCountByAdults[adults]) return roomsCountByAdults[adults] = 1;
                roomsCountByAdults[adults] = roomsCountByAdults[adults] + 1
            });

            _.each(roomsCountByAdults, function (key, value) {
                if (value > 1) {
                    moreThanOneRoomsSameAdultCount = true;
                }
            });

            if (moreThanOneRoomsSameAdultCount) {
                return roomsCountByAdults;
            } else {
                return false;
            }
        }

        /**
         * Checking are all rooms have same adults quantity.
         * Examples:
         * 1. 3 rooms. 1room - 2adults, 2room - 2adults, 3room - 2adults  // 3
         * 1. 3 rooms. 1room - 1adults, 2room - 2adults, 3room - 3adults  // false
         * @param searchParams
         * @returns {*}
         */
        function allRoomsSameAdultsCount(searchParams) {
            var allAdultsRequested =  _
                .chain(searchParams)
                .filter(function (t, key) { return key.indexOf('adultCount') !== -1 })
                .value();

            return identical(allAdultsRequested);

            function identical(array) {
                for(var i = 0; i < array.length - 1; i++) {
                    if(array[i] !== array[i+1]) {
                        return false;
                    }
                }
                return array.length;
            }
        }


        /**
         * Looking for all combinations of injected array of arrays
         * @param arg - [[1,2,3], [4,5,6], [7,8,9]]
         * @returns {Array}  - [[1,4,7], [1,5,7], [1,6,7], ....]
         */
        function findAllCombinations(arg) {
            var r = [], max = arg.length - 1;

            function helper(arr, i) {
                for (var j = 0, l = arg[i].length; j < l; j++) {
                    var a = arr.slice(0); // clone arr
                    a.push(arg[i][j]);
                    if (i == max) {
                        r.push(a);
                    } else
                        helper(a, i + 1);
                }
            }

            helper([], 0);
            return r;
        }

        function getDaysStayRequested(checkOut, checkIn) {
            var date1 = parseDate(checkOut);
            var date2 = parseDate(checkIn);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            return Math.ceil(timeDiff / (1000 * 3600 * 24)); // days difference

            function parseDate(str) { 
                var y = str.substr(0,4),
                    m = str.substr(4,2) - 1,
                    d = str.substr(6,2);
                var D = new Date(y,m,d);
                return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
            }
        }

        function getRoomsCount(searchParams) {
            return _
                .chain(searchParams)
                .keys()
                .filter(function (t) { return t.indexOf('roomCount') !== -1 })
                .value()
                .length;
        }

        function filterByBoardAndCharacteristics(combinations) {
            var filtered = filter();
            if (!_.keys(filtered).length) {
                return {filtered: filter(true), notSameBoard: true}
            }
            return {filtered: filtered, notSameBoard: false};
            function filter(differentBoardAvailable) {
                var diff = {};
                var same = {};
                _.each(combinations, function (roomGroup) {
                    var roomBoard;
                    var roomType;
                    var wrongBoardOrTypeCombination;
                    var wrongBoard;
                    _.each(roomGroup, function (room) {
                        if (!roomBoard || !roomType) {
                            roomBoard = room.Board.Code;
                            roomType = room.RoomType.Characteristic;
                            return;
                        }
                        if (roomBoard !== room.Board.Code) {
                            wrongBoard = true;
                        }
                        if (roomType !== room.RoomType.Characteristic) {
                            wrongBoardOrTypeCombination = true;
                        }
                    });

                    if (wrongBoard && !differentBoardAvailable) return;

                    if (wrongBoard) {
                        if (!diff[roomGroup[0].Board.Code]) diff[roomGroup[0].Board.Name] = [];
                        diff[roomGroup[0].Board.Name].push(roomGroup);
                    } else {
                        if (!same[roomGroup[0].Board.Name]) same[roomGroup[0].Board.Name] = [];
                        same[roomGroup[0].Board.Name].push(roomGroup);
                    }
                });
                _.extend(same, diff);
                return same;
            }

        }

    }
})();
