const axios = require('axios');
const express = require('express');
const app = express();
const fs = require('fs');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Auth = () => {
    const queryParams = `client_id=${ process.env.CLIENT_ID }&scope=emoji:read`;
    return axios.get(`https://slack.com/oauth/authorize?${ queryParams }`)
}

const GetEmojis = () => {
    return axios.get('https://slack.com/api/emoji.list', {
        headers: {
            Authorization: `Bearer ${ process.env.ACCESS_TOKEN }`,
        },
    });
}

app.get('/', (req, res) => {
    GetEmojis()
        .then(resp => {
            let html = '';

            Object.entries(resp.data.emoji).map(([key, value]) => {
                html += `<img src="${ value }" alt="${ key }">`;
            });

            writeFile("emoji.json", JSON.stringify(resp.data.emoji));
            res.send(html);
        });
});

const writeFile = (filename, data) => {
    fs.writeFile(filename, data, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

app.get('/auth', (req, res) => {
    Auth().then(resp => {
        res.send(resp.data);
    })
})

app.listen(5000);