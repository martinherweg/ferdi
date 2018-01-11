module.exports = {
  defaults: {
    template: true,
    css: true,
    javascript: true,
    vue: false,
    fractal: false
  },
  fileHeader: {
    authors: [
      {
        name: 'Author',
        email: 'email'
      }
    ],
    projectName: 'ProjectName'
  },
  files: {
    template: {
      name: '',
      postfix: 'template',
      extension: 'html',
      description: 'ferdi should create a Template File'
    },
    css: {
      name: '',
      postfix: 'style',
      extension: 'scss',
      description: 'ferdi should create Stylesheet File'
    },
    javascript: {
      name: '',
      postfix: 'script',
      extension: 'js',
      description: 'ferdi should create JavaScript File'
    },
    vue: {
      name: '',
      postfix: '',
      extension: 'vue'
    },
    fractal: {
      name: '',
      postfix: 'config',
      extension: 'js'
    }
  },
  paths: {
    templateBase: 'templates/',
    modulePath: 'src/',
    pathOptions: {
      // the first character of each key works as an alias for the path so you could use `-a` as an alias for atomic
      atomic: 'atomic/',
      modules: 'modules/'
    }
  }
};
