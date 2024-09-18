var { createUser, readUserByUsernameAndEmail } = require('../data/mongo');

exports.newUser = async function (req, res) {
    if (req.body && req.body.username && req.body.email && req.body.password && req.body.favouriteSuper) {
        readUserByUsernameAndEmail(req.body.username, req.body.email)
            .then(user => {
                if (!user) {
                    let user = {
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        favouriteSuper: req.body.favouriteSuper,
                        credits: 0,
                        packs: 0,
                        cards: []
                    };
                    createUser(user)
                        .then(user =>
                            res.status(201).json({
                                id: user._id
                            })
                        ).catch(err => console.log(err));
                } else {
                    res.status(400).json({ msg: 'User already exists' });
                }
            }).catch(err => console.log(err));
    } else {
        res.status(400).json({ msg: 'Missing Data' });
    }
}

exports.editUser = async function (req, res) {
    if (req.body && req.body.id) {

    }
}
