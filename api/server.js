// importa para o servidor os modulos do qual o mesmo depende
var express         = require('express');
var jwt             = require('express-jwt');
var rsaValidation   = require('auth0-api-jwt-rsa-validation');
var jwks            = require('jwks-rsa');
// cria uma instancia do express (para rodar o servidor)
var app = express();

// middleware para validar o token de acesso quando a API é invocada
var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://soucriador.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://atlas.soucriador.com',
    issuer: "https://soucriador.auth0.com/",
    algorithms: ['RS256']
});

// faz com que o middleware seja utilizado em todas as requisicoes da API
app.use(jwtCheck);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

var guard = function(req, res, next){
    switch(req.path){
        case '/movies' : {
            var permissions = ['general'];
            for(var i = 0; i < permissions.length; i++){
                if(req.user.scope.includes(permissions[i])){
                    next();
                } else {
                    res.send(403, {message: 'Forbidden'});
                }
            }
            break;
        }

        case '/reviwers' : {
            var permissions = ['general'];
            for(var i = 0; i < perissions.length; i++){
                if(req.user.scope.includes(permissions[i])){
                    next();
                } else {
                    res.send(403, {message: 'Forbidden'});
                }
            }
            break;
        }

        case '/publications' : {
            var permissions = ['general'];
            for(var i = 0; i < perissions.length; i++){
                if(req.user.scope.includes(permissions[i])){
                    next();
                } else {
                    res.send(403, {message: 'Forbidden'});
                }
            }
            break;
        }

        case '/pending' : {
            var permissions = ['general'];
            for(var i = 0; i < perissions.length; i++){
                if(req.user.scope.includes(permissions[i])){
                    next();
                } else {
                    res.send(403, {message: 'Forbidden'});
                }
            }
            break;
        }
    }
}

app.use(guard);

// caso nao utilize as credenciais corretamente, retornara a mensagem apropriada
app.use(function(err, req, res, next) {
    console.log(err.name);
    if(err.name === "UnauthorizedError") {
        res.status(401).json({message: 'Missing or invalid token'});
    }
});

// rotas
// implementa o endpoint da API de filmes
app.get('/movies', function(req, res){
    // pega uma lista com os filmes e suas respectivas notas
    var movies = [
        {title : 'Suicide Squad', release: '2016', score: 8, reviewer: 'Robert Smith', publication : 'The Daily Reviewer'},    
        {title : 'Batman vs. Superman', release : '2016', score: 6, reviewer: 'Chris Harris', publication : 'International Movie Critic'},
        {title : 'Captain America: Civil War', release: '2016', score: 9, reviewer: 'Janet Garcia', publication : 'MoviesNow'},
        {title : 'Deadpool', release: '2016', score: 9, reviewer: 'Andrew West', publication : 'MyNextReview'},
        {title : 'Avengers: Age of Ultron', release : '2015', score: 7, reviewer: 'Mindy Lee', publication: 'Movies n\' Games'},
        {title : 'Ant-Man', release: '2015', score: 8, reviewer: 'Martin Thomas', publication : 'TheOne'},
        {title : 'Guardians of the Galaxy', release : '2014', score: 10, reviewer: 'Anthony Miller', publication : 'ComicBookHero.com'},
    ]

    // retorna a resposta como um array no formato JSON
    res.json(movies);
})

// implementa o endpoint de revisores dos filmes
app.get('/reviewers', function(req, res){
    //retorna uma lista com os criticos
    var authors = [
        {name : 'Robert Smith', publication : 'The Daily Reviewer', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/angelcolberg/128.jpg'},
        {name: 'Chris Harris', publication : 'International Movie Critic', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/bungiwan/128.jpg'},
        {name: 'Janet Garcia', publication : 'MoviesNow', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/grrr_nl/128.jpg'},
        {name: 'Andrew West', publication : 'MyNextReview', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/d00maz/128.jpg'},
        {name: 'Mindy Lee', publication: 'Movies n\' Games', avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/laurengray/128.jpg'},
        {name: 'Martin Thomas', publication : 'TheOne', avatar : 'https://s3.amazonaws.com/uifaces/faces/twitter/karsh/128.jpg'},
        {name: 'Anthony Miller', publication : 'ComicBookHero.com', avatar : 'https://s3.amazonaws.com/uifaces/faces/twitter/9lessons/128.jpg'}
    ]

    // retorna uma lista dos revisores como um array no formato JSON
    res.json(authors);
})

app.get('/publications', function(req, res){
    var publications = [
        {name : 'The Daily Reviewer', avatar: 'glyphicon-eye-open'},
        {name : 'International Movie Critic', avatar: 'glyphicon-fire'},
        {name : 'MoviesNow', avatar: 'glyphicon-time'},
        {name : 'MyNextReview', avatar: 'glyphicon-record'},
        {name : 'Movies n\' Games', avatar: 'glyphicon-heart-empty'},
        {name : 'TheOne', avatar : 'glyphicon-globe'},
        {name : 'ComicBookHero.com', avatar : 'glyphicon-flash'}
    ]

    // retorna uma lista de publicacoes no formato JSON
    res.json(publications);
})

// implementa o endpoint de revisoes pendentes
app.get('pending', function(req, res){
    var pending = [
        {title : 'Superman: Homecoming', release: '2017', score: 10, reviewer: 'Chris Harris', publication: 'International Movie Critic'},
        {title : 'Wonder Woman', release: '2017', score: 8, reviewer: 'Martin Thomas', publication : 'TheOne'},
        {title : 'Doctor Strange', release : '2016', score: 7, reviewer: 'Anthony Miller', publication : 'ComicBookHero.com'}
    ]

    res.json(pending);
})

app.listen(8080);