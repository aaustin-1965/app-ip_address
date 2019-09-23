/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
*/
const IPCIDR = require('ip-cidr');
const path = require('path');

/**
 * Import helper function module located in same directory
 * as this module.
 */
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, './ipv6.js'));

class IpAddress {
  constructor() {
    log.info('Starting the IpAddress product.');
  }

  /**
   * Calculate and return the first host IP address from a CIDR subnet.
   * @param {string} cidrStr - The IPv4 subnet expressed
   *                 in CIDR format.
   * @param {callback} callback - A callback function.
   * @return {object} (firstIpAddress) - An object with two properties, ipv4 and ipv6,
   *                 whose values are strings. The ipv4 property will be a
   *                 dotted-quad IPv4 address, such as 10.10.10.1.  The ipv6
   *                 property will be an IPv6 address, such as 0:0:0:0:0:ffff:0a0a:0a01.
   */
  getFirstIpAddress(cidrStr, callback) {

    // Initialize return arguments for callback
    let firstIpAddress = {
      ipv4: null,
      ipv6: null
    };
    let callbackError = null;

    if (typeof cidrStr === "string") {
      const cidr = new IPCIDR(cidrStr);
      // When a proper CIDR is passed, the host IP is the second IP address in the range.
      const toArrayOptions = {
        from: 1,
        limit: 1
      };
      // When an address and no subnet is passed, infer a /32.
      // The host IP is the first and only IP address in the range.
      const toArrayOptionsNoSubnet = {
        from: 0,
        limit: 1
      };

      if (!cidr.isValid()) {
        log.info(`Error: Invalid CIDR '${cidrStr}' passed to method getFirstIpAddress.`)
        callbackError = `Error: Invalid CIDR '${cidrStr}' passed to method getFirstIpAddress.`;
      } else {
        if (cidrStr.indexOf('/') === -1) {
          // A subnet length wasn't passed. Infer a /32 was intended.
          [firstIpAddress.ipv4] = cidr.toArray(toArrayOptionsNoSubnet);
        } else
          [firstIpAddress.ipv4] = cidr.toArray(toArrayOptions);
        firstIpAddress.ipv6 = getIpv4MappedIpv6Address(firstIpAddress.ipv4);
      }

    } else
      callbackError = `Error: Invalid CIDR '${cidrStr}' passed to method getFirstIpAddress.`;

    return callback(firstIpAddress, callbackError);
  }


  /**
   * Explains what arguments were passed for optional parameters.
   * @param {string} myString
   * @param {number} myNumber
   * @param {boolean} myBoolean
   * @param {array} myArray
   * @param {object} myObject
   * @param {string} myEnum
   * @param {*} myAnyType
   * @param {callback} callback - A callback function.
   * @return {object} (passedArgumentsDetails)
   */
  checkOptionalParams(myString, myNumber, myBoolean, myArray, myObject, myEnum, myAnyType, callback) {

    let callbackError = null;
    let callbackData = {
      "myString": null,
      "myNumber": null,
      "myBoolean": null,
      "myArray": null,
      "myObject": null,
      "myEnum": null,
      "myAnyType": null
    };

    if (typeof myString === 'undefined')
      callbackData.myString = "Parameter myString is undefined.";
    else
      callbackData.myString = "Parameter myString has data type: " + typeof myString + " with value: '" + myString + "'";

    if (typeof myNumber === 'undefined')
      callbackData.myNumber = "Parameter myNumber is undefined.";
    else
      callbackData.myNumber = "Parameter myNumber has data type: " + typeof myNumber + " with value: '" + myNumber + "'";

    if (typeof myBoolean === 'undefined')
      callbackData.myBoolean = "Parameter myBoolean is undefined.";
    else
      callbackData.myBoolean = "Parameter myBoolean has data type: " + typeof myBoolean + " with value: '" + myBoolean + "'";

    if (typeof myArray === 'undefined')
      callbackData.myArray = "Parameter myArray is undefined.";
    else
      callbackData.myArray = "Parameter myArray has data type: " + typeof myArray + " with value: '" + myArray + "'";

    if (typeof myObject === 'undefined')
      callbackData.myObject = "Parameter myObject is undefined.";
    else
      callbackData.myObject = "Parameter myObject has data type: " + typeof myObject + " with value: '" + myObject + "'";

    if (typeof myEnum === 'undefined')
      callbackData.myEnum = "Parameter myEnum is undefined.";
    else
      callbackData.myEnum = "Parameter myEnum has data type: " + typeof myEnum + " with value: '" + myEnum + "'";

    if (typeof myAnyType === 'undefined')
      callbackData.myAnyType = "Parameter myAnyType is undefined.";
    else
      callbackData.myAnyType = "Parameter myAnyType has data type: " + typeof myAnyType + " with value: '" + myAnyType + "'";

    return callback(callbackData, callbackError);
  }

}

module.exports = new IpAddress;