const express = require('express')
const { Invite, Evidence, Project, Node } = require('../Models')
const { v4: uuidv4 } = require('uuid')
const upload = require('../Middlewares/upload')
const fs = require('fs')
const { socketConnections } = require('../Services/realtime')
const authorization = require('../Middlewares/authorization')

const router = express.Router()

router.post('/', upload, authorization, async (req, res) => {
  try {
    const { user, body } = req
    const id = uuidv4()
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
              model: Node,
              as: 'nodes',
              where: { id: body.nodeId },
            },
          ],
        },
      ],
    })
    const data = {
      ...body,
      file: req.file,
      id: id,
      userId: invite[0]?.hostId || user.uid,
    }
    console.log(data)
    const result = await Evidence.create(data)
    socketConnections.sendToSockets(
      invite[0]?.hostId || user.uid,
      user.uid,
      'create-evidence',
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
              model: Node,
              as: 'nodes',
              include: [
                { model: Evidence, as: 'evidences', where: { id: body.ids } },
              ],
            },
          ],
        },
      ],
    })
    const data = await Evidence.findAll({
      where: {
        id: body.ids,
        userId: invite[0]?.hostId || user.uid,
      },
    })
    for (let i = 0; i < data.length; i++) {
      const ev = data[i]
      if (ev.file) {
        fs.unlinkSync('uploads/' + ev.file.filename)
      }
    }
    const result = await Evidence.destroy({
      where: { id: body.ids, userId: invite[0]?.hostId || user.uid },
    })
    if (result > 0) {
      socketConnections.sendToSockets(
        invite[0]?.hostId || user.uid,
        user.uid,
        'delete-evidences',
        body.ids,
        data[0].nodeId
      )
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 500,
        message: 'Could not delete evidences',
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
