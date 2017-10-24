const defaults = {
  template: true,
  css: true,
  javascript: true,
  vue: false,
  fractal: false,
};

module.exports = {
  files: {
    template: {
      name: '',
      postfix: 'template',
      extension: 'html',
      description: 'Modlr should create a Template File',
      default: defaults.template,
    },
    css: {
      name: '',
      postfix: 'style',
      extension: 'scss',
      description: 'Modlr should create Stylesheet File',
      default: defaults.css,
    },
    javascript: {
      name: '',
      postfix: 'script',
      extension: 'js',
      description: 'Modlr should create JavaScript File',
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
      atomic: 'atomic/',
      modules: 'modules/',
    },
  },
};

exports.defaults = defaults;
