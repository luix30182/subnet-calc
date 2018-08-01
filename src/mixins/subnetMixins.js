export default {
  methods: {
    toDecimal: function (array) {
      var dec = []
      array.forEach(element => {
        dec.push(parseInt(element, 2));
      });
      return dec;
    },
    toBinary: function (array) {
      var temp = [];
      array.forEach(element => {
        var t = ("00000000" + (element >>> 0).toString(2)).slice(-8);
        temp.push(t);
      });
      return temp;
    },
    nToDecimal: function (s) {
      return parseInt(s, 2);
    },
    nToBinary: function (s) {
      return ('00000000' + s.toString(2)).slice(-8);
    },
    ipToString: function (array, ok) {
      var s = '';
      array.forEach(element => {
        if (ok == 1) {
          s += element + ' '
        } else if (ok == 2) {
          s += element + '.'
        } else {
          s += element
        }
      });
      if (ok == 1 || ok == 2) {
        s = s.substr(0, s.length - 1);
      }
      return s;
    },
    getPrefix: function (mask) {
      switch (mask) {
        case "0.0.0.0":
          return "0";
        case "128.0.0.0":
          return "1";
        case "192.0.0.0":
          return "2";
        case "224.0.0.0":
          return "3";
        case "240.0.0.0":
          return "4";
        case "248.0.0.0":
          return "5";
        case "252.0.0.0":
          return "6";
        case "254.0.0.0":
          return "7";
        case "255.0.0.0":
          return "8";
        case "255.128.0.0":
          return "9";
        case "255.192.0.0":
          return "10";
        case "255.224.0.0":
          return "11";
        case "255.240.0.0":
          return "12";
        case "255.248.0.0":
          return "13";
        case "255.252.0.0":
          return "14";
        case "255.254.0.0":
          return "15";
        case "255.255.0.0":
          return "16";
        case "255.255.128.0":
          return "17";
        case "255.255.192.0":
          return "18";
        case "255.255.224.0":
          return "19";
        case "255.255.240.0":
          return "20";
        case "255.255.248.0":
          return "21";
        case "255.255.252.0":
          return "22";
        case "255.255.254.0":
          return "23";
        case "255.255.255.0":
          return "24";
        case "255.255.255.128":
          return "25";
        case "255.255.255.192":
          return "26";
        case "255.255.255.224":
          return "27";
        case "255.255.255.240":
          return "28";
        case "255.255.255.248":
          return "29";
        case "255.255.255.252":
          return "30";
        case "255.255.255.254":
          return "31";
        case "255.255.255.255":
          return "32"
        default:
          return ''
      }
    },
    getMask: function (prefix) {
      switch (prefix) {
        case 1:
          return "128.0.0.0";
        case 2:
          return "192.0.0.0";
        case 3:
          return "224.0.0.0";
        case 4:
          return "240.0.0.0";
        case 5:
          return "248.0.0.0";
        case 6:
          return "252.0.0.0";
        case 7:
          return "254.0.0.0";
        case 8:
          return "255.0.0.0";
        case 9:
          return "255.128.0.0";
        case 10:
          return "255.192.0.0";
        case 11:
          return "255.224.0.0";
        case 12:
          return "255.240.0.0";
        case 13:
          return "255.248.0.0";
        case 14:
          return "255.252.0.0";
        case 15:
          return "255.254.0.0";
        case 16:
          return "255.255.0.0";
        case 17:
          return "255.255.128.0";
        case 18:
          return "255.255.192.0";
        case 19:
          return "255.255.224.0";
        case 20:
          return "255.255.240.0";
        case 21:
          return "255.255.248.0";
        case 22:
          return "255.255.252.0";
        case 23:
          return "255.255.254.0";
        case 24:
          return "255.255.255.0";
        case 25:
          return "255.255.255.128";
        case 26:
          return "255.255.255.192";
        case 27:
          return "255.255.255.224";
        case 28:
          return "255.255.255.240";
        case 29:
          return "255.255.255.248";
        case 30:
          return "255.255.255.252";
        case 31:
          return "255.255.255.254";
        case 32:
          return "255.255.255.255";
        default:
          return ""
      }
    },
    combinations: function (n) {
      var r = [];
      for (var i = 0; i < (1 << n); i++) {
        var c = [];
        for (var j = 0; j < n; j++) {
          c.push(i & (1 << j) ? '1' : '0');
        }
        r.push(c.join(''));
      }
      r = r.sort(function (a, b) {
        return a - b
      });
      return r;
    },
    invertSubmask: function (array) {
      var t = [];
      array.forEach(element => { //['11100000']
        var t2 = element.split(''); //['1','1','1','0','0','0','0','0']
        var t3 = [];
        for (var i = 0; i < t2.length; i++) {
          if (t2[i] == '1') {
            t3.push('0');
          } else {
            t3.push('1');
          }
        }
        //['00011111']
        t.push(t3.join(''));
      });
      return t;
    },
    subnetCalc: function (prefix, subnetBit, ip, host) {
      var ipNew = {
        net: [],
        broad: [],
        nP: 0,
        nM: ''
      };
      ipNew.nP = Number(prefix) + subnetBit;
      ipNew.nM = this.getMask(prefix);
      var s = this.ipToString(this.toBinary(ip));
      var r = this.combinations(subnetBit);
      var p1 = s.substring(0, Number(prefix));
      var p2 = s.substring(s.length - this.getHostN(host), s.length);
      r.forEach(element => {
        var t = (p1 + element + p2).split('');
        var t2 = ''
        for (var i = 0; i < t.length; i++) {
          if (i == 8 || i == 16 || i == 24) {
            t2 += '.';
          }
          t2 += t[i];
        }
        ipNew.net.push(this.ipToString(this.toDecimal(t2.split('.')), 2));
        ipNew.broad.push(this.ipToString(this.broadcasteCalc(this.toDecimal(t2.split('.')), ipNew.nP), 2));
      });
      return ipNew;
    },
    broadcasteCalc: function (subIp, prefix) {
      var binMaskinverted = this.invertSubmask(this.toBinary(this.getMask(prefix).split('.')));
      var plainIp = this.ipToString(this.toBinary(subIp), 3).split('');
      var plainIpMaskI = this.ipToString(binMaskinverted, 3).split('');
      var s = ''
      for (var i = 0; i < plainIp.length; i++) {
        if (i == 8 || i == 16 || i == 24) {
          s += '.'
        }
        if (plainIp[i] == 1 || plainIpMaskI[i] == 1) {
          s += '1';
        } else {
          s += '0';
        }
      }
      return this.toDecimal(s.split('.'));
    },
    findFirst: function (subIp) {
      var t = this.toBinary(subIp.split('.'));
      var t2 = t[t.length - 1].split('')
      t2[t2.length - 1] = '1';
      t2 = t2.join('');
      t[t.length - 1] = t2;
      return (t);
    },
    findLast: function (subIp) {
      var t = subIp.split('.');
      t[t.length - 1] = t[t.length - 1] - 1;
      return t;
    },
    getHostN: function (host) {
      var n = 0;
      var temp = 0;
      while ((temp - host) < 2) {
        n++;
        temp = 2 ** n;
      }
      return n;
    },
    getSubnetNumber: function (h, p) {
      return 32 - this.getHostN(h) - Number(p);
    }
  }
}