var { getFromMarvel } = require('../data/marvel');

exports.retrieveReducedList = async function (req, res) {
    getFromMarvel()
        .then((response) => {
            let list = [];
            response.data.results.forEach((hero) => {
                list.push({
                    id: hero.id,
                    name: hero.name,
                    imageURL: hero.thumbnail.path + hero.thumbnail.extension
                });
            });
            res.send(200).json(list);
        })
        .catch(err => console.log(err));
}