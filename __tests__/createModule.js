const spawn = require('spawn-command');
const path = require('path');
const {exec} = require('child_process');
const uuid = require('uuid');
const fs = require('fs-extra');
const assert = require('yeoman-assert');
const config = require('../src/.ferdirc');

const CLI_PATH = require.resolve('../index');

const SANDBOX = '__tests__/sandbox';

afterEach(() => {
  fs.remove(path.resolve(__dirname, '../src/', config.paths.modulePath));
});

test('ferdi --help ', () =>
  runCli('--help').then(stdout => {
    expect(stdout).toMatchSnapshot('ferdi --help stdout');
  }));

describe('new tests', () => {
  let sandboxDir = '';
  const filesToTestTemplate = [{ type: 'scss', suffix: '-style' },{ type: 'js', suffix: '-script' },{ type: 'html', suffix: '-template' },]
  let filesToTest = [];

  beforeEach(() => {
    sandboxDir = path.resolve(tmp());
    const configFile = path.resolve(__dirname, '..', 'src', '.ferdirc.js');
    const templatesFolder = path.resolve(__dirname, '..', 'src', 'templates');

    fs.copySync(configFile, `${sandboxDir  }/.ferdirc.js`);
    fs.copySync(templatesFolder, `${sandboxDir  }/templates`);
  });

  afterEach(() => {
    filesToTest = filesToTestTemplate;
    fs.removeSync(sandboxDir);
  });

  it('should execute something', async () => {
    const sandbox = sandboxDir;

    const result = await runCliNew(['button'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;
    assert.file([`${basePath}button/_button-style.scss`, `${basePath}button/button-script.js`, `${basePath}button/button-template.html`]);
  });

  it('it should use it defaults if no flags provided and a path option is added', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '-m'], sandbox);
    const basePath = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

    filesToTest.forEach(file => {
      assert.file(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should not use defaults if flag provided and a path option is added', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '-m', '--template'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

    filesToTest.filter(file => file.type === 'html')
      .forEach(file => {
        assert.file(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
      });

    filesToTest.filter(file => file.type !== 'html')
      .forEach(file => {
        assert.noFile(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
      });
  });

  it('it should not use defaults if non default flag provided and a path option is added', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '-m', '--vue'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

    filesToTest = [...filesToTest, { type: 'vue', suffix: config.files.vue.postfix}]

    filesToTest.filter(file => file.type === 'vue').forEach(file => {
      assert.file(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })

    filesToTest.filter(file => file.type !== 'vue').forEach(file => {
      assert.noFile(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should not use defaults if flags provided and a path option is added', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '-m', '--template', '--vue'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

    filesToTest = [...filesToTest, { type: 'vue', suffix: config.files.vue.postfix}];

    filesToTest.filter(file => file.type.match(/(vue|html)/g)).forEach(file => {
      assert.file(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })

    filesToTest.filter(file => file.type.match(/^(?!vue|html)/g)).forEach(file => {
      assert.noFile(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should not use defaults if flags provided and no path option is added', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '--template', '--vue'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;

    filesToTest = [...filesToTest, {type: 'vue', suffix: config.files.vue.postfix}];

    filesToTest.filter(file => file.type.match(/(vue|html)/g)).forEach(file => {
      assert.file(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })

    filesToTest.filter(file => file.type.match(/^(?!vue|html)/g)).forEach(file => {
      assert.noFile(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should create the component directly in the specified folder', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '--flat'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;

    filesToTest.forEach(file => {
      assert.file(`${basePath}${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should create the component directly in the specified folder if non default flag is provided', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '--vue', '--flat'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;

    filesToTest = [...filesToTest, { type: 'vue', suffix: config.files.vue.postfix}];

    filesToTest.filter(file => file.type.match(/(vue)/g)).forEach(file => {
      assert.file(`${basePath}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })

    filesToTest.filter(file => file.type.match(/^(?!vue)/g)).forEach(file => {
      assert.noFile(`${basePath}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should create the component directly in the specified folder without defaults', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '--css', '--flat'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;

    filesToTest.filter(file => file.type.match(/(scss)/g)).forEach(file => {
      assert.file(`${basePath}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })

    filesToTest.filter(file => file.type.match(/^(?!scss)/g)).forEach(file => {
      assert.noFile(`${basePath}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should create the component directly in the specified folder, even with pathOption', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '-m', '--flat'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

    filesToTest.forEach(file => {
      assert.file(`${basePath}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should create component specified in component path option', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'vueXModule';
    const result = await runCliNew([moduleName, '--vuexModule', '--flat'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;

    assert.file([`${basePath}js/store/modules/${moduleName}.js`]);

    filesToTest.forEach(file => {
      assert.noFile(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should create component specified in component path option in subfolder', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'vuexModule';
    const result = await runCliNew([moduleName, '--vuexModule'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;

    assert.file([`${basePath}js/store/modules/${moduleName}/${moduleName}.js`]);

    filesToTest.forEach(file => {
      assert.noFile(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })
  });

  it('it should create component specified in component path option even when path option is provided', async () => {
    const sandbox = sandboxDir;
    const moduleName = 'button';
    const result = await runCliNew([moduleName, '--vuexModule', '-m', '--flat'], sandbox);

    const basePath = `${sandbox}/${config.paths.modulePath}`;
    const basePathWithOption = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

    assert.file([`${basePath}js/store/modules/${moduleName}.js`]);

    filesToTest.forEach(file => {
      assert.noFile(`${basePath}${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);

      assert.noFile(`${basePath + moduleName}/${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);

      assert.noFile(`${basePathWithOption}${file.type === 'scss' ? '_' : ''}${moduleName}${file.suffix}.${file.type}`);
    })

    assert.noFile(`${basePathWithOption}js/store/modules/${moduleName}.js`);
  });

  describe('multiple Modules creation', () => {
    it('it should create multiple modules with same settings if multiple module names are provided', async () => {
      const sandbox = sandboxDir;
      const moduleName = 'button buttonBar buttonBaz';
      const result = await runCliNew([moduleName, '-m'], sandbox);

      const basePath = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

      const modules = moduleName.split(' ');

      modules.forEach(module => {
        filesToTest.forEach(file => {
          assert.file(`${basePath + module}/${file.type === 'scss' ? '_' : ''}${module}${file.suffix}.${file.type}`);
        })
      })
    });

    it('it should create multiple modules with same settings in same dir if multiple Modulesa are provided with --flat option', async () => {
      const sandbox = sandboxDir;
      const moduleName = 'button buttonBar buttonBaz';
      const result = await runCliNew([moduleName, '-m', '--flat'], sandbox);

      const basePath = `${sandbox}/${config.paths.modulePath + config.paths.pathOptions.modules}`;

      const modules = moduleName.split(' ');

      modules.forEach(module => {
        filesToTest.forEach(file => {
          assert.file(`${basePath}${file.type === 'scss' ? '_' : ''}${module}${file.suffix}.${file.type}`);
        })
      })
    });
  })

});

function runCliNew(args, cwd) {
  const resolvedCwd = path.resolve(cwd);
  return new Promise(resolve => {
    exec(
      `node ${path.resolve('./index.js')} ${args.join(' ')}`,{
        cwd: resolvedCwd,
      },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        });
      }
    );
  });
}

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

function tmp(ext) {
  ext = ext || '';
  const newPath = path.join(SANDBOX, uuid(), ext);
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath);
  }
  return newPath;
}
