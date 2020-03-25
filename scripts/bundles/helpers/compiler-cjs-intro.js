var stencil = (function(exports) {
  'use strict';

  if (typeof globalThis === 'undefined') {
    if (typeof self !== 'undefined') {
      self.globalThis = self;
    } else if (typeof window !== 'undefined') {
      window.globalThis = window;
    } else if (typeof global !== 'undefined') {
      global.globalThis = global;
    }
  }

  (gbl => {
    if (!gbl.Buffer) {
      gbl.Buffer = {};
    }

    const process = gbl.process = (gbl.process || {});
    if (!process.argv) {
      process.argv = [''];
    }
    if (!process.binding) {
      process.binding = () => ({});
    }
    let cwd = '/';
    if (!process.cwd) {
      process.cwd = () => cwd;
    }
    if (!process.chdir) {
      process.chdir = (v) => cwd = v;
    }
    if (!process.env) {
      process.env = {};
    }
    if (!process.nextTick) {
      const resolved = Promise.resolve();
      process.nextTick = (cb) => resolved.then(cb);
    }
    if (!process.platform) {
      process.platform = 'stencil';
    }
    if (!process.version) {
      process.version = 'v12.0.0';
    }
    if (!gbl.__dirname) {
      gbl.__dirname = '/';
    }
    if (!gbl.__filename) {
      gbl.__filename = '/index.js';
    }
  })(globalThis);