const global = require('./src/_data/site'),
      outdent = require('outdent'),
      path = require('path'),
      Image = require('@11ty/eleventy-img');

module.exports = function(eleventyConfig) {
    // Copy
    eleventyConfig
        .addPassthroughCopy('./src/static/*.{woff,woff2}')
        .addPassthroughCopy("src/*.{png,svg,jpg,ico}")
        .addPassthroughCopy("src/site.webmanifest")
        .addPassthroughCopy("src/CNAME");
    
    // Image
    // Usage: {% image "static/file-name.jpg", "My alt…", "My caption…" %}
    eleventyConfig.addNunjucksAsyncShortcode('image', async (src, alt, caption) => {

        let stats = await Image(src, {
            widths: [960, 1280],
            formats: ["jpeg", "webp", "avif"],
            filenameFormat: function (id, src, width, format, options) {
                const extension = path.extname(src);
                const name = path.basename(src, extension);

                return `${name}-${width}w.${format}`;
            },
            urlPath: "/static/",
            outputDir: "./dist/static/",
        });
    
        let lowestSrc = stats["jpeg"][0];
    
        const srcset = Object.keys(stats).reduce(
            (acc, format) => ({
                ...acc,
                [format]: stats[format].reduce(
                    (_acc, curr) => `${_acc} ${curr.srcset} ,`,
                    ""
                ),
            }),
            {}
        );
    
        const sourceAVIF = `<source type="image/avif" srcset="${srcset["avif"]}" >`;
        const sourceWEBP = `<source type="image/webp" srcset="${srcset["webp"]}" >`;
    
        const img = `<img
            loading="lazy"
            decoding="async"
            alt="${alt}"
            src="${lowestSrc.url}"
            sizes='(min-width: 1280px) 1280px, 100vw'
            srcset="${srcset["jpeg"]}"
            width="${lowestSrc.width}"
            height="${lowestSrc.height}">`;

        return outdent`
            <figure>
                <picture>
                    ${sourceAVIF}
                    ${sourceWEBP}
                    ${img}
                </picture>
                ${caption ? `<figcaption class="t-container">${caption}</figcaption>` : ``}
            </figure>
        `;
    });

    // Configuration
    return {
        dir: {
            input: 'src',
            output: 'dist',
            data: '_data'
        }
    };
}