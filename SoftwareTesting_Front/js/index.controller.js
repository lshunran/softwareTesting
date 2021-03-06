/**
 * Created by ashun on 16/5/17.
 */

(function() {
    'use strict';

    angular
        .module('SoftwareTesting', ['ngResource'])
        .controller('indexCtrl', indexCtrl);


    function indexCtrl($scope, $rootScope, $resource) {
        $scope.payway = 'card';

        $scope.getbill = function (num) {
            console.log(num);
            $resource('http://localhost:7777/bill').save({},{
                phoneNum: num
            }).$promise.then(
                function (response) {
                    console.log(response);
                    $scope.phonenum = response.Bill.phone;
                    $scope.mins = response.Bill.mins;
                    $scope.times = response.Bill.times;
                    $scope.remains = response.Bill.remains;
                    $scope.date = response.Bill.date;
                    $scope.totalNum = response.Bill.totalNum;
                    if(response.Bill.status == 0) $scope.status = "未缴费";
                    else if(response.Bill.status == 1)$scope.status = "已缴费";

                    console.log(response.Bill.phone);
                }, function (error) {
                    console.log(error);
                });
        }


        $scope.charge = function (num,status,payway,account,totalNum) {
            console.log(num+status+payway+account);
            var tag;
            if(payway == "card") tag=1;
            else if(payway == "alipay") tag=0;
            console.log(tag);
            if(status == "已缴费"){
                alert('该用户已缴费');

            }else {

                $resource('http://localhost:7777/payway').save({}, {
                    phoneNum: num,
                    tag: tag,
                    account: account,
                    totalNum: totalNum
                }).$promise.then(
                    function (response) {
                        console.log(response);
                        if (response.result == "支付成功") {
                            alert('缴费成功');
                            $scope.getbill(num);
                        } else {
                            alert(response.result);
                        }
                    }, function (error) {
                        console.log(error);
                    });
            }

        }
    }


})();
