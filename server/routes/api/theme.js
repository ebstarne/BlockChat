const express = require('express');
const router = express.Router();

const Theme = require('../../models/Theme');

// @route   GET api/theme/:name
// @desc    Get theme
// @access  Public
router.get('/:name', async (req, res) => {
  try {
    const theme = await Theme.findOne({ name: req.params.name });

    res.json(theme);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/theme
// @desc Create a theme
// @access Public
router.post('/', async (req, res) => {
  try {
    const { organization, name, palette } = req.body;

    const theme = new Theme({
      organization: organization,
      name: name,
      palette: palette,
    });

    await theme.save();

    res.json(theme);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
