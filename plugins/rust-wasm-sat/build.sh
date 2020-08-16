wasm-pack build

node << END
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('./pkg/package.json'));
json.name = "rust-wasm-sat-pkg";
fs.writeFileSync('./pkg/package.json', JSON.stringify(json));
END

cp -r ./pkg/* ../rust-wasm-sat-pkg