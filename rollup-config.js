const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const {minify} = require('uglify-es');
const sass = require('rollup-plugin-sass');
const uglifycss = require('uglifycss');
module.exports = (packageJson, fs) => {
    const {dependencies, name, main, format} = packageJson;
    return {
        input: {
            input: 'src/index.js',
            external: Object.keys(dependencies),
            plugins: [
                resolve(),
                sass({
                    output: function (styles, styleNodes) {
                        const cssPath = `dist/${name}.css`;
                        const uglifyPath = `dist/${name}.min.css`;
                        fs.writeFileSync(cssPath, styles);
                        const uglifiedCss = uglifycss.processFiles([cssPath]);
                        fs.writeFileSync(uglifyPath, uglifiedCss);
                    }
                }),
                babel({
                    exclude: 'node_modules/**'
                }),
                uglify({}, minify)
            ]
        },
        output: {
            file: `dist/${main}`,
            format,
            sourcemap: true
        }
    }
}