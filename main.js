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

    const cidr = new IPCIDR(cidrStr);
    const options = {
        from: 1,
        limit: 1
    };

    if (!cidr.isValid()) {
        callbackError = `Error: Invalid CIDR '${cidrStr}' passed to method getFirstIpAddress.`;
    } else {
        [firstIpAddress.ipv4] = cidr.toArray(options);
        firstIpAddress.ipv6 = getIpv4MappedIpv6Address(firstIpAddress.ipv4);
    }

    return callback(firstIpAddress, callbackError);
  }

}

module.exports = new IpAddress;