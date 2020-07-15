// Having one module named fedeApp with multiple controllers for vacation planner, seat management, dorf for users, dorf forecast and for about page


var carParking = angular.module("carParking", ['angular.filter']);
// Controller for vacation planner app
carParking.controller("carParkingCtrl", function ($scope, $http, $timeout) {
  $scope.removedCarSlots = [];
  var headers = ['Colour', 'Registration No', 'Slot No', 'Action'];
  $scope.valToBeSelected = ["Colour", "SlotNo", "RegistrationNo"];
  $scope.headers = headers;
  $scope.EnteredValue = "";
  var refresh = function (newSlots) {

    $http.get('/carParking').then(function (response) {
      console.log("getting values from db :" + response.data);

      if (response.data != undefined || null != response.data) {
        $scope.userslist = response.data;

      }

      if (newSlots) {
        $scope.newCarSlotsAllocated = true;

        $timeout(function () {
          $scope.newCarSlotsAllocated = false;
        }, 4000)
      }

    });
  };





  $scope.getValIfSlotNo = function (selectedName, EnteredValue) {

    if(EnteredValue=="")
    {
      $scope.EnteredValueForFilter="";
      return;
    }
   $scope.EnteredValueForFilter = $scope.EnteredValue;
    if (selectedName == "SlotNo") {

      for (i = 0; i < $scope.userslist.length; i++) {
        if ($scope.userslist[i].SlotNo == EnteredValue) {
          $scope.EnteredValueForFilter = $scope.userslist[i].RegistrationNo;
          break;
        }

      }
      console.log("Entered value is :" + $scope.EnteredValueForFilter)
    }
  }


  $scope.createCarObjs = function () {
    //  var runCreateval= false;
    $http.post('/emptyDB').then(function (response) {
        console.log("return from server :"+response)
    });

    $scope.removedCarSlots = [];
    var carArr = [];
    if ($scope.SlotNo == 0 || null == $scope.SlotNo || $scope.SlotNo == undefined) {
      $scope.showFailedToAddCarSlots = true;
      $timeout(function () {
        $scope.showFailedToAddCarSlots = false;
      }, 3000);
      return;
    }


    $scope.carSlotsAvailable = true;


    var map = {
      "1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "6": "F", "7": "G", "8": "H", "9": "I", "10": "J", "11": "K", "12": "L", "13": "M",
      "14": "N", "15": "O", "16": "P", "17": "Q", "18": "R", "19": "S", "20": "T", "21": "U", "22": "V", "23": "W", "24": "X", "25": "Y",
      "26": "Z"
    };






    for (var i = 0; i < $scope.SlotNo; i++) {



      var val1 = Math.floor(Math.random() * 100);
      var colour;
      var val2 = Math.floor(Math.random() * 10000);
      var cnt3 = Math.floor(Math.random() * 2);
      var cnt4 = Math.floor(Math.random() * ((26 - 1) + 1) + 1);

      var cnt5 = Math.floor(Math.random() * ((26 - 1) + 1) + 1);


      var val4 = map[cnt4];
      var val5 = map[cnt5];
      var val3 = val4 + val5;
      if (cnt3 == 0)
        colour = "Black";
      else if (cnt3 == 1)
        colour = "White";
      else if (cnt3 == 2)
        colour = "Blue";
      else if (cnt3 == 3)
        colour = "Red";

      if (val1 < 10) {
        val1 = "0" + val1;
      }


      if (val2 < 10) {
        val2 = "000" + val2;
      }
      else if (val2 < 100) {
        val2 = "00" + val2;
      }
      else if (val2 < 1000) {
        val2 = "0" + val2;
      }


      var regNo = "KA-" + val1 + "-" + val3 + "-" + val2;
      carArr.push({
        "Colour": colour,
        "SlotNo": i,
        "RegistrationNo": regNo



      });

    }


    console.log(carArr);

    $http.post('/carParking', carArr).then(function (response) {

      console.log(response);
      refresh(true);

    });






    console.log("the value entered in text box isn :" + $scope.SlotNo);

  }

  $scope.addUser = function (user) {

    if ($scope.removedCarSlots.length > 0) {



      $scope.length = '';
      $scope.getStrLength = function () {
        $scope.length = user.Colour.length;
      };


      var splitVal = user.RegistrationNo.split('-');

      if (($scope.length != 0) || (user.Colour == undefined) || (user.RegistrationNo == undefined) || (splitVal.length != 4)) {
        $scope.inCorrectValMessage = "Enter correct values for colour and registration no ";
        $scope.inCorrectVal = true;
        $timeout(function () {
          $scope.inCorrectVal = false;
        }, 3000)

        user = {};
        $scope.user = {};
        return;
      }
      $scope.removedCarSlots.sort();
      var slotno = $scope.removedCarSlots[0];
      $scope.removedCarSlots.splice(0, 1);
      console.log(slotno);
      user.SlotNo = slotno;
    }
    else {
      $scope.noSlotsAvailable = true;
      $timeout(function () {
        $scope.noSlotsAvailable = false;
      }, 4000)
      user = {};
      $scope.user = {};

      return;
    }



    $http.post('/carParking', user).then(function (response) {
      console.log(response);
      $scope.user = {};
      $scope.addUserSuccess = true;
      refresh(false);
      $scope.carAdded = "Car has been added successfully at Slot No :" + user.SlotNo;
      $timeout(function () {
        $scope.addUserSuccess = false;
      }, 5000);
      refresh(false);




      user = {};
      $scope.user = {};

    });
  };



  $scope.removeUser = function (user) {
    console.log(user);


    $scope.removedCarSlots.push(user.SlotNo);


    $http.delete('/carParking/' + user._id, user).then(function (response) {
      console.log(response);
      refresh();

    });
  };



})
