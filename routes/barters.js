const { readAllBarters, readUserById, createBarter } = require("../data/mongo");

exports.retrieveBartersForUser = async function (req, res) {
  if (req.params.uid) {
    readAllBarters()
      .then((barters) => {
        if (barters) {
          readUserById(uid)
            .then((user) => {
              if (user) {
                let result = barters.map((barter) => {
                  if (!user.cards.some((card) => barter.in.includes(card.id))) {
                    return barter;
                  }
                });
                res.send(200).json({
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
};

exports.publishNewOffer = async function (req, res) {
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
            barterCode: barter[0]._id,
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
