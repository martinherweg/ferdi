import spawn from 'spawn-command';
import path from 'path';
import fs from 'fs-extra';
import config from '../src/.ferdirc.js';
import {jest} from '@jest/globals'
import { createRequire } from "module";
import {fileURLToPath} from 'node:url';
const require = createRequire(import.meta.url);
const assert = require('yeoman-assert');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { pathname: CLI_PATH } = new URL('../index.js', import.meta.url);
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

  test('it should not use defaults if flag provided and a path option is added', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} -m --template`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
      assert.file([`${basePath + moduleName}/${moduleName}-template.html`]);
      assert.noFile([`${basePath + moduleName}/_${moduleName}-style.scss`, `${basePath + moduleName}/${moduleName}-script.js`]);
    });
  });

  test('it should not use defaults if non default flag provided and a path option is added', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} -m --vue`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
      assert.file([`${basePath + moduleName}/${moduleName}.vue`]);
      assert.noFile([`${basePath + moduleName}/${moduleName}-template.html`, `${basePath + moduleName}/_${moduleName}-style.scss`, `${basePath + moduleName}/${moduleName}-script.js`]);
    });
  });

  test('it should not use defaults if flags provided and a path option is added', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} -m --template --vue`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
      assert.file([`${basePath + moduleName}/${moduleName}.vue`, `${basePath + moduleName}/${moduleName}-template.html`]);
      assert.noFile([`${basePath + moduleName}/${moduleName}-script.js`]);
    });
  });

  test('it should not use defaults if flags provided and no path option is added', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} --template --vue`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath}`;
      assert.file([`${basePath + moduleName}/${moduleName}.vue`, `${basePath + moduleName}/${moduleName}-template.html`]);
      assert.noFile([`${basePath + moduleName}/${moduleName}-script.js`]);
    });
  });

  test('it should create the component directly in the specified folder', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} --flat`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath}`;
      assert.file([`${basePath}_${moduleName}-style.scss`, `${basePath}${moduleName}-template.html`, `${basePath}${moduleName}-script.js`]);
    });
  });

  test('it should create the component directly in the specified folder if non default flag is provided', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} --vue --flat`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath}`;
      assert.file([`${basePath}${moduleName}.vue`]);
      assert.noFile([`${basePath}_${moduleName}-style.scss`, `${basePath}${moduleName}-template.html`, `${basePath}${moduleName}-script.js`]);
    });
  });

  test('it should create the component directly in the specified folder without defaults', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} --css --flat`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath}`;
      assert.file([`${basePath}_${moduleName}-style.scss`]);
      assert.noFile([`${basePath}${moduleName}-template.html`, `${basePath}${moduleName}-script.js`]);
    });
  });

  test('it should create the component directly in the specified folder, even with pathOption', () => {
    const moduleName = 'buttonFoo';
    return runCli(`${moduleName} -m --flat`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
      assert.file([`${basePath}_${moduleName}-style.scss`, `${basePath}${moduleName}-template.html`, `${basePath}${moduleName}-script.js`]);
    });
  });

  test('it should create component specified in component path option', () => {
    const moduleName = 'vuxModule';

    return runCli(`${moduleName} --vuexModule --flat`, '../src')
      .then(stdout => {
        const basePath = `./src/${config.paths.modulePath}`;
        assert.file([`${basePath}js/store/modules/${moduleName}.js`]);
        assert.noFile([`${basePath}${moduleName}/${moduleName}-template.html`, `${basePath}${moduleName}/{moduleName}-script.js`]);
      })
  });

  test('it should create component specified in component path option in subfolder', () => {
    const moduleName = 'vuxModule';

    return runCli(`${moduleName} --vuexModule`, '../src')
      .then(stdout => {
        const basePath = `./src/${config.paths.modulePath}`;
        assert.file([`${basePath}js/store/modules/${moduleName}/${moduleName}.js`]);
        assert.noFile([`${basePath}${moduleName}/${moduleName}-template.html`, `${basePath}${moduleName}/{moduleName}-script.js`]);
      })
  });

  test('it should create component specified in component path option even when path option is provided', () => {
    const moduleName = 'vuxModule';

    return runCli(`${moduleName} --vuexModule -m --flat`, '../src')
      .then(stdout => {
        const basePath = `./src/${config.paths.modulePath}`;
        const basePathWithOption = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;
        assert.file([`${basePath}js/store/modules/${moduleName}.js`]);
        assert.noFile([
          `${basePath}${moduleName}/${moduleName}-template.html`,
          `${basePath}${moduleName}-template.html`,
          `${basePathWithOption}${moduleName}-template.html`,
          `${basePath}${moduleName}/{moduleName}-script.js`,
          `${basePathWithOption}${moduleName}/{moduleName}-script.js`,
          `${basePath}{moduleName}-script.js`,
          `${basePathWithOption}{moduleName}-script.js`,
          `${basePathWithOption}js/store/modules/${moduleName}.js`
        ]);
      })
  });
});



describe('create multiple modules with the same options', () => {
  test('it should create multiple modules with same settings if multiple module names are provided', () => {
    const moduleName = 'buttonFoo buttonBar buttonBaz';
    return runCli(`${moduleName} -m`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;

      const modules = moduleName.split(' ');

      modules.forEach(module => {
        assert.file([`${basePath + module}/_${module}-style.scss`]);
        assert.file([`${basePath + module}/${module}-template.html`]);
        assert.file([`${basePath + module}/${module}-script.js`]);
      });
    });
  });

  test('it should create multiple modules with same settings in same dir if multiple Modulesa are provided with --flat option', () => {
    const moduleName = 'buttonFoo buttonBar buttonBaz';
    return runCli(`${moduleName} -m --flat`, '../src').then(stdout => {
      const basePath = `./src/${config.paths.modulePath + config.paths.pathOptions.modules}`;

      const modules = moduleName.split(' ');

      modules.forEach(module => {
        assert.file([`${basePath}_${module}-style.scss`, `${basePath}${module}-template.html`, `${basePath}${module}-script.js`]);
      });
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
    const child = spawn(command, {
      cwd
    });

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
