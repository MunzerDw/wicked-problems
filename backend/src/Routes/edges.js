const express = require('express')
const { Edge, Project, Invite } = require('../Models')
const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')
const { socketConnections } = require('../Services/realtime')
const authorization = require('../Middlewares/authorization')
const publicAuthorization = require('../Middlewares/publicAuthorization')

const router = express.Router()

router.get('/', publicAuthorization, async (req, res) => {
  try {
    const { user, query } = req
    let data
    if (user) {
      data = await Edge.findAll({
        where: {
          projectId: query.projectId,
          [Op.or]: [
            { userId: user.uid },
            { '$project.invites.guestId$': user.uid },
          ],
        },
        include: [
          {
            model: Project,
            as: 'project',
            include: [{ model: Invite, as: 'invites' }],
          },
        ],
      })
    } else {
      data = await Edge.findAll({
        where: {
          'projectId': query.projectId,
          '$project.public$': true,
        },
        include: [
          {
            model: Project,
            as: 'project',
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

router.get('/:id', authorization, async (req, res) => {
  try {
    const { user, params } = req
    let result
    if (user) {
      result = await Edge.findOne({
        where: {
          id: params.id,
          [Op.or]: [
            { userId: user.uid },
            { '$project.invites.guestId$': user.uid },
          ],
        },
        include: [
          {
            model: Project,
            as: 'project',
            include: [{ model: Invite, as: 'invites' }],
          },
        ],
      })
    } else {
      result = await Edge.findOne({
        where: {
          'id': params.id,
          '$project.public$': true,
        },
        include: [
          {
            model: Project,
            as: 'project',
          },
        ],
      })
    }
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send()
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
    const invite = await Invite.findAll({
      where: {
        projectId: body.projectId,
        guestId: user.uid,
      },
    })
    const data = {
      ...body,
      id: uuidv4(),
      userId: invite[0]?.hostId || user.uid,
    }
    const result = await Edge.create(data)
    socketConnections.sendToSockets(
      invite[0]?.hostId || user.uid,
      user.uid,
      'create-edge',
      data
    )
    res.status(201).send(result.dataValues)
  } catch (error) {
    res.status(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      message: error.message,
    })
  }
})

router.delete('/', authorization, async (req, res) => {
  try {
    const { user, body } = req
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
              model: Edge,
              as: 'edges',
              where: { id: body.ids },
            },
          ],
        },
      ],
    })
    const result = await Edge.destroy({
      where: { id: body.ids, userId: invite[0]?.hostId || user.uid },
    })
    if (result > 0) {
      socketConnections.sendToSockets(
        invite[0]?.hostId || user.uid,
        user.uid,
        'delete-edges',
        body.ids
      )
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: error.message,
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
              model: Edge,
              as: 'edges',
              where: { id: params.id },
            },
          ],
        },
      ],
    })
    const result = await Edge.update(body, {
      where: { id: params.id, userId: invite[0]?.hostId || user.uid },
      returning: true,
    })
    console.log(result)
    if (result[0]) {
      res.status(200).send(body)
    } else {
      res.status(404).send({
        error: 'INTERNAL_SERVER_ERROR',
        statusCode: 404,
        message: 'Edge not found',
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
