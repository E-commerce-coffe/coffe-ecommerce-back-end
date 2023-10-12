const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    
    sbaseUrl: 'http://localhost:3000',
    etupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
