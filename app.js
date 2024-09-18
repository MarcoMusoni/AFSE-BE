var express = require('express');
var cors = require('cors');

var { dbInit } = require('./data/mongo');
var { newUser, editUser, loginUser, removeUser } = require('./routes/user');
var { retrieveReducedList } = require('./routes/heroes');
var { updateCredit, cardSale } = require('./routes/credit');
var { retrieveBartersForUser } = require('./routes/barters');

const app = express();

app.use(express.json());

// CORS
app.use(cors());

// mongodb initializion
dbInit().catch(err => {
  console.log(err);
});

/*
 * Endpoints
 */

app.get('/user', loginUser);
app.post('/user', newUser);
app.put('/user', editUser);
app.delete('/user/:id', removeUser);

app.get('/heroes/names', retrieveReducedList);

app.post('/credit', updateCredit);
app.post('/credit/card', cardSale);

app.get('/barters/:uid', retrieveBartersForUser)

// app.get("/places", async (req, res) => {
//   await new Promise((resolve) => setTimeout(resolve, 3000));

//   const fileContent = await fs.readFile("./data/places.json");

//   const placesData = JSON.parse(fileContent);

//   res.status(200).json({ places: placesData });
// });

// app.get("/user-places", async (req, res) => {
//   const fileContent = await fs.readFile("./data/user-places.json");

//   const places = JSON.parse(fileContent);

//   res.status(200).json({ places });
// });

// app.put("/user-places", async (req, res) => {
//   const placeId = req.body.placeId;

//   const fileContent = await fs.readFile("./data/places.json");
//   const placesData = JSON.parse(fileContent);

//   const place = placesData.find((place) => place.id === placeId);

//   const userPlacesFileContent = await fs.readFile("./data/user-places.json");
//   const userPlacesData = JSON.parse(userPlacesFileContent);

//   let updatedUserPlaces = userPlacesData;

//   if (!userPlacesData.some((p) => p.id === place.id)) {
//     updatedUserPlaces = [...userPlacesData, place];
//   }

//   await fs.writeFile(
//     "./data/user-places.json",
//     JSON.stringify(updatedUserPlaces)
//   );

//   res.status(200).json({ userPlaces: updatedUserPlaces });
// });

// app.delete("/user-places/:id", async (req, res) => {
//   const placeId = req.params.id;

//   const userPlacesFileContent = await fs.readFile("./data/user-places.json");
//   const userPlacesData = JSON.parse(userPlacesFileContent);

//   const placeIndex = userPlacesData.findIndex((place) => place.id === placeId);

//   let updatedUserPlaces = userPlacesData;

//   if (placeIndex >= 0) {
//     updatedUserPlaces.splice(placeIndex, 1);
//   }

//   await fs.writeFile(
//     "./data/user-places.json",
//     JSON.stringify(updatedUserPlaces)
//   );

//   res.status(200).json({ userPlaces: updatedUserPlaces });
// });

app.listen(3000);
console.log('Listening on: http://localhost:3000');
