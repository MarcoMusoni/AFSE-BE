var { MongoClient, ServerApiVersion } = require('mongodb');

/** 
 * User
 */
exports.createUser = async function (user) {

}

exports.readUserById = async function (uid) {

}

exports.readUserByUsernameAndEmail = async function (username, email) {

}

exports.updateUser = async function (user) {

}

exports.deleteUser = async function (uid) {

}

/**
 * Barters
 */

exports.createBarter = async function (barter) {

}

exports.readAllBarters = async function () {

}

exports.updateBarter = async function (barter) {

}

exports.deleteBarter = async function (bid) {

}

/**
 * Create MongoDb client and test connection
 */
const uri = 'mongodb://localhost:27017/AFSE';

exports.dbUri = uri;

var dbClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

exports.dbInit = async function () {
    try {
        // connection test
        await dbClient.connect();
        await dbClient.db().command({ ping: 1 });
        console.log('Database connected at: ' + uri);

        // load dummy values
        console.log('Loaded data');
    } finally {
        dbClient.close();
    }
}