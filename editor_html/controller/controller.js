(function() {
    var app = angular.module('myApp', []);
    var midiAccess = null;

    app.factory('currentPreset', function() {
        return new midiPreset(0, 0);
    });

    var midiMessage = function(inType, inNum, inV1, inV2, inChannel) {
        this.midiTypeSort = [0, 1, 2, 3, 4, 5, 14, 6, 7, 8, 9, 10, 11, 12, 13];
        this.number = null;
	this.name = null;
        this.midiType = inType.toString();
        this.midiNum = inNum;
        this.midiV1 = inV1;
        this.midiV2 = inV2;
        this.midiChannel = inChannel;

        this.getNumber = function() {
            return this.number;
        };

    		this.getName = function() {
    			return this.name;
    		};

        this.getArray = function() {
          return [this.midiType, this.midiNum, this.midiV1, this.midiV2, this.midiChannel];
        };
    };

    var midiPreset = function(inBank, inSwitch) {
        this.switchLabel = ["A","B","C","D","E","F"];
        this.midiMessages = [];
        this.numMidiMessages = 8
        this.bankNumber = inBank;
        this.switchNumber = inSwitch;
        this.presetName = "";
        this.arrayCounter = 0;
        this.structSize = 0;
        this.patchNameSize = 0;

        this.getArray = function() {
          var returnArr = [];
          for (var i = 0; i < this.numMidiMessages; i++) {
              returnArr = returnArr.concat(this.midiMessages[i].getArray());
          }
          returnArr = returnArr.concat(this.getNameArray());
          return returnArr;
        };

        this.getSwitchLabel = function() {
          return this.switchLabel[this.switchNumber];
        };

        this.getNameArray = function() {
          var array = [];
          for (var i = 0; i < this.patchNameSize; i++) {
              if (i < this.presetName.length) {
                  array.push(this.presetName.charAt(i).charCodeAt(0));
              } else {
                array.push(" ".charCodeAt(0));
              }
          }
          return array;
        };

        this.addMidiMsg = function(inMidiMsg) {
            inMidiMsg.name = "Midi Message " + (this.midiMessages.length + 1);
			inMidiMsg.number = (this.midiMessages.length + 1)
            this.midiMessages.push(inMidiMsg);
        };

        this.getMidiMsgArray = function() {
            return this.midiMessages;
        };

		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0));
    };

    app.controller('FormController', ['$scope', 'currentPreset', function($scope, currentPreset) {

        $scope.currentPreset = currentPreset;

        $scope.sendCCMessage = function() {
            console.log("Sending data");
            var arrayToSend = $scope.currentPreset.getArray();
            //console.log(arrayToSend);
            var ccMsg;
            var bankNum = $scope.currentPreset.bankNumber;
            var swNum = $scope.currentPreset.switchNumber;
            //console.log("Bank Num: " + bankNum + " | " + "Sw Num: " + swNum)
            for (var output of midiAccess.outputs.values()) {
                output.send([0xC0, 0]); //PC#0 to start transmission, channel 1
                output.send([0xb1, bankNum, swNum]); //CC Num for Bank and Switch number, channel 2
                for (var i = 0; i < arrayToSend.length; i++) {
                    ccMsg = [0xb3, i, arrayToSend[i]];
                    output.send(ccMsg);
                }

                output.send([0xC4, 1]); //End of transmission
            }
        }

    }]);

    app.controller('MidiController', ['$scope', 'currentPreset', function($scope, currentPreset) {
        $scope.browserMidiCompatible = false;
		      $scope.midiController_isConnected = false;
        var connectedDevices = [];
        angular.element(document).ready(function() {
            console.log("Ready");
            midiInit();
        });
        $scope.currentPreset = currentPreset;

        function midiInit() {
            if (navigator.requestMIDIAccess) {
                $scope.$apply(function() {
                    $scope.browserMidiCompatible = true;
                });
                console.log("Browser Compatible = true");
                navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
            } else {
                console.log("No MIDI support found.");
                $scope.$apply(function() {
                    $scope.browserMidiCompatible = false;
                })
            }
        }

        $scope.getBrowserCompatibility = function() {
            return $scope.browserMidiCompatible;
        };

        function onMIDIInit(midi) {
            midiAccess = midi;
            $scope.device = {};
            var inputs = midiAccess.inputs.values();

            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                input.value.onmidimessage = onMIDIMessage;
            }

            for (entry of midiAccess.inputs) {
                var input = entry[1];
                //for (var i = 0; i < midiAccess.inputs.length; i++) {
                //var input = midiAccess.inputs[1];
                $scope.device.manufacturer = input.manufacturer;
                $scope.device.name = input.name;
                connectedDevices.push($scope.device);
            }

            var isConnected = false;
            for (var i = 0; i < connectedDevices.length; i++) {
              if (connectedDevices[i].name.indexOf("Morningstar") > -1 || connectedDevices[i].name.indexOf("Teensy") > -1) {
                isConnected = true;
                break;
              }
            }
            $scope.$apply(function() {
                if (isConnected) {
                  $scope.midiController_isConnected = true;
                  console.log($scope.midiController_isConnected);
                }
            })
        }

        function onMIDIReject(err) {
			$scope.midiController_isConnected = false;
            console.log("Midi reject.");
        }

        $scope.midiArray = [];
        $scope.transmission_isActive = false;

        function onMIDIMessage(event) {

            var midiType = event.data[0] & 0xf0;
            var midiChannel = (event.data[0] & 0x0f) + 1;
            var midiData_1 = event.data[1];
            var midiData_2 = event.data[2];
            var editor_start_msg_received = false;

            if (midiType === 0xC0) {
                if (midiData_1 === 0 && midiChannel === 1) {
                    console.log("1.Begin transmission");
                    $scope.midiArray = [];
                    $scope.transmission_isActive = true;
                } else { //On end of tranmission message
                    if ($scope.transmission_isActive) {
                      console.log("5.Ending transmission");
                      $scope.transmission_isActive = false;
                      $scope.currentPreset.arrayCounter = 0;
                      $scope.$apply(function() {
                        parse_array();
                      });
                    } else {
                      alert("Please boot your device in editor mode!");
                    }
                }
            } else if (midiType === 0xB0 && $scope.transmission_isActive) {
                if (midiChannel === 2) { //Get Bank and Switch info
                    editor_start_msg_received = true;
                    console.log("2.Receiving Bank and Switch info");
                    $scope.currentPreset.bankNumber = midiData_1;
                    $scope.currentPreset.switchNumber = midiData_2;
                    console.log(midiData_1 + " - " + midiData_2)
                } else if (midiChannel === 3) { //Struct and Patch Name Size
                    console.log("3.Receiving Strut and Name Size info");
                    $scope.currentPreset.structSize = midiData_1;
                    $scope.currentPreset.patchNameSize = midiData_2;
                } else if (midiChannel === 4 && midiData_1 === 1) { //Data Packet sent in CC messages
                    console.log("4.Receiving data packet");
                    if ($scope.currentPreset.arrayCounter < $scope.currentPreset.structSize) {
                        $scope.midiArray.push(midiData_2);
                        $scope.currentPreset.arrayCounter++;
                    }
                }
            }
        }

        function parse_array() {
          var counter = 0;
          for (var i = 0; i < $scope.currentPreset.numMidiMessages; i++) {
            $scope.currentPreset.midiMessages[i].midiType = $scope.midiArray[counter++].toString();
            $scope.currentPreset.midiMessages[i].midiNum = $scope.midiArray[counter++];
            $scope.currentPreset.midiMessages[i].midiV1 = $scope.midiArray[counter++];
            $scope.currentPreset.midiMessages[i].midiV2 = $scope.midiArray[counter++];
            $scope.currentPreset.midiMessages[i].midiChannel = $scope.midiArray[counter++];
          }
          $scope.currentPreset.presetName = "";
          for (var i = 0; i < $scope.currentPreset.patchNameSize; i++) {
            $scope.currentPreset.presetName += String.fromCharCode($scope.midiArray[counter++]);
          }
        }


    }]);

})();
