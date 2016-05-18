/**
 * Created by ashun on 16/5/17.
 */


(function() {
    'use strict';

    angular
        .module('SoftwareTesting',['ngResource'])
        .controller('billCtrl', billCtrl);


    function billCtrl($scope, $rootScope, $resource) {
        // var num = $rootScope.name;
        // $resource('http://localhost:7777/bill').save({},{
        //     phoneNum: num
        // }).$promise.then(
        //     function (response) {
        //         console.log(response);
        //         $scope.list = response.Bill;
        //     }, function (error) {
        //         console.log(error);
        //     });
        //console.log("11");
        //$scope.phonenum = "1112";
        console.log($rootScope.name);

    }


})();