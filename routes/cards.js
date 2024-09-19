const { getFromMarvel } = require("../data/marvel");
const { readUserById, updateUser, deleteBarter } = require("../data/mongo");

var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  if (req.body.uid) {
    getFromMarvel()
      .then((response) => {
        readUserById(req.body.uid)
          .then((user) => {
            console.log(">>> " + JSON.stringify(user));
            if (user.packs === 0) {
              res.json({
                success: false,
              });
            }
            let heroes = response.data.results;
            if (user) {
              let newCards = [];
              for (let i = 0; i < 6; i++) {
                let randIndex = randomInt(heroes.length);
                let hid = heroes[randIndex].id;
                newCards = addCard(user.cards, hid);
              }
              let newPacks = user.packs - 1;
              let newUser = {
                ...user,
                cards: newCards,
                packs: newPacks,
              };
              console.log(">>> " + JSON.stringify(newUser));

              updateUser(newUser)
                .then(() =>
                  res.sendStatus(204)
                )
                .catch((err) => console.log(err));
            } else {
              res.sendStatus(404);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
});

router.put("/", async function (req, res, next) {
  if (
    req.body.bid & req.body.uidIn &&
    req.body.uidOut &&
    req.body.offer &&
    req.body.offer.in &&
    req.body.offer.out
  ) {
    readUserById(req.body.uidIn)
      .then((userIn) => {
        readUserById(req.body.uidOut)
          .then((userOut) => {
            if (!userIn || !userOut) {
              res.sendStatus(404);
            }

            let last = req.body.offer.in.pop();
            let cardsIn = addCard(userIn.cards, last);
            req.body.offer.in.forEach((hid) => {
              cardsIn = addCard(cardsIn, hid);
            });
            req.body.offer.in.push(last);

            last = req.body.offer.out.pop();
            let cardsOut = addCard(userIn.cards, last);
            req.body.offer.out.forEach((hid) => {
              cardsOut = addCard(cardsOut, hid);
            });
            req.body.offer.out.push(last);

            cardsIn = removeCards(cardsIn, req.body.offer.out);
            cardsOut = removeCards(cardsIn, req.body.offer.in);

            let newUserIn = {
              ...userIn,
              cards: cardsIn,
            };
            let newuserOut = {
              ...userOut,
              cards: cardsOut,
            };

            updateUser(newUserIn);
            updateUser(newuserOut);
            deleteBarter(req.body.bid)
              .then(() =>
                res.json({
                  success: true,
                })
              )
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
});

function removeCards(cards, idsToRemove) {
  return cards.map((card) => {
    if (idsToRemove.includes(card.id)) {
      let newAmount = card.amount - 1 < 0 ? 0 : card.amount - 1;
      return {
        ...card,
        amount: newAmount,
      };
    }
    return card;
  });
}

function addCard(cards, hid) {
  let newCards = cards;
  if (newCards.map((c) => c.id).includes(hid)) {
    newCards.map((card) => {
      if (card.id === hid) {
        let newAmount = card.amount + 1;
        return {
          ...card,
          amount: newAmount,
        };
      } else {
        return card;
      }
    });
  } else {
    newCards.push({
      id: hid,
      amount: 1,
    });
  }

  return newCards;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = router;
