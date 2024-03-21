const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Organization = require('../../models/Organization');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('username', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
    // check('organization', 'Organization is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const {
      username,
      email,
      password,
      // organization: organizationName,
    } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({
        username,
        // 'organization.name': organizationName,
      });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User already exists',
            },
          ],
        });
      }
      // TODO: find a way to not hardcode this
      const orgMap = {
        GE: 'Galactic Empire',
        TF: 'Trade Federation',
        RA: 'Rebel Alliance',
      };
      const organizationName = orgMap[process.env.ORG];
      
      const organizationQuery = await Organization.findOne({
        name: organizationName,
      }).select('-channels');
      
      const organization = {
        id: organizationQuery.id,
        name: organizationQuery.name,
      };

      const newUser = new User({
        username,
        email,
        organization,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
