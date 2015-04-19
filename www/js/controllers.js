angular.module('starter.controllers', [])

.controller(
  'DashCtrl',
  function($scope, $cordovaDeviceMotion) {
   var watchID = null;
   var xPos = new Array();
   var yPos = new Array();
   var zPos = new Array();
   var timeStamps = new Array();

   var posXYXElement = document.getElementById('position-x-y-z');
   var results = document.getElementById('results');

   var vectorSumWithTimeStamps = new Array();

   $scope.StartCaputing = function() {
    vectorSumWithTimeStamps = new Array();
    document.addEventListener("deviceready", startWatch, false);
   };

   $scope.ClearCaputuredData = function() {
    posXYXElement.innerHTML = "";
   };

   $scope.StopCaputing = function() {
    console.log("Stopping");
    var initialTimeStamp = null;
    var finalTimeStamp = null;
    var height = 0;

    vectorSumWithTimeStamps.forEach(function(vectorSumWithTimeStamp) {
     vectorSum = vectorSumWithTimeStamp.vectorSum;
     timeStamp = vectorSumWithTimeStamp.timeStamp;
     if (Number(vectorSum) < 4) {
      if (initialTimeStamp == null) {
       console.log("initialTimeStamp: " + initialTimeStamp);
       initialTimeStamp = timeStamp;
      }
     }
     if (Number(vectorSum) > 4) {
      if (initialTimeStamp != null && finalTimeStamp == null) {
       console.log("finalTimeStamp: " + finalTimeStamp);
       finalTimeStamp = timeStamp;
      }
     }
     if (finalTimeStamp != null) {
      console.log("finalTimeStamp:" + finalTimeStamp );
      return false;
     }
    });
    stopWatch();
    var timeDifference = Number(finalTimeStamp) - Number(initialTimeStamp);
    var height = 1 / 2 * (9.8) * (timeDifference/1000) * (timeDifference/1000);

    results.innerHTML = "finalTimeStamp:" + finalTimeStamp
      + ", initialTimeStamp:" + initialTimeStamp + ", height: " + height;
   };

   function startWatch() {
    var options = {
     frequency : 10
    };

    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError,
      options);
    console.log("Started Watch Id " + watchID);
   }

   function stopWatch() {
    console.log("Stopping Watch " + watchID);
    if (watchID) {
     navigator.accelerometer.clearWatch(watchID);
     watchID = null;
    }
   }

   function onSuccess(acceleration) {

    xPos.push(acceleration.x);
    yPos.push(acceleration.y);
    zPos.push(acceleration.z);
    timeStamps.push(acceleration.timestamp);

    var vectorSum = Math.sqrt(acceleration.x * acceleration.x + acceleration.y
      * acceleration.y * acceleration.y + acceleration.z * acceleration.z);

    var newPosition = acceleration.x + "," + acceleration.y + ","
      + acceleration.z + "-" + acceleration.timestamp;
    // console.log("Status" + newPosition);

    var date = new Date(acceleration.timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var milliSeconds = "0" + date.getMilliseconds();

    var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) + ':'
      + seconds.substr(seconds.length - 2) + milliSeconds;

    posXYXElement.innerHTML = posXYXElement.innerHTML + "<br/>"
      + acceleration.timestamp + " - " + vectorSum.toFixed(3);

    vectorSumWithTimeStamps.push({
     vectorSum : vectorSum,
     timeStamp : acceleration.timestamp
    });
   }

   // onError: Failed to get the acceleration
   //
   function onError() {
    alert('onError!');
   }
  })

.controller('AccountCtrl', function($scope) {
 $scope.settings = {
  enableFriends : true
 };
});
