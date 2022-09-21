const express = require('express')
const { Vote } = require('../Models')
const authorization = require('../Middlewares/authorization')

const router = express.Router()

router.put('/', authorization, async (req, res) => {
  try {
    const { user, body } = req
    Vote.upsert({
      nodeId: body.nodeId,
      userId: user?.uid,
      vote: body.vote,
    })
      .then((result) => {
        res.status(200).send(result[0].dataValues)
      })
      .catch((err) => {
        res.status(500).send({
          error: 'INTERNAL_SERVER_ERROR',
          statusCode: 500,
          message: err.message,
        })
      })
  } catch (error) {
    res.status(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      message: error.message,
    })
  }
})

module.exports = router
