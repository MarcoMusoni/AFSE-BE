var { readUserById, updateUser } = require("../data/mongo");

exports.updateCredit = async function (req, res) {
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
              res.send(200).json({
                newCreditAmount: newCredits,
                newPacksAmount: newPacks
              });
            } else {
              console.log(
                "[" +
                  Date.now().toLocaleString() +
                  "]" +
                  req.body.id +
                  " - " +
                  req.body.credits
              );
              res.send(200).json({
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
};

exports.cardSale = async function (req, res) {
  if (req.body.uid && req.body.id) {
    readUserById(req.body.uid)
      .then((user) => {
        let newCard = user.cards.filter((card) => card.id === req.body.id)[0];
        let newCardAmount = card.amount === 0 ? 0 : card.amount - 1;
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
          res.send(200).json({
            newCardAmount: newCardAmount,
            newCreditAmount: newCredits,
          })
        );
      })
      .catch((err) => console.log(err));
  } else {
    res.sendStatus(400);
  }
};
