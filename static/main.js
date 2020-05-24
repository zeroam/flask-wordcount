(function () {
  'use strict'

  var app = angular.module('WordcountApp', [])

  app.controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function ($scope, $log, $http, $timeout) {

      $scope.getResults = function () {
        $log.log("test")

        // get the URL from the input
        var userInput = $scope.url
        $log.log(userInput)

        // fire the API request
        $http.post('/start', { 'url': userInput }).then(
          function (results) {
            // success callback
            var jobID = results.data
            $log.log(jobID)
            getWordCount(jobID)
          },
          function (error) {
            // error callback
            $log.log(error)
          })
      }

      function getWordCount(jobID) {
        var timeout = ""

        var poller = function () {
          // fire another request
          $log.log('requesting ' + jobID)
          $http.get('/results/' + jobID).then(
            function(resp) {
              if (resp.status === 202) {
                $log.log(resp.data, resp.status)
              } else if (resp.status === 200) {
                $log.log(resp.data)
                $scope.wordcounts = resp.data
                $timeout.cancel(timeout)
                return false
              }
              // continue to call the poller function every 2 seconds
              // until time timeout is cancelled
              timeout = $timeout(poller, 2000)
            }
          )
        }
        poller()
      }
    }])
}())