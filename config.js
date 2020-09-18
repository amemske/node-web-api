/* 

* create and export config variables 

*/


//container for all the environments
const environments = {}


// stagind environment object

environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging'
};

//production environment

environments.production = {
    'httpPort' : 5000,
    'httpsPort': 5001,
    'envName' : 'production'
};


//which one to use
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check that current environment is set to one of the above
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging ;

//export the module

module.exports = environmentToExport;

