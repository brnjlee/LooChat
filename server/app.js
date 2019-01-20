const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const aws = require('aws-sdk');
let s3 = new aws.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});

mongoose.connect(process.env.URL, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

const messages = require('./routes/message');

const users = require('./routes/user');

app.use((req, res, next) => {
  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

app.use(passport.initialize());
require('./passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/messages', messages);

app.get('/', function(req, res) {
	res.send('hello');
});


/*----------SOCKET CONNECTION---------*/

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('enter conversations', (conversations) => {
        socket.join(conversations);
        console.log('joined ' + conversations);
    });

    socket.on('client-signal', (signal) => {
        console.log(`recieving signal to ${signal.conversation}`);
        socket.to(signal.conversation).emit('client-signal', signal)
    });

    socket.on('leave conversation', (conversation) => {
        socket.leave(conversation);
        console.log('left' + conversation);
    });

    socket.on('new message', (payload) => {
        console.log('message sent');
        socket.to(payload.conversationId).emit('new message', payload);
    });

    socket.on('request call', (conversation) => {
        console.log(`Call request sent to ${conversation.id}`);
        socket.to(conversation.id).emit('request call', conversation);
    });

    socket.on('accepted call', (conversation) => {
        console.log(`Call request accepted for ${conversation}`);
        socket.to(conversation).emit('accepted call');
    });

    socket.on('declined call', (conversation) => {
        console.log(`Call request declined for ${conversation}`);
        socket.to(conversation).emit('declined call');
    });

    socket.on('media ready', (conversation) => {
        console.log(`Media is ready for ${conversation}`);
        socket.to(conversation).emit('start call');
    });

    socket.on('stop call', (conversation) => {
        console.log(`Call stopped for ${conversation}`);
        socket.to(conversation).emit('stop call');
    });

    socket.on('disconnect', () => {
        console.log('user disconncted');
    });
});

const port = 5000;

server.listen(process.env.PORT ||port, () => {
  console.log('We are live on ' + port);
});



