import MsErref from './ms_erref';
import BigInt from './bigint';


var defaults = {

  successCode: 'STATUS_SUCCESS'

, parse: function (connection, cb) {

    var self = this;
    return function (response) {
      var h = response.getHeaders()
      // @ts-ignore
      var err = MsErref.getStatus(BigInt.fromBuffer(h.Status).toNumber())

      if (err.code == self.successCode) {
        self.onSuccess && self.onSuccess(connection, response);
        cb && cb(
          null
          , self.parseResponse && self.parseResponse(response)
        );
      } else {
        var error = new Error(MsErref.getErrorMessage(err));
        // @ts-ignore
        error.code = err.code;
        cb && cb(error);
      }
    }

  }

, parseResponse: function (response) {
    return response.getResponse();
  }
};

export function message(obj) {

  for (var key in defaults) {
    obj[key] = obj[key] || defaults[key];
  }

  return obj;
}
