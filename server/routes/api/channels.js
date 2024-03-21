const express = require('express');
const router = express.Router();
const Channel = require('../../models/Channel');

// @route   POST api/channels
// @desc    Create a channel
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    // See if organization exists
    let channel = await Channel.findOne({
      name,
    });

    if (channel) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Channel already exists',
          },
        ],
      });
    }

    const newChannel = new Channel({
      name,
      description,
    });

    await newChannel.save();

    res.json(newChannel);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/channels
// @desc    Get all channels available
// @access  Public
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.find().sort({
      data: -1,
    });
    res.json(channels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/channels/:id
// @desc    Get channels by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        msg: 'Channel not found',
      });
    }

    res.json(channel);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Channel not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/channel/:id
// @desc    Delete a channel
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        msg: 'Channel not found',
      });
    }

    await channel.remove();

    res.json({ msg: 'Channel removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Channel not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
