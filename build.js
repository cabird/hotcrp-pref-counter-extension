const zipFolder = require('zip-folder');

const srcFolder = './src';
const zipFilePath = './extension.zip';

zipFolder(srcFolder, zipFilePath, function(err) {
    if(err) {
        console.error('Failed to zip folder:', err);
    } else {
        console.log('Zipped folder successfully!');
    }
});
