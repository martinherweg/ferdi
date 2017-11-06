const defaults = {
  template: true,
  css: true,
  javascript: true,
  vue: false,
  fractal: false,
};

module.exports = {
  fileHeader: {
    authors: 'AuthorName',
    projectName: 'ProjectName',
  },
  files: {
    template: {
      name: '',
      postfix: 'template',
      extension: 'html',
      description: 'moduli should create a Template File',
      default: defaults.template,
    },
    css: {
      name: '',
      postfix: 'style',
      extension: 'scss',
      description: 'moduli should create Stylesheet File',
      default: defaults.css,
    },
    javascript: {
      name: '',
      postfix: 'script',
      extension: 'js',
      description: 'moduli should create JavaScript File',
      default: defaults.javascript,
    },
    vue: {
      name: '',
      postfix: '',
      extension: 'vue',
      default: defaults.vue,
    },
    fractal: {
      name: '',
      postfix: 'config',
      extension: 'js',
      default: defaults.fractal,
    },
  },
  paths: {
    templateBase: 'tmpl/',
    modulePath: 'src/',
    pathOptions: {
      // the first character of each key works as an alias for the path so you could use `-a` as an alias for atomic
      atomic: 'atomic/',
      modules: 'modules/',
    },
  },
};

exports.defaults = defaults;
