process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';


const fs      = require('fs-extra'),
      webpack = require('webpack'),
      chalk   = require('chalk'),
      config  = require('../config/webpack.config'),
      paths   = require('../config/paths');

// Ensures that a directory is empty. 
// Deletes directory contents if the directory is not empty. 
// If the directory does not exist, it is created. 
// The directory itself is not deleted.
fs.emptyDirSync('www');

// Merge with the public folder
fs.copySync( paths.appPublic, paths.appBuild , {
    dereference: true,
    filter: file => file !== paths.appHtml
});

let compiler = webpack(config);
let time = Date.now();


compiler.run( ( error, status) => {

    if ( error )
        return console.log(chalk.red(error));

    let message = status.toJson({}, true);

    if ( message.errors.length > 0 ){
        return console.log(chalk.red(message.errors.join('\n\n')));
    };

    if ( message.warnings.length > 0 ){
        console.log(chalk.yellow(message.warnings.join('\n\n')));
    }

    console.log(chalk.green(`Success to compile within ${(Date.now()-time)/1000} seconds. `));

});