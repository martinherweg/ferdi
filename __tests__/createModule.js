const spawn = require('spawn-command');
const path = require('path');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const config = require('../src/.ferdirc');

const CLI_PATH = require.resolve('../index');

afterEach(() => {
  fs.remove(path.resolve(__dirname, '../src/', config.paths.modulePath));
});

test('ferdi --help ', () =>
  runCli('--help').then(stdout => {
    expect(stdout).toMatchSnapshot('ferdi --help stdout');
  }));

describe('Create new Module', () => {
  test('it should use it defaults if no flags provided', () =>
    runCli('button', '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath}`;
      assert.file([`${basePath}button/_button-style.scss`, `${basePath}button/button-script.js`, `${basePath}button/button-template.html`]);
    }));

  test('it should use it defaults if no flags provided and a path option is added', () => {
    const moduleName = 'button';
    return runCli(`${moduleName} -m`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
      assert.file([`${basePath + moduleName}/_${moduleName}-style.scss`, `${basePath + moduleName}/${moduleName}-script.js`, `${basePath + moduleName}/${moduleName}-template.html`]);
    });
  });

  test('it should use not defaults if flag provided and a path option is added', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} -m --template`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
      assert.file([`${basePath + moduleName}/${moduleName}-template.html`]);
      assert.noFile([`${basePath + moduleName}/_${moduleName}-style.scss`, `${basePath + moduleName}/${moduleName}-script.js`]);
    });
  });

  test('it should use not defaults if flags provided and a path option is added', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} -m --template --css`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
      assert.file([`${basePath + moduleName}/_${moduleName}-style.scss`, `${basePath + moduleName}/${moduleName}-template.html`]);
      assert.noFile([`${basePath + moduleName}/${moduleName}-script.js`]);
    });
  });

  test('it should use not defaults if flags provided and no path option is added', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} --template --css`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath}`;
      assert.file([`${basePath + moduleName}/_${moduleName}-style.scss`, `${basePath + moduleName}/${moduleName}-template.html`]);
      assert.noFile([`${basePath + moduleName}/${moduleName}-script.js`]);
    });
  });
});

function runCli(args = '', cwd = process.cwd()) {
  const isRelative = cwd[0] !== '/';

  if (isRelative) {
    cwd = path.resolve(__dirname, cwd);
  }

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const command = `${CLI_PATH} ${args}`;
    const child = spawn(command, { cwd });
    child.on('error', error => {
      reject(error);
    });

    child.stdout.on('data', data => {
      stdout += data.toString();
    });

    child.stderr.on('data', data => {
      stderr += data.toString();
    });

    child.on('close', () => {
      if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}
