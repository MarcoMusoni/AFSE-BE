var { readUserById, updateUser } = require("../data/mongo");

var express = require("express");
var router = express.Router();

router.post('/', function (req, res, next) {
  if (req.body.id && req.body.credits) {
    if (req.body.credits < 0 && !req.body.packs) {
      res.sendStatus(400);
    }
    readUserById(req.body.id)
      .then((user) => {
        if (user) {
          let newCredits = user.credits + req.body.credits;
          let newPacks = req.body.packs || 0 + user.packs;
          let newUser = {
            ...user,
            credits: newCredits,
            packs: newPacks
          };
          updateUser(newUser).then(() => {
            if (req.body.credits < 0) {
              res.json({
                newCreditAmount: newCredits,
                newPacksAmount: newPacks
              });
            } else {
              console.log(
                "[" +
                  new Date().toLocaleString() +
                  "] " +
                  req.body.id +
                  " - " +
                  req.body.credits
              );
              res.json({
                newCreditAmount: newCredits,
              });
            }
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

router.post('/card', function (req, res, next) {
  if (req.body.uid && req.body.id) {
    readUserById(req.body.uid)
      .then((user) => {
        let newCard = user.cards.filter((card) => card.id === req.body.id)[0];
        let newCardAmount = newCard.amount === 0 ? 0 : newCard.amount - 1;
        newCard = {
          ...newCard,
          amount: newCardAmount,
        };
        let newCards = user.cards.map((card) => {
          if (card.id === newCard.id) {
            return newCard;
          }
          return card;
        });

        let newCredits = user.credits + 5;
        let newUser = {
          ...user,
          credits: newCredits,
          cards: newCards,
        };
        updateUser(newUser).then(() =>
          res.json({
            newCardAmount: newCardAmount,
            newCreditAmount: newCredits,
          })
        );
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
