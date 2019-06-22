#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const fs = require('fs-extra')
const { execSync } = require('child_process');

const exampleDir = path.join(__dirname, 'example');
const runnerDir = path.dirname(__filename);
const args = process.argv.slice(2);
const appDir = path.join(process.cwd());

const log = function () {
  for (const key in arguments) {
    if (arguments.hasOwnProperty(key))
      console.log(arguments[key]);
  }
}

const error = msg => log(("Error: " + msg).red);

const copyExample = (file, to) => {
  fs.copySync(path.join(exampleDir, file), `${appDir}/${to}`)
}

log(
  '-----------------------------------------'.gray,
  'Taaj Installation'.blue.bold,
  'Sit back and let us do all the things.',
  '-----------------------------------------'.gray
);

try {
  log('   - Setting up configurations');
  const CurrentPackageJson = JSON.parse(fs.readFileSync(path.join(runnerDir, 'package.json')));
  const packageJson = JSON.parse(fs.readFileSync(path.join(exampleDir, 'package.json')));

  packageJson.dependencies.taaj = CurrentPackageJson.version;
  // packageJson.dependencies.taaj = 'file:/var/www/taaj';
  fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(packageJson, null, 2))

  log(('   - Installing ' + 'react'.cyan + ', ' + 'react-dom'.cyan + ', and ' + 'taaj'.cyan + '.').italic);
  log(('     this might take a couple of minutes').gray.italic);
  execSync(`npm install`, {
    cwd: appDir,
    stdio: 'pipe'
  });

  log(("   - Creating files in " + appDir.green).italic);
  copyExample('public', 'public');
  copyExample('src/Assets', 'src/Assets');
  copyExample('src/Controllers', 'src/Controllers');
  copyExample('src/Middlewares', 'src/Middlewares');
  copyExample('src/Reducers', 'src/Reducers');
  copyExample('src/Views', 'src/Views');

  copyExample('src/index.js', 'src/index.js');
  copyExample('src/routes.js', 'src/routes.js');
  copyExample('src/serviceWorker.js', 'src/serviceWorker.js');
} catch (e) {
  error(e);
}

log('');
log('Installation completed.'.bold);
log('you can run several commands:'.italic);
log('-----------------------------------------'.gray);

log('');
log('   npm start'.cyan);
log('     Starts the development server.');

log('');
log('   npm run build'.cyan);
log('     Bundles the app into static files for production.');

log('');
log('   npm test'.cyan);
log('     Starts the test runner.');