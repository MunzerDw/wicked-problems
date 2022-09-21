const express = require('express')
const { Node, Log, Project, Invite, Label } = require('../Models')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const authorization = require('../Middlewares/authorization')
const publicAuthorization = require('../Middlewares/publicAuthorization')

const router = express.Router()

router.get('/', publicAuthorization, async (req, res) => {
  try {
    const { user, query } = req
    let data
    if (user) {
      data = await Label.findAll({
        where: {
          [Op.or]: [
            { userId: user.uid },
            { '$project.invites.guestId$': user.uid },
          ],
        },
        include: [
          {
            model: Project,
            as: 'project',
            where: {
              urlSafeName: query.urlSafeName,
            },
            include: [{ model: Invite, as: 'invites' }],
          },
        ],
      })
    } else {
      data = await Label.findAll({
        where: {
          '$project.public$': true,
        },
        include: [
          {
            model: Project,
            as: 'project',
            where: {
              urlSafeName: query.urlSafeName,
            },
          },
        ],
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

router.post('/', authorization, async (req, res) => {
  try {
    const { user, body } = req
    const id = uuidv4()
    const invite = await Invite.findAll({
      where: {
        projectId: body.projectId,
        guestId: user.uid,
      },
    })
    const data = { ...body, id: id, userId: invite[0]?.hostId || user.uid }
    const result = await Label.create(data)
    res.status(201).send(result.dataValues)
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
    const invite = await Invite.findAll({
      where: {
        guestId: user.uid,
      },
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Label,
              as: 'labels',
              where: { id: params.id },
            },
          ],
        },
      ],
    })
    const result = await Label.update(body, {
      where: { id: params.id, userId: invite[0]?.hostId || user.uid },
      returning: true,
    })
    if (result[0]) {
      res.status(200).send(body)
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'Label not found',
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
    const invite = await Invite.findAll({
      where: {
        guestId: user.uid,
      },
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Label,
              as: 'labels',
              where: { id: params.id },
            },
          ],
        },
      ],
    })
    const result = await Label.destroy({
      where: { id: params.id, userId: invite[0]?.hostId || user.uid },
    })
    if (result > 0) {
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: 'Could not delete label',
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
