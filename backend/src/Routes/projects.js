const express = require('express')
const { Project, Invite, Log, Node } = require('../Models')
const { v4: uuidv4 } = require('uuid')
const UrlSafeString = require('url-safe-string')
const { Op } = require('sequelize')
const authorization = require('../Middlewares/authorization')
const publicAuthorization = require('../Middlewares/publicAuthorization')

const router = express.Router()
const tagGenerator = new UrlSafeString()

router.get('/', publicAuthorization, async (req, res) => {
  try {
    const { user } = req
    let data
    if (user) {
      data = await Project.findAll({
        where: {
          [Op.or]: [{ '$invites.guestId$': user.uid }, { userId: user.uid }],
        },
        include: [
          { model: Invite, as: 'invites' },
          { model: Log, as: 'logs', include: [{ model: Node, as: 'node' }] },
        ],
      })
    } else {
      data = await Project.findAll({
        where: {
          public: true,
        },
        include: [{ model: Invite, as: 'invites', attributes: ['id'] }],
      })
    }
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      message: error.message,
    })
  }
})

router.get('/:urlSafeName', publicAuthorization, async (req, res) => {
  try {
    const { user, params } = req
    let result
    if (user) {
      const invite = await Invite.findAll({
        where: {
          guestId: user.uid,
        },
        include: [
          {
            model: Project,
            as: 'project',
            where: {
              urlSafeName: params.urlSafeName,
            },
          },
        ],
      })
      result = await Project.findOne({
        where: {
          urlSafeName: params.urlSafeName,
          userId: invite[0]?.hostId || user.uid,
        },
        include: [
          { model: Invite, as: 'invites' },
          { model: Log, as: 'logs', include: [{ model: Node, as: 'node' }] },
        ],
      })
    } else {
      result = await Project.findOne({
        where: {
          urlSafeName: params.urlSafeName,
          public: true,
        },
        include: [
          { model: Log, as: 'logs', attributes: ['type', 'createdAt'] },
          { model: Invite, as: 'invites', attributes: ['id'] },
        ],
      })
    }
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'Project not found',
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

router.post('/', authorization, async (req, res) => {
  try {
    const { user, body } = req
    if (body.name) {
      body.urlSafeName = tagGenerator.generate(body.name)
    }
    const data = { ...body, id: uuidv4(), userId: user.uid }
    if (body.name) {
      const result = await Project.create(data)
      res.status(201).send(result.dataValues)
    } else {
      res.status(400).send({
        error: 'MISSING_INPUT',
        statusCode: 400,
        message: 'Please add a name',
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

router.put('/:id', authorization, async (req, res) => {
  try {
    const { user, params, body } = req
    if (body.name) {
      body.urlSafeName = tagGenerator.generate(body.name)
    }
    const invite = await Invite.findAll({
      where: {
        projectId: params.id,
        guestId: user.uid,
      },
    })
    const result = await Project.update(body, {
      where: { id: params.id, userId: invite[0]?.hostId || user.uid },
    })
    if (result[0]) {
      res.status(200).send(body)
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'Project not found',
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
    const result = await Project.destroy({
      where: { id: params.id, userId: user.uid },
    })
    if (result === 1) {
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: 'Could not delete project',
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
