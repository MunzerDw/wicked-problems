const express = require('express')
const { Node, Evidence, Invite, Project } = require('../Models')
const { v4: uuidv4 } = require('uuid')
const upload = require('../Middlewares/upload')
const fs = require('fs')
const { Op } = require('sequelize')
const authorization = require('../Middlewares/authorization')

const router = express.Router()

router.get('/:filename', authorization, async (req, res) => {
  try {
    const { user, params } = req
    const filename = params.filename
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
                {
                  model: Evidence,
                  as: 'evidences',
                  where: { file: { filename: filename } },
                },
              ],
            },
          ],
        },
      ],
    })
    const data = await Evidence.findOne({
      where: {
        file: { filename: filename },
        userId: invite[0]?.hostId || user.uid,
      },
    })
    if (data) {
      const file = fs.createReadStream('uploads/' + filename)
      const stat = fs.statSync('uploads/' + filename)
      res.setHeader('Content-Length', stat.size)
      res.setHeader('Content-Type', data.file.mimetype)
      console.log(data.file.mimetype)
      file.pipe(res)
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'File not found',
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
