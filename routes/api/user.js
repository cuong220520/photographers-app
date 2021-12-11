const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../../models/User')
const auth = require('../../middleware/auth')

// @route   GET api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, role } = req.body

    try {
      let user = await User.findOne({ email })

      // see if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }

      // get user gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      user = new User({
        name,
        email,
        avatar,
        password,
        role,
      })

      // encrypt password using bcryptjs
      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route   GET api/users/all
// @desc    Get all users
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const users = await User.find().sort({ date: -1 })

    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router

// @route   GET api/users/:id
// @desc    Get user by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ _id: id }).sort({ date: -1 })

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    // remove post
    await Post.deleteMany({ user: id })

    // remove profile
    await Profile.findOneAndRemove({ user: id })

    // remove user
    await User.findOneAndRemove({ _id: id })

    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
