// Define variable taskData, later assigned to this.variables in an exported anonymous function.
// IAP sets _this.variable.incoming_ to the task's runtime arguments,
// and passes the copy as an argument to TaskController's first parameter.
// As a best practice, define the manual task's parameters as properties of the incoming object
// with null values for easy reference when modifying your code.
var taskData = {
  incoming: {
    cidrStr: null,
  }
};

// Define variable taskFinishState, later assignd to this.finish_state in an exported
// anonymous function.
// IAP passes the exported string an argument to
// TaskController's second parameter.
// This variable's purpose has changed over the life of IAP.
// It isn't necessarily used in modern IAP releases, but it remains to
// avoid backwards compatibility problems.
var taskFinishState = null;


/**
 * AngularJS controller function.
 * @param {object} variables - An object carrying the IAP manual task's arguments.
 * @param {object} variables.incoming - Tasks's arguments.
 * @param {string} finish_state - No longer used.
 * @param {object} $scope - [AngularJS built-in $scope object]{@link https://code.angularjs.org/1.5.3/docs/guide/scope}
 *                          used to transfer data from the
 *                          controller to the view and visa-versa.
 * @param {object} $http - [AngularJS $http service]{@link https://code.angularjs.org/1.5.3/docs/api/ng/service/$http}
 *                         used to send or receive data
 *                         from remote server using browser's XMLHttpRequest (XHR)
 *                         or JSONP.
 * @param {object} $mdDialog - [AngularJS Material's $mdDialog service]{@link https://material.angularjs.org/1.0.7/api/service/$mdDialog}.
 *                             Opens a dialog over the app to inform users about
 *                             critical information or require them to make decisions.
 */
function TaskController(variables, finish_state, $scope, $http, $mdDialog) {
  let cidrRegex = /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))[/]([0-9]|[1-2][0-9]|3[0-2])$/;
  $scope.cidrRegex = new RegExp(cidrRegex);
  $scope.cidrStr = variables.incoming.cidrStr;
  let returnedData = {
    ipAddressData: null
  };
  let finishState = 'error';

  $scope.cancelDialog = function() {
    $mdDialog.cancel();
  }

  $scope.submit = function() {
    $http({
      method: 'GET',
      url: '/ip-address/firstIpAddress/' + encodeURIComponent($scope.cidrStr),
    }).then(
      function successCallback(response) {
        returnedData.ipAddressData = response.data || {};
        finishState = 'success';
        $mdDialog.hide({
          finish_state: finishState,
          variables: returnedData,
        });
      },
      function errorCallback(response) {
        returnedData.ipAddressData = response.data || {};
        finishState = 'error';
        $mdDialog.hide({
          finish_state: finishState,
          variables: returnedData,
        });
      },
    );
  };

  function setFocusToTextBox(focusId) {
    let textbox = document.getElementById(focusId);
    textbox.focus();
    textbox.scrollIntoView();
  }

  const focusToElementWithId = 'cidrInput';
  console.log('What is document.getElementById(' + focusToElementWithId + '): ' + document.getElementById(focusToElementWithId));
  if (document.getElementById(focusToElementWithId)) {
    console.log('Calling setFocusToTextBox()');
    setFocusToTextBox(focusToElementWithId);
  };

}

module.exports = function() {
  this.variables = taskData;
  this.finish_state = taskFinishState;
  this.TaskController = TaskController;
};