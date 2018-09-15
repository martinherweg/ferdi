const path = require('path');
const fs = require('fs-extra');
const { extension, append } = require('../src/appendToFile');

beforeEach(() => {
  const mocksDir = path.resolve('.', '__tests__', '__mocks__');
  fs.writeFileSync(mocksDir + '/test.scss', `@import 'test1.scss';
@import 'test2.scss';`, 'utf8');
});

afterEach(() => {
  fs.removeSync(path.resolve('.', '__tests__', '__mocks__', 'test.scss'));
});

describe('append to file tests', () => {
  it('gets the extension of the file', () => {
    const expectedExtension = extension('test.scss');
    expect(expectedExtension).toMatch(/scss/);
  });

  it('throws an error when no filename is provided', () => {
    expect(() => append({ importingFile: path.resolve('.', '__tests__', '__mocks__', 'test.scss') })).toThrow('No filename provided');
  });

  it('throws an error when no importing File is provided', () => {
    expect(() => append({ filename: 'foobar.scss' })).toThrow('No file to import to provided');
  });

  it('throws an error when file is not scss', () => {
    expect(() => append({ filename: 'appendedFile.js', importingFile: path.resolve('.', '__tests__', '__mocks__', 'test.scss') })).toThrow(`Can't import in files other than SCSS`);
  });

  it('adds new import to specified file', () => {
    append({ filename: 'appendedFile.scss', importingFile: path.resolve('.', '__tests__', '__mocks__', 'test.scss') });
    const file = fs.readFileSync(path.resolve('.', '__tests__', '__mocks__', 'test.scss'), 'utf8');
    expect(file).toMatchInlineSnapshot(`
"@import 'test1.scss';
@import 'test2.scss';
@import 'appendedFile.scss';
"
`);
  });
});
