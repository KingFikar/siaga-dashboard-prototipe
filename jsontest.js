var j = require('jsonparse');
var p = process.argv[2];
try {
  var o = JSON.parse(p);
  console.log('OK features=' + o.features.length);
} catch (e) {
  console.log('ERR: ' + e.message);
}
