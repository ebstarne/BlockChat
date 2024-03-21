const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Organization = require('../../models/Organization');
const Channel = require('../../models/Channel');

// @route   POST api/organizations
// @desc    Create a post
// @access  Public
router.post('/', async (req, res) => {
  try {
    // See if organization exists
    const name = req.body.name;
    let organization = await Organization.findOne({
      name,
    });

    if (organization) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Organization already exists',
          },
        ],
      });
    }

    const newOrganization = new Organization({
      name,
    });

    await newOrganization.save();

    res.json(newOrganization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/organizations
// @desc    Get all organizations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.find().sort({
      data: -1,
    });
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/organizations/:id
// @desc    Get organizations by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const organiztion = await Organization.findById(req.params.id);

    // if (!organiztion) {
    //   return res.status(404).json({
    //     msg: 'Organization not found',
    //   });
    // }

    res.json(organiztion);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Organization not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/organization/:id
// @desc    Delete an organiztion
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const organiztion = await Organization.findById(req.params.id);

    if (!organiztion) {
      return res.status(404).json({
        msg: 'Organization not found',
      });
    }

    await organiztion.remove();

    res.json({ msg: 'Organization removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Organiztion not found',
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/organizations/channels/:id
// @desc    Get all channels for given organization
// @access  Public
router.get('/', async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    res.json(organization.channels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/organiztions/channels/add/:id
// @desc    Add a channel to an organiztion
// @access  Public
router.put('/channels/add/:id', async (req, res) => {
  try {
    const channel = await Channel.findOne({ name: req.body.name });

    if (!channel) {
      return res.status(404).json({
        msg: 'Channel not found',
      });
    }

    const organization = await Organization.findById(req.params.id);

    // Check if organiztion already has channel added to it
    if (
      !_.isEmpty(
        organization.channels.filter(
          (ch) => ch.channel.toString() === channel.id.toString()
        )
      )
    ) {
      return res.status(400).json({
        msg: 'Channel already added to organization',
      });
    }

    organization.channels.unshift({
      channel: channel.id,
      name: channel.name,
    });

    await organization.save();

    res.json(organization.channels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/organizations/channels/remove/:id
// @desc    Removes a channel from an organiztion
// @access  Public
router.put('/channels/remove/:id', async (req, res) => {
  try {
    const channel = await Channel.findOne({ name: req.body.name });

    // if (!channel) {
    //   return res.status(404).json({
    //     msg: 'Channel not found',
    //   });
    // }

    const organization = await Organization.findById(req.params.id);

    // Check that organization has specified
    if (
      _.isEmpty(
        organization.channels.filter(
          (ch) => ch.channel.toString() === channel.id.toString()
        )
      )
    ) {
      return res.status(400).json({
        msg: 'Channel is not yet added to the organization',
      });
    }

    // Get remove index
    const removeIndex = organization.channels
      .map((ch) => ch.channel.toString())
      .indexOf(channel.id.toString());

    organization.channels.splice(removeIndex, 1);

    await organization.save();

    res.json(organization.channels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
