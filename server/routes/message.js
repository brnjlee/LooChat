const express = require('express');
const router = express.Router();
const passport = require('passport');

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

router.post('/send_message/:conversationId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const message = new Message({
        conversationId: req.params.conversationId,
        author: req.user._id,
        content: req.body.content,
    });
    message.save(function(err, sentReply) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }
        res.status(200).json({ message: 'Reply successfully sent!' });
        return(next);
    });
});

router.get('/get_conversations',  passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Conversation.find({ participants: req.user._id }, ['_id', 'participants'], (err, conversations) => {
    if(err) {
      res.send({ error: err });
      return next(err);
    }
    if(conversations.length === 0) {
      return res.status(200).json({conversations})
    } else {
      let fullConversations = [];
      conversations.forEach(function(conversation) {
        Message.find({ 'conversationId': conversation._id })
            .sort('-createdAt')
            .limit(1)
            .populate({
                path: "author",
                select: "name"
            })
            .exec(function(err, message) {
                if (err) {
                    res.send({ error: err });
                    return next(err);
                }
                const copy = conversation.participants.slice();
                const id = copy.filter(word => String(word) !== String(req.user._id));
                let endpointId = `0${id}`;
                if(conversation.participants.length > 2) {
                    endpointId = `1${conversation._id}`
                }
                User.find({'_id': id }, ['name','avatar'], (err, user) => {
                    if(err) {
                        res.send({error: err});
                        return next(err);
                    }
                    message.push({ title: user });
                    message.push({endpointId });
                    fullConversations.push(message);
                    if(fullConversations.length === conversations.length) {
                        return res.status(200).json({ conversations: fullConversations });
                    }
                })
            });
      });
    }
    
  })
});

router.get('/get_conversation/:otherUserId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Conversation.find({participants: {$all: [req.params.otherUserId, req.user._id]}}, ['_id'], {limit: 1}, (err, conversation) => {
        if(err) {
          
        }
        if(conversation.length > 0) {
          User.find({'_id': req.params.otherUserId}, ['name'], (err, user) => {
            if(err) {
                res.send({error: err});
                return next(err);
            }
            Message.find({conversationId: conversation[0]._id})
                .select('createdAt content author')
                .sort('createdAt')
                .populate({
                    path: 'author',
                    select: 'name'
                })
                .exec((err, messages) => {
                    if(err) {
                        res.send({ error: err });
                        return next(err);
                    }

                    res.status(200).json({
                      conversationId: conversation[0].id,
                      conversation: messages,
                      title: user
                    });
                })
        });
        } else {
            User.findOne({'_id': req.params.otherUserId}, ['name'], (err, user) => {
              if(err) {
                res.send({error: err});
              }
              return res.status(200).json({
                title: user.name
               })

            })
        }
        

    })
});

router.get('/get_groupConversation/:conversationId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Message.find({ conversationId: req.params.conversationId })
        .select('createdAt content author')
        .sort('createdAt')
        .populate({
            path: 'author',
            select: 'name'
        })
        .exec(function(err, messages) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            res.status(200).json({ conversation: messages });
        });
});

router.post('/new_conversation/:recipient', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    if(!req.params.recipient) {
        res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
        return next();
    }

    if(!req.body.composedMessage) {
        res.status(422).send({ error: 'Please enter a message.' });
        return next();
    }
    const conversation = new Conversation({
        participants: [req.user._id, req.params.recipient]
    });
    conversation.save(function(err, newConversation) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }
        const message = new Message({
            conversationId: newConversation._id,
            content: req.body.composedMessage,
            author: req.user._id
        });
        message.save(function(err, newMessage) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }
            res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id });
            return next();
        });
    });
});

router.delete('/delete_conversation/:conversationId', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    Conversation.findOneAndRemove({
        $and : [
            { '_id': req.params.conversationId }, { 'participants': req.user._id }
        ]}, function(err) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        res.status(200).json({ message: 'Conversation removed!' });
        return next();
    });
});

module.exports = router;
