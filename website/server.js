var express = require('express');
var request = require('superagent');

var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/');

app.use(express.static(__dirname + '/public'));

var NON_INTERACTIVE_CLIENT_ID = 'kCA5dgjMzQlLKaC5uq6Zp9YHVTj1tEvc';
var NON_INTERACTIVE_CLIENT_SECRED = 'eTEI_gpKkfH6fGhyTqd72NoWpKxeH0-CcJ_NulRZaUwjoYk1HZZ68Io9vfeASwOi';

var authData = {
    client_id: NON_INTERACTIVE_CLIENT_ID,
    client_secret: NON_INTERACTIVE_CLIENT_SECRED,
    grant_type: 'client_credentials',
    audience: 'https://atlas.soucriador.com'
}

function getAccessToken(req, res, next){
    request
        .post('https://soucriador.auth0.com/oauth/token')
        .send(authData)
        .end(function(err, res){
            console.log('resposta');
            console.log(res.body.access_token);
            if(res.body.access_token){
                console.log("acesso autorizado");
                req.access_token = res.body.access_token;
                next();
            } else {
                res.send(401, 'Unauthorized');
            }
        })
}

app.get('/', function(req, res){
    res.render('index');
})

app.get('/movies', getAccessToken, function(req, res){
    request
    .get('http://localhost:8080/movies')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data){
        if(data.status == 403){
            res.send(403, '403 Forbidden');
        } else {
            var movies = data.body;
            console.log(data.body);
            res.render('movies', { movies : movies } );
        }
    })

})

app.get('/authors', getAccessToken, function(req, res){
    request
    .get('http://localhost:8080/reviewers')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data){
        if(data.status == 403){
            res.send(403, '403 Forbidden');
        } else {
            var authors = data.body;
            res.render('authors', { authors : authors } )
        }
    })
})

app.get('/publications', getAccessToken, function(req, res){
    request
    .get('http://localhost:8080/publications')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function (err, data){
        if(data.status == 403){
            res.send(403, '403 Forbidden');
        } else {
            var publications = data.body;
            res.render('publications', { publications : publications } )
        }
    })
})

app.get('/pending', getAccessToken, function(req, res){
    request
        .get('http://localhost:8080/pending')
        .set('Authorization', 'Bearer ' + req.access_token)
        .end(function(err, data){
            if(data.status == 403){
                res.send(403, '403 Forbidden');
            }
        })
})

app.listen(3000);