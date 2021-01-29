const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require ('ibm-watson/auth');
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    })
    return naturalLanguageUnderstanding;
}

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    let analyzeParams = {
        'url': req.data,
        'features': {
            'entities': {
                'emotion': true,
                'limit': 2,
            },
            'keywords': {
                'emotion': true,
                'limit': 2,
            },
        },
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        JSON.stringify(analysisResults, null, 2);
    })
    .catch(err => {
        console.log('error:', err);
    });
    return res.send(analysisResults);
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.text);
    let analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': {
                'document': true,
                'limit': 2,
            }
        },
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        return res.send(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
    });
    
    //return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

