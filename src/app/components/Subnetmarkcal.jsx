"use client";

import React, { useState } from 'react';

const IPSubnetCalculator = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.1');
  const [cidr, setCidr] = useState('24');
  const [results, setResults] = useState(null);

  const checkIpType = (ip) => {
    const octets = ip.split('.').map(Number);
    
    // Check for private IP ranges
    // 10.0.0.0 - 10.255.255.255 (10/8 prefix)
    if (octets[0] === 10) {
      return 'Private (Class A)';
    }
    
    // 172.16.0.0 - 172.31.255.255 (172.16/12 prefix)
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) {
      return 'Private (Class B)';
    }
    
    // 192.168.0.0 - 192.168.255.255 (192.168/16 prefix)
    if (octets[0] === 192 && octets[1] === 168) {
      return 'Private (Class C)';
    }
    
    // 100.64.0.0 - 100.127.255.255 (Carrier-grade NAT)
    if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) {
      return 'Shared Address Space (CGNAT)';
    }
    
    // 127.0.0.0 - 127.255.255.255 (Loopback)
    if (octets[0] === 127) {
      return 'Loopback';
    }
    
    // 169.254.0.0 - 169.254.255.255 (Link Local)
    if (octets[0] === 169 && octets[1] === 254) {
      return 'APIPA (Link Local)';
    }
    
    // 224.0.0.0 - 239.255.255.255 (Multicast)
    if (octets[0] >= 224 && octets[0] <= 239) {
      return 'Multicast';
    }
    
    // 240.0.0.0 - 255.255.255.255 (Reserved)
    if (octets[0] >= 240) {
      return 'Reserved';
    }
    
    // 0.0.0.0 - 0.255.255.255 (Software)
    if (octets[0] === 0) {
      return 'Software';
    }
    
    // Everything else is public
    return 'Public';
  };

  // Convert CIDR to subnet mask
  function cidrToSubnetMask(cidr) {
    const bits = '1'.repeat(parseInt(cidr)) + '0'.repeat(32 - parseInt(cidr));
    let mask = [];
    for (let i = 0; i < 32; i += 8) {
      mask.push(parseInt(bits.substring(i, i + 8), 2));
    }
    return mask.join('.');
  }

  // Create subnet mask options for dropdown
  const cidrOptions = [];
  for (let i = 0; i <= 32; i++) {
    const mask = cidrToSubnetMask(i);
    cidrOptions.push({
      value: i.toString(),
      label: `/${i} (${mask})`
    });
  }

  const handleCidrChange = (e) => {
    const value = e.target.value;
    setCidr(value);
  };

  const calculateSubnet = () => {
    try {
      const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const ipMatch = ipAddress.match(ipRegex);
      
      if (!ipMatch) {
        throw new Error('Invalid IP address format');
      }
      
      const octets = ipMatch.slice(1).map(Number);
      if (octets.some(octet => octet < 0 || octet > 255)) {
          throw new Error('IP address octets must be between 0 and 255');
      }

      const cidrNum = parseInt(cidr, 10);
      if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
        throw new Error('CIDR must be between 0 and 32');
      }
      
      const ipNum = octets.reduce((acc, octet) => (acc << 8) + octet, 0) >>> 0;
      
      const mask = cidrNum === 0 ? 0 : (~0 << (32 - cidrNum)) >>> 0;
      
      const networkNum = ipNum & mask;
      const broadcastNum = networkNum | (~mask);
      
      const firstHostNum = cidrNum <= 30 ? networkNum + 1 : networkNum;
      const lastHostNum = cidrNum <= 30 ? broadcastNum - 1 : broadcastNum;
      
      const numHosts = cidrNum >= 31 ? 0 : Math.pow(2, 32 - cidrNum) - 2;
      
      const numToIp = (num) => {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255
        ].join('.');
      };
      
      const maskDotted = numToIp(mask);
      
      const generateBinaryMask = (num) => {
        const octets = [];
        for (let i = 24; i >= 0; i -= 8) {
          const octet = ((num >>> i) & 255).toString(2).padStart(8, '0');
          octets.push(octet);
        }
        return octets.join('.');
      };

      const ipType = checkIpType(ipAddress);
      
      setResults({
        networkAddress: numToIp(networkNum),
        broadcastAddress: numToIp(broadcastNum),
        firstHostAddress: numHosts > 0 ? numToIp(firstHostNum) : 'N/A',
        lastHostAddress: numHosts > 0 ? numToIp(lastHostNum) : 'N/A',
        subnetMask: maskDotted,
        numHosts: Math.max(0, numHosts),
        cidr: `/${cidrNum}`,
        totalHosts: numHosts + 2,
        binaryMask: generateBinaryMask(mask),
        ipType: ipType
      });
    } catch (error) {
      setResults({
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">IP Subnet Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ip-address">
          IP Address:
        </label>
        <input
          id="ip-address"
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g. 192.168.1.1"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cidr">
          Subnet:
        </label>
        <div className="relative">
          <select
            id="cidr"
            value={cidr}
            onChange={handleCidrChange}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            {cidrOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <button
          onClick={calculateSubnet}
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Calculate
        </button>
      </div>
      
      {results && (
        <div className="mt-8">
          {results.error ? (
            <div className="text-red-500 font-bold">{results.error}</div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Results:</h3>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="text-gray-700 font-bold">IP Type:</div>
                <div>{results.ipType}</div>
                
                <div className="text-gray-700 font-bold">Network Address:</div>
                <div>{results.networkAddress}</div>
                
                <div className="text-gray-700 font-bold">Broadcast Address:</div>
                <div>{results.broadcastAddress}</div>
                
                <div className="text-gray-700 font-bold">Range of available Hosts:</div>
                <div>{`${results.firstHostAddress} - ${results.lastHostAddress}`}</div>
        
                <div className="text-gray-700 font-bold">Subnet Mask:</div>
                <div>{results.subnetMask}</div>
                
                <div className="text-gray-700 font-bold">Subnet:</div>
                <div>{results.cidr}</div>
                
                <div className="text-gray-700 font-bold">Total Hosts:</div>
                <div>{results.totalHosts}</div>

                <div className="text-gray-700 font-bold">Total available Hosts:</div>
                <div>{results.numHosts}</div>
                
                <div className="text-gray-700 font-bold">Binary Subnet Mask:</div>
                <div className="text-xs">{results.binaryMask}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IPSubnetCalculator;