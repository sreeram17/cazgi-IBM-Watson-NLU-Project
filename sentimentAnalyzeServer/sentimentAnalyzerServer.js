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
    console.log(req.query.text);
    let analyzeParams = {
        'url': req.query.text,
        'features': {
            'emotion': {
                'document': true,
            }
        },
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(analysisResults.result);
        return res.send(analysisResults.result.emotion.document.emotion);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

//To do
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
            }
        },
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        var emoRes = analysisResults.result.emotion.document.emotion;
        //console.log(emoRes);
        return res.send(emoRes);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

app.get("/text/sentiment", (req,res) => {
    let naturalLanguageUnderstanding = getNLUInstance();
    console.log(req.query.text);
    let analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': {
                'document': true
            }
        },
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        var sentiRes = analysisResults.result.sentiment.document;
        //console.log(sentiRes);
        return res.send(sentiRes);
    })
    .catch(err => {
        console.log('error:', err);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

