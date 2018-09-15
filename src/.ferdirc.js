module.exports = {
  defaults: {
    template: true,
    css: true,
    javascript: true,
    vue: false,
    fractal: false,
    vuexModule: false,
  },
  fileHeader: {
    authors: [{
      name: 'Author',
      email: 'email'
    }],
    projectName: 'ProjectName'
  },
  files: {
    template: {
      name: '',
      postfix: '-template',
      extension: 'html',
      description: 'ferdi should create a Template File'
    },
    css: {
      name: '',
      postfix: '-style',
      extension: 'scss',
      description: 'ferdi should create Stylesheet File'
    },
    javascript: {
      name: '',
      postfix: '-script',
      extension: 'js',
      description: 'ferdi should create JavaScript File'
    },
    vue: {
      name: '',
      postfix: '',
      extension: 'vue'
    },
    vuexModule: {
      name: '',
      postfix: '',
      extension: 'js',
      path: 'js/store/modules/',
    },
    fractal: {
      name: '',
      postfix: 'config',
      extension: 'js'
    }
  },
  importingFiles: {
    // this is just an example and should be modified to your needs
    // it indicates that other file types than scss are supported but that is not true at the moment
    scss: {
      components: {
        // path to the file the the import should be added to
        path: '',
        // if not provided files are imported relative to the above file
        // you could add an webpack alias here for example
        prefix: '',
      },
    },
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
