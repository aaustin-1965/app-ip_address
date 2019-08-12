/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const IPCIDR = require('ip-cidr');
const { getIpv4MappedIpv6Address} = require('./ipv6.js');

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
function getFirstIpAddress(cidrStr, callback) {

  let firstIpAddress = {
    ipv4: null,
    ipv6: null
  };
  let callbackError = null;

  const cidr = new IPCIDR(cidrStr);
  // Initialize options for the toArray() method.
  // We want an offset of one and a limit of one.
  // This returns an array with a single element, the first host address from the subnet.
  const options = {
    from: 1,
    limit: 1
  };

  if (!cidr.isValid()) {
    callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
  } else {
    [firstIpAddress.ipv4] = cidr.toArray(options);
    firstIpAddress.ipv6 = getIpv4MappedIpv6Address(firstIpAddress.ipv4);
  }
  return callback(firstIpAddress, callbackError);
}



/*
  This section is used to test function and log any errors.
  We will make several positive and negative tests.
*/
function main() {

  let sampleCidrs = ['172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.10.128/25', '192.168.1.216/30'];
  let sampleCidrsLen = sampleCidrs.length;

  let sampleIpv4s = [ '172.16.10.1', '172.16.10.0/24', '172.16.10.0 255.255.255.0', '172.16.256.1', '1.1.1.-1'];
  let sampleIpv4sLen = sampleIpv4s.length;

  // Iterate over sampleCidrs and pass the element's value to getFirstIpAddress().
  for (let i = 0; i < sampleCidrsLen; i++) {
    console.log(`\n--- Test Number ${i + 1} getFirstIpAddress(${sampleCidrs[i]}) ---`);
    getFirstIpAddress(sampleCidrs[i], (data, error) => {
      if (error) {
        console.error(`  Error returned from GET request: ${error}`);
      }
      console.log('  Response returned from GET request: ' + JSON.stringify(data));
    });
  }
  // Iterate over sampleIpv4s and pass the element's value to getIpv4MappedIpv6Address().
  for (let i = 0; i < sampleIpv4sLen; i++) {
    console.log(`\n--- Test Number ${i + 1} getIpv4MappedIpv6Address(${sampleIpv4s[i]}) ---`);
    // Assign the function results to a variable so we can check if a string or null was returned.
    let mappedAddress = getIpv4MappedIpv6Address(sampleIpv4s[i]);
    if( mappedAddress ) {
      console.log(`  IPv4 ${sampleIpv4s[i]} mapped to IPv6 Address: ${mappedAddress}`);
    } else {
      console.error(`  Problem converting IPv4 ${sampleIpv4s[i]} into a mapped IPv6 address.`);
    }
  }
}



/*
  Call main to run it.
*/
main();