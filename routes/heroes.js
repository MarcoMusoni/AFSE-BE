var { getFromMarvel } = require("../data/marvel");
const { readUserById } = require("../data/mongo");

var express = require("express");
var router = express.Router();

router.get("/names", async function (req, res, next) {
  try {
    const response = await getFromMarvel();
    let list = [];
    response.data.results.forEach((hero) => {
      list.push({
        id: hero.id,
        name: hero.name,
        imageURL: hero.thumbnail.path + "." + hero.thumbnail.extension,
      });
    });
    res.json({ heroes: list });
  } catch (err) {
    return console.log(err);
  }
});

router.get("/:uid", function (req, res, next) {
  if (req.params.uid) {
    getFromMarvel()
      .then((response) => {
        readUserById(req.params.uid)
          .then((user) => {
            if (user) {
              let list = [];
              let ids = user.cards.map((card) => card.id);
              response.data.results.forEach((hero) => {
                if (ids.includes(hero.id)) {
                  let duplicates = user.cards.find((card) => card.id === hero.id).amount;
                  if(duplicates > 0) {
                    list.push({
                      id: hero.id,
                      duplicates: duplicates,
                      name: hero.name,
                      description: hero.description,
                      imageURL: hero.thumbnail.path + '.' + hero.thumbnail.extension,
                      comics: hero.comics.items.map((item) => item.name),
                      events: hero.events.items.map((item) => item.name),
                      series: hero.series.items.map((item) => item.name),
                    });
                  }
                }
              });
              res.json(list);
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

module.exports = router;
