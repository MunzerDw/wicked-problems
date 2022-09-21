const express = require('express')
const { Node, Log, Project, Invite } = require('../Models')
const { Op } = require('sequelize')
const authorization = require('../Middlewares/authorization')

const router = express.Router()

router.delete('/', authorization, async (req, res) => {
  try {
    const { user, body } = req
    const result = await Node.destroy({
      where: { projectId: body.projectId, userId: user.uid },
    })
    if (result === 1) {
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: 'Could not delete logs',
      })
    }
  } catch (error) {
    res.status(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      message: error.message,
    })
  }
})

module.exports = router
