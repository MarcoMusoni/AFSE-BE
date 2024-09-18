import { createUser } from "../data/mongo";

export async function newUser(req, res) {
    if (req.body && req.body.username && req.body.email && req.body.password && req.body.favouriteSuper) {


        let user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            favouriteSuper: req.body.favouriteSuper,
            credits: 0,
            packs: 0,
            cards: []
        }

        createUser(user)
            .then(user =>
                res.status(201).json({
                    id: user._id
                })
            ).catch(err => console.log(err));
    } else {
        res.status(400);
    }
}