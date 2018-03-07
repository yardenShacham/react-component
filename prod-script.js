const fs = require('fs');
const packageJson = require('./package.json');
const {increaseVersion} = require('./helpers');
const oldVersion = packageJson.version;
const updateVersion = ({packageJson}) => packageJson.version = increaseVersion(packageJson.version);

const updateDevFiles = () => {
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, '  '), 'utf-8');
};

const updateProdFiles = ({packageJson}) => {
    delete packageJson.private;
    delete packageJson.devDependencies;
    delete packageJson.scripts;
    delete packageJson.babel;
    fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, '  '), 'utf-8');
    fs.writeFileSync('dist/LICENSE', fs.readFileSync('LICENSE', 'utf-8'), 'utf-8');
};

updateVersion({packageJson});
updateDevFiles({packageJson});
updateProdFiles({packageJson});
const message = oldVersion !== packageJson.version ? `build completed successfully\n version:${packageJson.version}` : "build faild!!!"
console.log(message);