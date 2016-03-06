console.log("index");

var rootApp = angular.module('rootApp', ['ngRoute']);

rootApp.controller('myCtrl', ['$scope', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.phones = [{
        "name": "Nexus S",
        "snippet": "Fast just got faster with Nexus S."
    }, {
        "name": "Motorola XOOM™ with Wi-Fi",
        "snippet": "The Next, Next Generation tablet."
    }, {
        "name": "MOTOROLA XOOM™",
        "snippet": "The Next, Next Generation tablet."
    }];
}]);