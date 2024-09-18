var { MongoClient, ServerApiVersion, UUID, ObjectId } = require("mongodb");

/**
 * Create MongoDb client and test connection
 */
const uri = "mongodb://localhost:27017/AFSE";

exports.dbUri = uri;

function makeClient() {
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

exports.dbInit = async function () {
  var dbClient = makeClient();
  try {
    // connection test
    await dbClient.connect();
    await dbClient.db().command({ ping: 1 });
    console.log("Database connected at: " + uri);

    // load dummy values
    console.log("Loaded data");
  } finally {
    dbClient.close();
  }
};

/**
 * User
 */
exports.createUser = async function (user) {
  var dbClient = makeClient();
  const dbUser = dbClient.db().collection("Users");
  try {
    return await dbUser.insert([user]);
  } finally {
    dbClient.close();
  }
};

exports.readUserById = async function (uid) {
  var dbClient = makeClient();
  const dbUser = dbClient.db().collection("Users");

  const query = { _id: { $eq: new ObjectId(uid) } };

  try {
    return await dbUser.findOne(query);
  } finally {
    dbClient.close();
  }
};

exports.readUserByUsernameAndEmail = async function (user, mail) {
  var dbClient = makeClient();
  const dbUser = dbClient.db().collection("Users");

  const query = {
    username: user,
    email: mail,
  };

  try {
    return await dbUser.findOne(query);
  } finally {
    dbClient.close();
  }
};

exports.readUserByUsernameOrEmail = async function (user, mail) {
  var dbClient = makeClient();
  const dbUser = dbClient.db().collection("Users");

  const query = {
    $or: [{ username: user }, { email: mail }],
  };

  try {
    return await dbUser.findOne(query);
  } finally {
    dbClient.close();
  }
};

exports.updateUser = async function (user) {
  var dbClient = makeClient();
  const dbUser = dbClient.db().collection("Users");
  try {
    await dbUser.insert([user]);
  } finally {
    dbClient.close();
  }
};

exports.deleteUser = async function (uid) {
  var dbClient = makeClient();
  const dbUser = dbClient.db().collection("Users");

  const query = { _id: { $eq: new ObjectId(uid) } };

  try {
    await dbUser.deleteOne(query);
  } finally {
    dbClient.close();
  }
};

/**
 * Barters
 */

exports.createBarter = async function (barter) {
  var dbClient = makeClient();
  const dbBarters = dbClient.db().collection("Barters");
  try {
    return await dbBarters.insert([barter]);
  } finally {
    dbClient.close();
  }
};

exports.readAllBarters = async function () {
  var dbClient = makeClient();
  const dbBarters = dbClient.db().collection("Barters");

  try {
    var list = [];
    const cursor = dbBarters.find({});
    while (cursor.hasNext()) {
      list.push(cursor.next());
    }
    return list;
  } finally {
    dbClient.close();
  }
};

exports.updateBarter = async function (barter) {
  var dbClient = makeClient();
  const dbBarters = dbClient.db().collection("Barters");
  try {
    await dbBarters.insert([barter]);
  } finally {
    dbClient.close();
  }
};

exports.deleteBarter = async function (bid) {
  var dbClient = makeClient();
  const dbBarters = dbClient.db().collection("Barters");

  const query = { _id: { $eq: new ObjectId(bid) } };

  try {
    await dbBarters.deleteOne(query);
  } finally {
    dbClient.close();
  }
};
