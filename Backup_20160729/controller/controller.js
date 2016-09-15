(function() {
    var app = angular.module('myApp', []);
    var midiAccess = null;

    app.factory('currentPreset', function() {
        return new midiPreset(0, 0);
    });

    var midiMessage = function(inType, inNum1, inNum2, inV1, inV2, inChannel) {

        //this.midiTypeSort = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        this.number = null;
	    this.name = null;
        this.midiType = inType.toString();
        this.midiNum1 = inNum1;
        this.midiNum2 = inNum2;
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
          return [this.midiType, this.midiNum1, this.midiNum2, this.midiV1, this.midiV2, this.midiChannel];
        };
    };

    var midiPreset = function(inBank, inSwitch) {
        this.switchType = "Switch";
        //this.switchLabel = ["A","B","C","D","E","F", "G", "H", "I", "J", "K", "L", "M", "N"];
        this.midiMessages = [];
        this.numMidiMessages = 0;
        this.presetShortNameLength = 0;
        this.presetFullNameLength = 0;
        this.bankNameLength = 0;
        this.sizeMidiMessage = 0;
        this.bankNumber = inBank;
        this.switchNumber = inSwitch;
        this.presetName = "";
        this.presetFullName = "";
        this.bankFullName = "";
        this.isExp = false;

        this.getMaxNumMidiMessages = function() {
          if (this.isExp) {
            return 4;
          }
          return 8;
        }

        this.getPresetDataArray = function() {
          var returnArr = [];
          for (var i = 0; i < this.numMidiMessages; i++) {
              returnArr = returnArr.concat(this.midiMessages[i].getArray());
          }
          return returnArr;
        };

        this.getSwitchLabel = function() {
          if (this.isExp) {
            return this.switchNumber + 1;
          }
          //return this.switchLabel[this.switchNumber];
          return String.fromCharCode(65 + this.switchNumber);
        };

        this.getPresetShortNameArray = function() {
          var array = [];
          for (var i = 0; i < this.presetShortNameLength; i++) {
              if (i < this.presetName.length) {
                  array.push(this.presetName.charAt(i).charCodeAt(0));
              } else {
                array.push(" ".charCodeAt(0));
              }
          }
          return array;
        };

        this.getPresetFullNameArray = function() {
          var array = [];
          for (var i = 0; i < this.presetFullNameLength; i++) {
              if (i < this.presetFullName.length) {
                  array.push(this.presetFullName.charAt(i).charCodeAt(0));
              } else {
                array.push(" ".charCodeAt(0));
              }
          }
          return array;
        };

        this.getBankFullNameArray = function() {
          var array = [];
          for (var i = 0; i < this.bankNameLength; i++) {
              if (i < this.bankFullName.length) {
                  array.push(this.bankFullName.charAt(i).charCodeAt(0));
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

		this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));
    this.addMidiMsg(new midiMessage(0, 0, 0, 0, 0, 0));

    };

    app.controller('FormController', ['$scope', 'currentPreset', function($scope, currentPreset) {

      $scope.midiPresetTypes = [
        {"id":"0", "name":"Empty", "isExp":"false"},
        {"id":"1", "name":"PC Message", "isExp":"false"},
        {"id":"2", "name":"CC Message", "isExp":"false"},
        {"id":"3", "name":"PC Toggle", "isExp":"false"},
        {"id":"4", "name":"CC Toggle", "isExp":"false"},
        {"id":"5", "name":"PC Toggle Hold", "isExp":"false"},
        {"id":"6", "name":"CC Toggle Hold", "isExp":"false"},
        {"id":"7", "name":"CC Hold Delay", "isExp":"false"},
        {"id":"8", "name":"Note On", "isExp":"false"},
        {"id":"9", "name":"Note Off", "isExp":"false"},
        {"id":"10", "name":"Midi Clock Tap Tempo", "isExp":"false"},
        {"id":"11", "name":"Strymon Bank Up", "isExp":"false"},
        {"id":"12", "name":"Strymon Bank Down", "isExp":"false"},
        {"id":"13", "name":"PC Scroll Up", "isExp":"false"},
        {"id":"14", "name":"PC Scroll Down", "isExp":"false"},
        {"id":"15", "name":"MC6 Bank Up", "isExp":"false"},
        {"id":"16", "name":"MC6 Bank Down", "isExp":"false"},
        {"id":"17", "name":"Conditional Type", "isExp":"false"},
	{"id":"18", "name":"System Real Time", "isExp":"false"},
	{"id":"19", "name":"AxeFX Tuner (Testing)", "isExp":"false"},
        {"id":"0", "name":"Empty", "isExp":"true"},
        {"id":"1", "name":"Expression", "isExp":"true"}
      ];

        $scope.currentPreset = currentPreset;

        $scope.saveToPc = function (data, filename) {

          console.log("Saving data");
          if (!data) {
            console.error('No data');
            return;
          }

          if (!filename) {
            filename = 'download.mc6Preset';
          }

          if (typeof data === 'object') {
            data = JSON.stringify(data, undefined, 2);
          }

          var blob = new Blob([data], {type: 'text/json'}),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

          a.download = filename;
          a.href = window.URL.createObjectURL(blob);
          a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
          e.initEvent('click', true, false, window,
              0, 0, 0, 0, 0, false, false, false, false, 0, null);
          a.dispatchEvent(e);
        };

        $scope.sendCCMessage = function() {
            if ($scope.editForm.$valid) {
            console.log("Sending data");
              var presetDataArray = $scope.currentPreset.getPresetDataArray();
              var presetShortNameArray = $scope.currentPreset.getPresetShortNameArray();
              var presetFullNameArray = $scope.currentPreset.getPresetFullNameArray();
              var bankFullNameArray = $scope.currentPreset.getBankFullNameArray();

              for (var output of midiAccess.outputs.values()) {
                output.send([0xC0, 0]); // Connect

                output.send([0xB0, 10, $scope.currentPreset.bankNumber]);
                output.send([0xB0, 11, $scope.currentPreset.switchNumber]);

                output.send([0xC0, 20]); // Preset Data
                for (var i = 0; i < presetDataArray.length; i++) {
                  output.send([0xB0, 20, presetDataArray[i]]);
                }

                output.send([0xC0, 21]); // Preset short name
                for (var i = 0; i < presetShortNameArray.length; i++) {
                  output.send([0xB0, 21, presetShortNameArray[i]]);
                }

                output.send([0xC0, 22]); // Preset full name
                for (var i = 0; i < presetFullNameArray.length; i++) {
                  output.send([0xB0, 22, presetFullNameArray[i]]);
                }

                output.send([0xC0, 23]); // Bank full name
                for (var i = 0; i < bankFullNameArray.length; i++) {
                  output.send([0xB0, 23, bankFullNameArray[i]]);
                }

                output.send([0xC0, 1]); // Disconnect
            }
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

        $scope.midiPresetArray = [];
        $scope.midiPresetNameArray = [];
        $scope.midiPresetFullNameArray = [];
        $scope.midiBankNameArray = [];
        $scope.transmission_isActive = false;
        $scope.currentProgramMode = 0;

        function onMIDIMessage(event) {

            var midiType = event.data[0] & 0xf0;
            var midiChannel = (event.data[0] & 0x0f) + 1;
            var midiData_1 = event.data[1];
            var midiData_2 = event.data[2];
            var editor_start_msg_received = false;


            switch (midiType) {
              case 0xC0:
                if (midiData_1 === 0) {
                  console.log("Connecting...");
                  $scope.midiPresetArray = [];
                  $scope.midiPresetNameArray = [];
                  $scope.midiPresetFullNameArray = [];
                  $scope.midiBankNameArray = [];
                  currentProgramMode = 1;

                } else if (midiData_1 === 1) {
                  console.log("Ending connection");
                  /*console.log($scope.midiPresetArray);
                  console.log($scope.midiPresetNameArray);
                  console.log($scope.midiPresetFullNameArray);
                  console.log($scope.midiBankNameArray);*/
                  $scope.transmission_isActive = false;
                  $scope.$apply(function() {
                    parse_array();
                  });
                  currentProgramMode = 0;

                } else if (midiData_1 === 2) {
                  console.log("Sending data");
                  currentProgramMode = 2;

                } else if (midiData_1 === 20) {
                  //console.log("Receiving preset midi msg data");
                  currentProgramMode = 20;
                } else if (midiData_1 === 21) {
                   //console.log("Receiving preset name data");
                   currentProgramMode = 21;
                } else if (midiData_1 === 22) {
                   //console.log("Receiving preset full name data");
                   currentProgramMode = 22;
                } else if (midiData_1 === 23) {
                   //console.log("Receiving bank name data");
                   currentProgramMode = 23;
                }

              break;

              case 0xB0:
              if (currentProgramMode === 1) {
                if (midiData_1 === 1 && midiData_2 === 127) {
                  $scope.transmission_isActive = true;
                }
              }

              if ($scope.transmission_isActive) {
                  if (currentProgramMode === 2) {
                    if (midiData_1 == 9) {
                      //console.log("Receiving isExp");
                      if (midiData_2 > 68) {
                        $scope.currentPreset.isExp = true;
                        $scope.currentPreset.switchType = "Expression Input";
                      } else {
                        $scope.currentPreset.isExp = false;
                        $scope.currentPreset.switchType = "Switch";
                      }
                    } else if (midiData_1 === 10) {
                      //console.log("Receiving Bank Number");
                      $scope.currentPreset.bankNumber = midiData_2;
                    } else if (midiData_1 === 11) {
                      //console.log("Receiving Preset Number");
                      $scope.currentPreset.switchNumber = midiData_2;
                      console.log("Preset Number: " + midiData_2);
                    } else if (midiData_1 === 12) {
                      //console.log("Receiving preset short name length");
                      $scope.currentPreset.presetShortNameLength = midiData_2;
                    } else if (midiData_1 === 13) {
                      //console.log("Receiving preset full name length");
                      $scope.currentPreset.presetFullNameLength = midiData_2;
                    } else if (midiData_1 === 14) {
                      //console.log("Receiving preset number of midi messages");
                      $scope.currentPreset.numMidiMessages = midiData_2;
                    } else if (midiData_1 === 15) {
                      //console.log("Receiving preset midi message size");
                      $scope.currentPreset.sizeMidiMessage = midiData_2;
                    } else if (midiData_1 === 16) {
                      //console.log("Receiving Bank Name Size");
                      $scope.currentPreset.bankNameLength = midiData_2;
                    } else if (midiData_1 === 20) {

                    }
                  } else if (currentProgramMode === 20 && midiData_1 === 20) {
                    $scope.midiPresetArray.push(midiData_2);
                  } else if (currentProgramMode === 21 && midiData_1 === 21) {
                    $scope.midiPresetNameArray.push(midiData_2);
                  } else if (currentProgramMode === 22 && midiData_1 === 22) {
                    $scope.midiPresetFullNameArray.push(midiData_2);
                  } else if (currentProgramMode === 23 && midiData_1 === 23) {
                    $scope.midiBankNameArray.push(midiData_2);
                  }

                }
              break;
            }
        }

        function parse_array() {
          var counter = 0;
          for (var i = 0; i < $scope.currentPreset.numMidiMessages; i++) {
            $scope.currentPreset.midiMessages[i].midiType = $scope.midiPresetArray[counter++].toString();
            $scope.currentPreset.midiMessages[i].midiNum1 = $scope.midiPresetArray[counter++];
            $scope.currentPreset.midiMessages[i].midiNum2 = $scope.midiPresetArray[counter++];
            $scope.currentPreset.midiMessages[i].midiV1 = $scope.midiPresetArray[counter++];
            $scope.currentPreset.midiMessages[i].midiV2 = $scope.midiPresetArray[counter++];
            $scope.currentPreset.midiMessages[i].midiChannel = $scope.midiPresetArray[counter++];
          }
          $scope.currentPreset.presetName = "";
          for (var i = 0; i < $scope.currentPreset.presetShortNameLength; i++) {
            $scope.currentPreset.presetName += String.fromCharCode($scope.midiPresetNameArray[i]);
          }
          $scope.currentPreset.presetName = $scope.currentPreset.presetName.replace(/\s*$/,"");

          $scope.currentPreset.presetFullName = "";
          for (var i = 0; i < $scope.currentPreset.presetFullNameLength; i++) {
            $scope.currentPreset.presetFullName += String.fromCharCode($scope.midiPresetFullNameArray[i]);
          }
          $scope.currentPreset.presetFullName = $scope.currentPreset.presetFullName.replace(/\s*$/,"");

          $scope.currentPreset.bankFullName = "";
          for (var i = 0; i < $scope.currentPreset.bankNameLength; i++) {
            $scope.currentPreset.bankFullName += String.fromCharCode($scope.midiBankNameArray[i]);
          }
          $scope.currentPreset.bankFullName = $scope.currentPreset.bankFullName.replace(/\s*$/,"");
        }

    }]);

})();
