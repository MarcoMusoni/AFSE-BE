const { readAllBarters, readUserById, createBarter } = require("../data/mongo");

var express = require("express");
var router = express.Router();

router.get('/:uid', function (req, res, next) {
  if (req.params.uid) {
    readAllBarters()
      .then((barters) => {
        if (barters) {
          readUserById(req.params.uid)
            .then((user) => {
              if (user) {
                let result = barters.map((barter) => {
                  if (!user.cards.some((card) => card.amount > 0 && barter.in.includes(card.id))) {
                    return {
                      uid: barter.uid,
                      id: barter._id,
                      in: barter.in,
                      out: barter.out
                    };
                  }
                });
                res.json({
                  offers: result,
                });
              } else {
                res.sendStatus(404);
              }
            })
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

router.post('/', function (req, res, next) {
  if (req.body.uid && req.body.in && req.body.out) {
    let barter = {
      uid: req.body.uid,
      in: req.body.in,
      out: req.body.out,
    };
    createBarter(barter)
      .then((barter) => {
        if (barter) {
          res.status(201).json({
            barterCode: barter.insertedId,
          });
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
