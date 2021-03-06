const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const request = require('request')
const config = require('config')

const auth = require('../../middleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const { asyncForEach } = require('../../middleware/utils')

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(404).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = req.body

    // build profile object
    const profileFields = {}

    profileFields.user = req.user.id

    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubUsername) profileFields.githubUsername = githubUsername
    if (skills) {
      profileFields.skills = skills
        .split(',')
        .map((skill) => skill.trim().toUpperCase())
    }

    // build social object
    profileFields.social = {}

    // if (!profileFields.social) {
    //     profileFields.social = null
    // }

    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (instagram) profileFields.social.instagram = instagram
    if (twitter) profileFields.social.twitter = twitter
    if (linkedin) profileFields.social.linkedin = linkedin

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      // update profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )

        return res.json(profile)
      }

      // create profile
      profile = new Profile(profileFields)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    let profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   GET api/profile/:user_id
// @desc    Get profile by user_id
// @access  Public
router.get('/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)

    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Profile not found' })
    }

    res.status(500).send('Server error')
  }
})

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // remove post
    await Post.deleteMany({ user: req.user.id })

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id })

    // remove user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   PUT api/profile/experience
// @desc    Add profile's experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, company, location, from, to, description } = req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.experience.unshift(newExp)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)
// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile's experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   PUT api/profile/education
// @desc    Add profile's education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body

    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.education.unshift(newEdu)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete profile's education
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'nodejs' },
    }

    request(options, (error, response, body) => {
      if (error) {
        console.error(error)
      }

      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: 'No Github profile found' })
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   GET api/profile/search
// @desc    Search profile by username, skill, address
// @access  Private
router.post('/search', auth, async (req, res) => {
  const { term } = req.body

  let username = ''
  let location = ''
  let skills = []

  if (!!term) {
    if (term.startsWith('[') && term.endsWith(']')) {
      skills = term.slice(1, -1)

      if (skills.includes(',')) {
        skills.split(',').map((skill) => skill.toUpperCase().trim())
      } else {
        skills = [skills.toUpperCase()]
      }
    } else {
      username = new RegExp(term, 'i')
      location = new RegExp(term, 'i')
    }
  }

  try {
    const users = await User.find({ email: username }).exec()

    if (users && users.length > 0) {
      let profiles = []

      await asyncForEach(users, async (user) => {
        const profile = await Profile.findOne({ user: user._id })
          .populate('user', ['name', 'avatar'])
          .exec()

        if (profile) {
          profiles.unshift(profile)
        }
      })

      return res.status(200).json(profiles)
    } else {
      const profiles = await Profile.find({
        $or: [{ location }, { skills: { $in: skills } }],
      })
        .populate('user', ['name', 'avatar'])
        .exec()

      return res.status(200).json(profiles)
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   GET api/profile/list-by-skill
// @desc    Get profiles by skill
// @access  Public
router.get('/list/skill', auth, async (req, res) => {
  try {
    const skills = await Profile.distinct('skills').exec()

    if (skills && skills.length > 0) {
      let skillCounts = new Map()

      await asyncForEach(skills, async (skill) => {
        const count = await Profile.count({ skills: { $in: skill } }).exec()

        skillCounts.set(skill, count)
      })

      return res.status(200).json({
        skillCounts: Array.from(skillCounts, ([skill, count]) => ({
          skill,
          count,
        })),
      })
    }
  } catch (err) {
    console.error(err.message)

    res.status(500).send('Server error')
  }
})

module.exports = router
