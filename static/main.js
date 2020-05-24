(function () {
  'use strict'

  var app = angular.module('WordcountApp', [])

  app.controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function ($scope, $log, $http, $timeout) {

      $scope.submitButtonText = 'Submit'
      $scope.loading = false
      $scope.urlerror = false

      $scope.getResults = function () {
        $log.log("test")

        // get the URL from the input
        var userInput = $scope.url

        // fire the API request
        $http.post('/start', { 'url': userInput }).then(
          function (results) {
            // success callback
            var jobID = results.data
            $log.log(jobID)
            getWordCount(jobID)
            $scope.wordcounts = null
            $scope.loading = true
            $scope.submitButtonText = 'Loading...'
            $scope.urlerror = false
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
          $http.get('/results/' + jobID).then(
            function (resp) {
              if (resp.status === 202) {
                $log.log(resp.data, resp.status)
              } else if (resp.status === 200) {
                $log.log(resp.data)
                $scope.loading = false
                $scope.submitButtonText = 'Submit'
                $scope.wordcounts = resp.data
                $timeout.cancel(timeout)
                return false
              }
              // continue to call the poller function every 2 seconds
              // until time timeout is cancelled
              timeout = $timeout(poller, 2000)
            },
            function (error) {
              $log.log(error)
              $scope.loading = false
              $scope.submitButtonText = "Submit"
              $scope.urlerror = true
            }
          )
        }
        poller()
      }
    }])

    app.directive('wordCountChart', ['$parse', function ($parse) {
      return {
        restrict: 'E',
        replace: true,
        template: '<div id="chart"></div>',
        link: function (scope) {
          scope.$watch('wordcounts', function () {
            d3.select('#chart').selectAll('*').remove()
            var data = scope.wordcounts
            for (var word in data) {
              var key = data[word][0]
              var value = data[word][1]
              d3.select('#chart')
                .append('div')
                .selectAll('div')
                .data(word)
                .enter()
                .append('div')
                .style('width', function () {
                  return (value * 10) + 'px'
                })
                .text(function (d) {
                  return key
                })
            }
          }, true)
        }
      }
    }])
}())
