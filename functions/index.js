const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp();


let db = admin.firestore();


const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));


app.post('/',
    (req, res) => {
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': 'https://api.cloudways.com/api/v1/oauth/access_token',
            'headers': {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ "email": functions.config().cloudway.email, "api_key": functions.config().cloudway.key, })

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);

            let data = JSON.parse(response.body);

            let docRef = db.collection('sites')

            docRef.add({
                token: data.access_token,
                email: req.body.email,
                name: req.body.name
            })
                .then(ref => {

                    return res.send(ref)


                })
                .catch(err => {

                    res.send(err)

                })


        });


    });


// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);




