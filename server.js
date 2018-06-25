const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');
const helmet = require('helmet');
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const notesRouter = require('./api/Notes/NotesRouter');
const UsersRouter = require('./api/Users/UsersRouter');

mongoose.connect('mongodb://localhost/lambdaNotes')
    .then(
        () => {
            console.log('***\n Portal to DB Established \n*** ')
        }
    )
    .catch(error => {
        errorMessage: error.message;
    })

const server = express();

const sessionOptions = {
    secret: 'If you build it, they will come',
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    resave: true,
    savedUninitialized: false,
    name: 'noname',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10
    }),
}

server.use(express.json());
server.use(session(sessionOptions));
server.use(cors({}));
server.use(helmet());
// server.use(morgan());
server.use('/notes', notesRouter);
server.use('/users', UsersRouter);

function protected(req, res, next) {
    if (req.session) {
        next();
    } else {
        res.status(401).json({
            message: 'An error occurred; please login again'
        })
    }
}

server
    .get('/', (req, res) => {
        res.json(`api: running`)
    })

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`API running on port ${port}`);
});
server.use(bodyParser.json());