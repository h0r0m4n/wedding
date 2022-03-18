const global = require('./src/_data/site');

module.exports = function(eleventyConfig) {
    // Configuration
    return {
        dir: { input: 'src', output: 'dist', data: '_data' },
        markdownTemplateEngine: 'njk'
    };
}