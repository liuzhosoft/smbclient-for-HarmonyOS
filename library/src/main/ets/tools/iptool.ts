export default class IpTool {
  public static intToIP(num) {
    var str;
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
  }

  public static isIp(str: string): boolean {
    if (str.length < 7 || str.length > 15) {
      return false;
    }

    var arr: string[] = str.split(".");
    if (arr.length != 4) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      var s = arr[i];
      for (let j = 0; j < s.length; j++) {
        if (s.charAt(j) < '0' || s.charAt(j) > '9') {
          return false;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      var temp = parseInt(arr[i]);
      if (temp < 0 || temp > 255) {
        return false;
      }
    }
    return true;
  }
}