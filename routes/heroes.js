var { getFromMarvel } = require("../data/marvel");
const { readUserById } = require("../data/mongo");

exports.retrieveReducedList = async function (req, res) {
  getFromMarvel()
    .then((response) => {
      let list = [];
      response.data.results.forEach((hero) => {
        list.push({
          id: hero.id,
          name: hero.name,
          imageURL: hero.thumbnail.path + hero.thumbnail.extension,
        });
      });
      res.send(200).json(list);
    })
    .catch((err) => console.log(err));
};

exports.retrieveHeroesForUser = async function (req, res) {
  if (req.params.uid) {
    getFromMarvel()
      .then((response) => {
        readUserById(req.params.uid)
          .then((user) => {
            if (user) {
              let list = [];
              let ids = user.cards.map((card) => card.id);
              response.data.results.forEach((hero) => {
                if (ids.includes(hero.id))
                  list.push(hero);
              });
              res.send(200).json(list);
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
};
