# Modlr

Modlr is a flexible component creation helper, it helps you to stay consistent in your component style and reduces the time required to create new components.

You create File Templates and Modlr will create Files you want in a Folder you define.

## Installation
You can install modlr global or local.
*yarn*
```
yarn global add modlr
```

*npm*
```
npm install -g modlr
```

## Usage
To Start with modlr please use `modlr init` in your Project root, this will create a `.modlrrc.js` config file with some prefilled values. 

The config contains 3 different parts `fileHeader`, `files` and `paths`

### fileHeader
In the file Header you can add Informations you want to use in your config File, the default Templates are using the Project Authors and Project Name (could be referenced by your package.json).
The file- and moduleName are added automatically.

### files
This is where the 'magic' happens, modlr create a new entry for every file type you wish to have a boilerplate for.
This is the format modlr needs:
```
kind: {
      name: '', // if you define a name modlr will take this as a base for the filename, if it is empty the last part of the path is taken as filename
      postfix: 'template', // gets added to the filename if you omit the name, leave empty if you don't want that
      extension: 'html', // extension to search for in the template folder and for the final module
      description: 'Modlr should create a Template File', // description for the --help flag
      default: defaults.template, // true or false if you don't want to add the flag for every new module
    },
```

### paths
Define the path needed for modlr
```
paths: {
    templateBase: 'tmpl/', // template folder relative to the .modlrrc file
    modulePath: 'src/', // output path for new modules relative to .modlrrc file
    // you can add multiple subfolders in this object, relative to the modulePath
    // the key is for the option
    pathOptions: { 
      // the first character of each key works as an alias for the path so you could use `-a` as an alias for atomic
      atomic: 'atomic/',
      modules: 'modules/',
    },
  }
  ```


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

When you type `modlr forms/input -a` your new component gets created in `/project/folder/src/atomic/forms/input` with filenames like this `input-template.html`, `_input-style.scss` or `input-script.js`