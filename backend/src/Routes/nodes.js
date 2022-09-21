const express = require('express')
const {
  Node,
  Vote,
  Log,
  Evidence,
  Project,
  Invite,
  Label,
} = require('../Models')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const { socketConnections } = require('../Services/realtime')
const { Op } = require('sequelize')
const authorization = require('../Middlewares/authorization')
const publicAuthorization = require('../Middlewares/publicAuthorization')

const router = express.Router()

router.get('/', publicAuthorization, async (req, res) => {
  try {
    const { user, query } = req
    let data
    if (user) {
      data = await Node.findAll({
        where: {
          projectId: query.projectId,
          [Op.or]: [
            { userId: user.uid },
            { '$project.invites.guestId$': user.uid },
          ],
        },
        include: [
          { model: Vote, as: 'votes' },
          { model: Label, as: 'label' },
          { model: Evidence, as: 'evidences' },
          {
            model: Project,
            as: 'project',
            include: [{ model: Invite, as: 'invites' }],
          },
        ],
      })
    } else {
      data = await Node.findAll({
        where: {
          'projectId': query.projectId,
          '$project.public$': true,
        },
        include: [
          { model: Vote, as: 'votes' },
          { model: Label, as: 'label' },
          { model: Evidence, as: 'evidences' },
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

router.get('/:id', publicAuthorization, async (req, res) => {
  try {
    const { user, params } = req
    const result = await Node.findOne({
      where: {
        id: params.id,
        [Op.or]: [
          { userId: user.uid },
          { '$project.invites.guestId$': user.uid },
        ],
      },
      include: [
        { model: Vote, as: 'votes' },
        { model: Evidence, as: 'evidences' },
        {
          model: Project,
          as: 'project',
          include: [{ model: Invite, as: 'invites' }],
        },
      ],
    })
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'Node not found',
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
    const id = uuidv4()
    const invite = await Invite.findOne({
      where: {
        projectId: body.projectId,
        guestId: user.uid,
      },
    })
    const data = { ...body, id: id, userId: invite?.hostId || user.uid }
    const result = await Node.create(data)
    Log.create({
      projectId: data.projectId,
      userId: user.uid,
      nodeId: id,
      type: 'CREATE',
      details: { type: body.type },
    })
    socketConnections.sendToSockets(
      invite?.project?.userId || user.uid,
      user.uid,
      'create-node',
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

router.put('/select/:id', authorization, async (req, res) => {
  try {
    const { user, params, body } = req
    const invites = await Invite.findAll({
      where: {
        guestId: user.uid,
      },
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Node,
              as: 'nodes',
              where: { id: params.id }
            },
          ],
        },
      ],
    })
    const invite = invites.find((invite) => invite.project)
    await Node.update(
      { selectedBy: null },
      {
        where: {
          userId: invite?.project?.userId || user.uid,
          projectId: body.projectId,
          selectedBy: user.uid,
        },
      }
    )
    const result = await Node.update(
      {
        selectedBy: user.uid,
      },
      {
        where: { id: params.id, userId: invite?.project?.userId || user.uid },
      }
    )
    if (result[0]) {
      socketConnections.sendToSockets(
        invite?.project?.userId || user.uid,
        user.uid,
        'update-node',
        params.id,
        { selectedBy: user.uid }
      )
      res.status(200).send({ selectedBy: user.uid })
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'Node not found',
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

router.put('/deselect/:id', authorization, async (req, res) => {
  try {
    const { user, params, body } = req
    const invites = await Invite.findAll({
      where: {
        guestId: user.uid,
      },
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Node,
              as: 'nodes',
              where: { id: params.id }
            },
          ],
        },
      ],
    })
    const invite = invites.find((invite) => invite.project)
    await Node.update(
      { selectedBy: null },
      {
        where: {
          userId: invite?.project?.userId || user.uid,
          projectId: body.projectId,
          selectedBy: user.uid,
        },
      }
    )
    socketConnections.sendToSockets(
      invite?.project?.userId || user.uid,
      user.uid,
      'update-node',
      params.id,
      { selectedBy: null }
    )
    res.status(200).send({ selectedBy: null })
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
    const invites = await Invite.findAll({
      where: {
        guestId: user.uid,
      },
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Node,
              as: 'nodes',
              where: { id: params.id }
            },
          ],
        },
      ],
    })
    const invite = invites.find((invite) => invite.project)
    const result = await Node.update(body, {
      where: { id: params.id, userId: invite?.project?.userId || user.uid },
      returning: true,
    })
    if (result[0]) {
      if (
        !Object.keys(body).includes('x') &&
        !Object.keys(body).includes('isHidden')
      ) {
        Log.create({
          projectId: result[1][0]?.dataValues?.projectId,
          userId: user.uid,
          nodeId: params.id,
          type: 'UPDATE',
          details: { ...body },
        })
      }
      socketConnections.sendToSockets(
        invite?.project?.userId || user.uid,
        user.uid,
        'update-node',
        params.id,
        body
      )
      if (body.labelId) {
        const label = await Label.findOne({
          where: { id: body.labelId, userId: invite?.project?.userId || user.uid },
        })
        console.log({ ...body, label })
        res.status(200).send({ ...body, label: { ...label.dataValues } })
      } else {
        res.status(200).send(body)
      }
    } else {
      res.status(404).send({
        error: 'INTERNAL_SERVER_ERROR',
        statusCode: 404,
        message: 'Node not found',
      })
    }
  } catch (error) {
    console.log(error)
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
    const invites = await Invite.findAll({
      where: {
        guestId: user.uid,
      },
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Node,
              as: 'nodes',
              where: { id: body.ids }
            },
          ],
        },
      ],
    })
    const invite = invites.find((invite) => invite.project)
    const nodes = (
      await Node.findAll({
        where: { id: body.ids, userId: invite?.project?.userId || user.uid },
        include: [
          { model: Vote, as: 'votes' },
          { model: Evidence, as: 'evidences' },
        ],
      })
    )?.map((node) => node.dataValues)
    const result = await Node.destroy({
      where: { id: body.ids, userId: invite?.project?.userId || user.uid },
    })
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      Log.create({
        projectId: node.projectId,
        userId: user.uid,
        type: 'DELETE',
        details: { text: node.text },
      })
      for (let n = 0; n < node.evidences?.length; n++) {
        const ev = node.evidences[n]
        if (ev.file) {
          fs.unlinkSync('uploads/' + ev.file.filename)
        }
      }
    }
    if (result > 0) {
      socketConnections.sendToSockets(
        invite?.project?.userId || user.uid,
        user.uid,
        'delete-nodes',
        body.ids
      )
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: 'Could not delete nodes',
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
