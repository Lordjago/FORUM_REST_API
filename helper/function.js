// const path = require('path')
// import path from 'path'

// const fs = require('fs')

import fs from 'fs'

import path, { dirname } from 'path'

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));


export const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}

// module.exports = {clearImage}