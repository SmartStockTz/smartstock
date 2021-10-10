const bfast = require('bfast');
const pkg = require('package.json')
const {createReadStream} = require("fs");
const {join} = require("path");

bfast.init({
  applicationId: 'smartstock_lb',
  projectId: 'smartstock'
});

bfast.storage().save({
  filename: `smartstock_${pkg.version}.exe`,
  pn: true,
  data: createReadStream(join(__dirname, 'dist', `smartstock Setup ${pkg.version}.exe`))
}, progress => {
  console.log(progress);
}, {pn: true}).then(console.log).catch(console.log);
