const { MongoClient, ServerApiVersion } = require('mongodb');

/** 
 * User CRUD
 */
export async function createUser(user) {

}

export async function readUser(uid) {

}

export async function updateUser(user) {

}

export async function deleteUser(uid) {

}

/**
 * Barters CRUD
 */

export async function createBarter(barter) {

}

export async function readAllBarters() {

}

export async function updateBarter(barter) {

}

export async function deleteBarter(bid) {

}

/**
 * Create MongoDb client and test connection
 */
export const dbUri = 'mongodb://localhost:27017/AFSE';

export const dbClient = new MongoClient(dbUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export async function dbInit() {
    try {
        // connection test
        await dbClient.connect();
        await dbClient.db().command({ ping: 1 });
        console.log('Database connected at: ' + dbUri);

        // load dummy values
        console.log('Loaded data');
    } finally {
        dbClient.close();
    }
}