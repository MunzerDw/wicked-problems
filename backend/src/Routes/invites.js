const express = require('express')
const { Invite, Project } = require('../Models')
const admin = require('../Services/firebase')
const authorization = require('../Middlewares/authorization')

const router = express.Router()

router.post('/', authorization, async (req, res) => {
  try {
    const { user, body } = req
    const project = await Project.findOne({
      where: { id: body.projectId, userId: user.uid },
    })
    if (project) {
      admin
        .auth()
        .getUserByEmail(body.email)
        .then(async (userRecord) => {
          const data = {
            projectId: body.projectId,
            email: body.email,
            hostId: user.uid,
            guestId: userRecord.uid,
          }
          if (userRecord.uid === user.uid) {
            res.status(400).send({
              error: 'SELF_INVITATION',
              statusCode: 400,
              message: "You can't invite yourself lol.",
            })
          } else {
            const result = await Invite.create(data)
            res.status(201).send(result.dataValues)
          }
        })
        .catch(() => {
          res.status(400).send({
            error: 'USER_NOT_FOUND',
            statusCode: 400,
            message: 'No user is found with this given e-mail',
          })
        })
    } else {
      res.status(400).send({
        error: 'PROJECT_NOT_EXISTENT',
        statusCode: 400,
        message: 'Project ID does not exist',
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

router.delete('/:id', authorization, async (req, res) => {
  try {
    const { user, params } = req
    const result = await Invite.destroy({
      where: { id: params.id, hostId: user.uid },
    })
    if (result === 1) {
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: 'Could not delete invite',
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
