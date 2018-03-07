'use strict';

const {rollup} = require('rollup');
const fs = require('fs');
const pkg = require('./package.json');
const getConfig = require('./rollup-config');


const build = async () => {
    //create new bundle
    const {input, output} = getConfig(pkg, fs);
    const {write} = await rollup(input);
    if (write) {
        await write(output);
    }
};


build();