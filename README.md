# ferdi

ferdi is a flexible component creation helper, it helps you to stay consistent in your component style and reduces the time required to create new components.

You create File Templates and ferdi will create Files you want in a Folder you define.

## Installation

You can install ferdi global or local.
_yarn_

```
yarn global add ferdi
```

_npm_

```
npm install -g ferdi
```

## Usage

```bash
$ferdi --help

Usage: ferdi [options]

Path Options
// differs depending on your config
--atomic, -a    ferdi creates Module at src/atoms/
--molecule, -m  ferdi creates Module at src/molecules/

Options:
  // differs depending on your config
  --flat        Create component Files in the Folder itself and not in a component named subfolder
  --template    ferdi should create a Template File
  --css         ferdi should create a Stylesheet File
  --help        output usage information
  --version     output the version number


Commands:
  new <name>    Create new Module
  init          Copy Config File to current Folder
  copy          Copy Example Templates to your Project
```

If you installed ferdi locally you have to add an npm script to use it or if you use yarn you could use it as `yarn ferdi <command>`.

To Start with ferdi please use `ferdi init` in your Project root, this will create a `.ferdirc.js` config file with some prefilled values.

The config contains 3 different parts `fileHeader`, `files` and `paths`

### fileHeader

In the file Header you can add Informations you want to use in your config File, the default Templates are using the Project Authors and Project Name (could be referenced by your package.json).
The file- and moduleName are added automatically.

### Available Data in Templates

- Everything you add to the File Header Object, in the default config `<%= projectName %>` and `<%= authors.[name, email] %>`
- `<%= file %>` the filename you used
- `<%= moduleName %>` the component Name
- `<% pathOptions %>` Every path Option you have in your config.
- `<%= modulePath %>` Path and Filename (without extension)

### Defaults – since version 0.0.8

In the .ferdirc.js File you can add an Object like this:

```
defaults: {
    template: true,
    css: true,
    javascript: true,
    vue: false,
    fractal: false,
  }
```

Every time you add a new component without any flags these default files are created (template, css and js in this case). The key must be the same as in the files Object.
Every key in the files Object must also be in the defaults Object.

### Multiple "Components"
If you want to add multiple Components with the same options you can do that by writing `ferdi foo bar --option` this creates a `foo` and a `bar` component

### files

This is where the 'magic' happens, ferdi create a new entry for every file type you wish to have a boilerplate for.
This is the format ferdi needs:

```
kind: {
      name: '', // if you define a name ferdi will take this as a base for the filename, if it is empty the last part of the path is taken as filename
      postfix: 'template', // gets added to the filename if you omit the name, leave empty if you don't want that
      extension: 'html', // extension to search for in the template folder and for the final module
      description: 'ferdi should create a Template File', // description for the --help flag
      path: 'js/store/modules' // Added in 0.0.15 | if file has a path option every path option provided by flag will be ignored and the module will be created in the specified folder. 
    },
```

You can now create new modules with `ferdi module/name --css --template --javascript`

### templates

If you want to create your own templates they have to be named like the key in the `files` object with `-template` attached to it.

If you have an object with the key `style` with the extension `.scss` your template needs to be named `style-template.scss`.

### paths

Define the path needed for ferdi

```
paths: {
    templateBase: 'tmpl/', // template folder relative to the .ferdirc file
    modulePath: 'src/', // output path for new modules relative to .ferdirc file
    // you can add multiple subfolders in this object, relative to the modulePath
    // the key is for the option
    pathOptions: {
      // the first character of each key works as an alias for the path so you could use `-a` as an alias for atomic
      atomic: 'atomic/',
      modules: 'modules/',
    },
  }
```

## Flat Option

If you add the `--flat` flag to your command the component files will get created in the specified folder instead of in a folder named after the component

## Examples

```
paths: {
    templateBase: 'tmpl/',
    modulePath: 'src/',
    pathOptions: {
      // the first character of each key works as an alias for the path so you could use `-a` as an alias for atomic
      atomic: 'atomic/',
      modules: 'modules/',
    },
  },
```

When you type `ferdi forms/input -a` your new component gets created in `/project/folder/src/atomic/forms/input` with filenames like this `input-template.html`, `_input-style.scss` or `input-script.js`
