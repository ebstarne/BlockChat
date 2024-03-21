const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const {
  postMessageToBlockchainChannel,
  updateMessageNumbers,
} = require('../../blockchain/api/messageTransaction');

const User = require('../../models/User');
const Message = require('../../models/Message');
const Channel = require('../../models/Channel');

// @route   POST api/messages
// @desc    Post a message
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required').notEmpty(),
      check('channel', 'Channel is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const organization = req.body.organization;
      let orgId;
      if (organization === 'Galactic Empire') {
        orgId = 'GE';
      } else if (organization === 'Rebel Alliance') {
        orgId = 'RA';
      } else if (organization === 'Trade Federation') {
        orgId = 'TF';
      }

      const channel_doc = await Channel.findById(req.body.channel);
      const messageNumber = channel_doc.messageNumbers[orgId] + 1;

      if (channel_doc.name === 'Private') {
        // Private channel
        const sio = req.app.get('sio');
        const message = new Message({
          text: req.body.text,
          username: req.user.username,
          user: req.user.id,
          channel: req.body.channel,
          date: req.body.date,
          organization: req.body.organization,
          messageNumber: messageNumber,
        });

        // Save message to local database
        await message.save();
        await updateMessageNumbers(orgId, message, channel_doc.name);

        // send the message through the socket
        sio.to(message.channel).emit('message', message);

        res.json(message);
      } else {
        // Blockchain channel

        // Save message to the blockchain
        await postMessageToBlockchainChannel(
          channel_doc.id,
          req.body.username,
          messageNumber,
          req.body.text
        );
        res.send('Message Successfully Transmitted To Blockchain');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/messages
// @desc    Get all message
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({
      data: -1,
    });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/:id
// @desc    Get message by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        msg: 'Message not found',
      });
    }

    res.json(message);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Message not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/user/:user_id
// @desc    Get messages by user
// @access  Private
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    // See if user exists
    let user = await User.findById(req.params.user_id);

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User does not exist',
          },
        ],
      });
    }

    const messages = await Message.find({ user: req.params.user_id });

    

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages/channel/:channel_id
// @desc    Get messages by channel
// @access  Private
router.get('/channel/:channel_id', auth, async (req, res) => {
  try {
    // See if channel exists
    let channel = await Channel.findById(req.params.channel_id);

    if (!channel) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Channel does not exist',
          },
        ],
      });
    }

    const messages = await Message.find({ channel: req.params.channel_id });
    messages.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);

      return parseInt(aDate.getTime()) - parseInt(bDate.getTime());
    });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    // Check User
    if (message.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'User not authorized',
      });
    }

    if (!message) {
      return res.status(404).json({
        msg: 'Message not found',
      });
    }

    await message.remove();

    res.json({
      msg: 'Message removed',
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Message not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
