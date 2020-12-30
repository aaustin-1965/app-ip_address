/**
 * @function TaskController
 * @description An AngularJS Material $mdDialog controller function.
 * @param {object} variables - An object carrying the IAP manual task's arguments.
 * @param {object} variables.incoming - Tasks's arguments.
 * @param {string} variables.incoming.cidrStr - An IPv4 subnet expressed in CIDR notation.
 * @param {string} finish_state - No longer used. This parameter's purpose has changed over
 *                                the life of IAP. It remains to avoid backwards compatibility problems.
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

  let returnedData = {
    ipAddressData: null
  };
  let finishState = 'error';

  // cidrRegex is a regular expression to match IPv4 CIDR addresses.
  // It will be used to validate user data.
  // We define it here and make it available to our AngularJS
  // application by assigning it to the $scope object's cidrRegex
  // property.
  const cidrRegex = /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))[/]([0-9]|[1-2][0-9]|3[0-2])$/;
  $scope.cidrRegex = new RegExp(cidrRegex);

  // If an optional argument was passed for parameter cidrStr,
  // assign $scope.cidrStr to parameter variables.incoming.cidrStr.
  // This will pre-populate the dialog's CIDR input, which is bound
  // to Angular variable cidrStr, to any optional passed argument.
  $scope.cidrStr = ( variables.incoming.cidrStr ? variables.incoming.cidrStr : '' );

  /**
   * Set $scope's cancelDialog property to a function that calls $mdDialog's
   * .cancel() method. We will associate this method to a button users can
   * press if they wish to cancel working the manual task.
   */
  $scope.cancelDialog = function() {
    $mdDialog.cancel();
  }

  /**
   * Set $scope's submit property to a function that calls $mdDialog's
   * .hide() method. We will associate this method to a button users can
   * press when they wish to complete working the manual task.
   */
  $scope.submit = function() {
    returnedData.ipAddressData = {
      youEntered: $scope.cidrStr
    };
    finishState = 'success';
    $mdDialog.hide({
      finish_state: finishState,
      variables: returnedData,
    });
  };
}

module.exports = function() {
  this.TaskController = TaskController;
};