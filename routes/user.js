var {
  createUser,
  readUserByUsernameAndEmail,
  readUserByUsernameOrEmail,
  readUserById,
  updateUser,
  deleteUser,
} = require("../data/mongo");

var express = require("express");
var router = express.Router();

router.post('/', function (req, res, next) {
  console.log(">>> " + JSON.stringify(req.body));
  if (
    req.body &&
    req.body.username &&
    req.body.email &&
    req.body.password &&
    req.body.favouriteSuper
  ) {
    readUserByUsernameAndEmail(req.body.username, req.body.email)
      .then((user) => {
        console.log(">>> " + user);
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
            .then((created) => {
              console.log('>>> ' + JSON.stringify(created));
              res.json({
                id: created.insertedId,
              });
            })
            .catch((err) => console.log(err));
        } else {
          res.sendStatus(400);
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
});

router.put('/', function (req, res, next) {
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
});

router.delete('/:id', function (req, res, next) {
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
});

router.get('/', function (req, res, next) {
  if (req.headers.password && (req.headers.username || req.headers.email)) {
    readUserByUsernameOrEmail(req.headers.username, req.headers.email)
      .then((user) => {
        console.log('>>> ' + JSON.stringify(req.headers));
        console.log('>>> ' + JSON.stringify(user));
        if (user) {
          if (user.password === req.headers.password) {
            res.status(200).json({
              uid: user._id,
              credits: user.credits,
              packs: user.packs
            });
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
});

module.exports = router;
