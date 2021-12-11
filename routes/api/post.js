const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const _ = require('lodash')

const auth = require('../../middleware/auth')

const User = require('../../models/User')
const Post = require('../../models/Post')
const { asyncForEach } = require('../../middleware/utils')

// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)

    const { text, images } = req.body

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      let user = await User.findById(req.user.id).select('-password')

      const isExistedPhotos = user.photos.length > 0

      if (isExistedPhotos) {
        let uploadedPhotos = user.photos.concat(images)

        const updatedFields = {
          photos: uploadedPhotos,
        }
        user = _.extend(user, updatedFields)
      } else {
        user.photos = images
      }

      await user.save()

      const newPost = new Post({
        text: text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
        photos: images,
      })

      const post = await newPost.save()

      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route   GET api/post
// @desc    Get all post
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })

    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   GET api/post/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.json(post)
  } catch (err) {
    console.error(err.message)

    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.status(500).send('Server error')
  }
})

// @route   DELETE api/post/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // check on user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorize' })
    }

    await post.remove()

    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)

    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.status(500).send('Server error')
  }
})

// @route   PUT api/post/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if post has already been like
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' })
    }

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   PUT api/post/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if post has already been like
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' })
    }

    // get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   POST api/post/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.id)

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      post.comments.unshift(newComment)

      await post.save()

      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route   DELETE api/post/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )

    // make sure comment exist
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' })
    }

    // check comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorize' })
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)

    post.comments.splice(removeIndex, 1)

    await post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route       POST api/post/upload-image
// @ desc       Post post images
// @access      Private
router.post('/upload-image', auth, async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No image uploaded' })
  }

  const file = req.files.file

  const fileName = `${Date.now()}-${file.name}`

  file.mv(`./uploads/${fileName}`, (err) => {
    if (err) {
      console.error(err)
      return res.status(500).send(err.msg)
    }

    res.json({ fileName: fileName, filePath: `/uploads/${fileName}` })
  })
})

// @route   GET api/post/get-by-user
// @desc    Get all post by userId
// @access  Private
router.get('/get-by-user/:userId', auth, async (req, res) => {
  const { userId } = req.params
  console.log(userId)
  try {
    const posts = await Post.find({ user: userId }).sort({ date: -1 })

    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   POST api/post/search
// @desc    Search posts by user
// @access  Private
router.post('/search', auth, async (req, res) => {
  const { term } = req.body

  let text = ''
  let name = ''
  let username = ''

  if (!!term) {
    text = new RegExp(term, 'i')
    name = new RegExp(term, 'i')
    username = new RegExp(term, 'i')
  }

  try {
    const users = await User.find({ email: username }).exec()

    if (users && users.length > 0) {
      let posts = []

      await asyncForEach(users, async (user) => {
        const post = await Post.findOne({ user: user._id }).exec()

        if (post) {
          posts.unshift(post)
        }
      })

      return res.status(200).json(posts)
    } else {
      const posts = await Post.find({ $or: [{ text }, { name }] }).exec()

      return res.status(200).json(posts)
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
