var {
  createUser,
  readUserByUsernameAndEmail,
  readUserByUsernameOrEmail,
  readUserById,
  updateUser,
  deleteUser,
} = require("../data/mongo");

exports.newUser = async function (req, res) {
  if (
    req.body &&
    req.body.username &&
    req.body.email &&
    req.body.password &&
    req.body.favouriteSuper
  ) {
    readUserByUsernameAndEmail(req.body.username, req.body.email)
      .then((user) => {
        if (!user) {
          let user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            favouriteSuper: req.body.favouriteSuper,
            credits: 0,
            packs: 0,
            cards: [],
          };
          createUser(user)
            .then((user) =>
              res.status(201).json({
                id: user._id,
              })
            )
            .catch((err) => console.log(err));
        } else {
          res.sendStatus(400);
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
};

exports.editUser = async function (req, res) {
  if (req.body && req.body.id) {
    readUserById(req.body.id)
      .then((user) => {
        if (user) {
          let newUser = {
            ...user,
            username: req.body.username || user.username,
            email: req.body.email || user.email,
            password: req.body.password || user.password,
            favouriteSuper: req.body.favouriteSuper || user.favouriteSuper,
          };
          updateUser(newUser)
            .then(() => res.sendStatus(204))
            .catch((err) => console.log(err));
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
};

exports.removeUser = async function (req, res) {
  if (req.params.id && req.headers.password) {
    readUserById(req.params.id)
      .then((user) => {
        if (user) {
          if (user.password === req.headers.password) {
            deleteUser(req.params.id)
              .then(() => res.sendStatus(204))
              .catch((err) => console.log(err));
          } else {
            res.sendStatus(401);
          }
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
};

exports.loginUser = async function (req, res) {
  if (req.headers.password && (req.headers.username || req.headers.email)) {
    readUserByUsernameOrEmail(req.headers.username, req.headers.email)
      .then((user) => {
        if (user) {
          if (user.password === req.headers.password) {
            res.status(200).json(user._id);
          } else {
            res.sendStatus(401);
          }
        } else {
          res.sendStatus(404);
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
};
