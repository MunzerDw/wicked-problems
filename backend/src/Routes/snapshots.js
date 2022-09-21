const express = require('express')
const { Project, Invite, Snapshot, Data } = require('../Models')
const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')
const upload = require('../Middlewares/upload')
const fs = require('fs')
const csv = require('fast-csv')
const moment = require('moment')
const calculateStatistics = require('../Helpers/calculateStatistics')
const calculateCorrelations = require('../Helpers/calculateCorrelations')
const authorization = require('../Middlewares/authorization')
const publicAuthorization = require('../Middlewares/publicAuthorization')

const router = express.Router()

router.get('/', publicAuthorization, async (req, res) => {
  try {
    const { user, query } = req
    let data
    if (user) {
      data = await Snapshot.findAll({
        where: {
          [Op.or]: [
            { userId: user.uid },
            { '$project.invites.guestId$': user.uid },
          ],
        },
        include: [
          { model: Data, as: 'data' },
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
      data = await Snapshot.findAll({
        where: {
          '$project.public$': true,
        },
        include: [
          { model: Data, as: 'data' },
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
    const result = await Snapshot.create(data)
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
              model: Snapshot,
              as: 'snapshots',
              where: { id: params.id },
            },
          ],
        },
      ],
    })
    const result = await Snapshot.update(body, {
      where: { id: params.id, userId: invite[0]?.hostId || user.uid },
      returning: true,
    })
    if (result[0]) {
      res.status(200).send(body)
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'Snapshot not found',
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
              model: Snapshot,
              as: 'snapshots',
              where: { id: params.id },
            },
          ],
        },
      ],
    })
    const result = await Snapshot.destroy({
      where: { id: params.id, userId: invite[0]?.hostId || user.uid },
    })
    if (result > 0) {
      res.status(204).send()
    } else {
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: 'Could not delete snapshot',
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

router.delete('/:id/data', authorization, async (req, res) => {
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
              model: Snapshot,
              as: 'snapshots',
              where: { id: params.id },
            },
          ],
        },
      ],
    })
    const result = await Data.destroy({
      where: { snapshotId: params.id, userId: invite[0]?.hostId || user.uid },
    })
    if (result > 0) {
      res.status(204).send()
    } else {
      res.status(400).send('Could not delete snapshot data')
      res.status(400).send({
        error: 'DELETE',
        statusCode: 400,
        message: 'Could not delete data',
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

router.post('/:id/data', upload, authorization, async (req, res) => {
  try {
    const { user, params, body, file } = req
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
              model: Snapshot,
              as: 'snapshots',
              where: { id: params.id },
            },
          ],
        },
      ],
    })
    console.log(body.text)
    if (!file && !body.text) {
      res.status(400).send({
        error: 'IMPORT_DATA',
        statusCode: 400,
        message: 'Data is empty',
      })
      return
    }
    let content
    if (file) {
      content = fs.readFileSync('uploads/' + file?.filename, 'utf8')
      fs.unlinkSync('uploads/' + file?.filename)
    } else {
      content = body.text
    }
    const data = []
    const lines = content.split('\n')
    const headers = lines[0]
      .replace('\n', '')
      .replace('\r', '')
      .split(body.separator || ',')
    lines.shift()
    if (file) lines.pop()
    const dateColumnIndex = headers.indexOf(body.dateColumn || 'date')
    const valueColumnIndex = headers.indexOf(body.valueColumn || 'value')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace('\n', '').replace('\r', '')
      const cells = line.split(body.separator || ',')
      let date = cells[dateColumnIndex]
      const value = cells[valueColumnIndex]
      if (body.dateFormat) {
        const momentDate = moment(date, body.dateFormat)
        date = momentDate.toDate()
      }
      if (date) {
        data.push({
          snapshotId: params.id,
          userId: invite[0]?.hostId || user.uid,
          date: date,
          value: value,
        })
      }
    }
    const result = await Data.bulkCreate(data)
    if (result.length) {
      res.status(200).send(result.map((data) => data.dataValues))
    } else {
      res.status(404).send({
        error: 'NOT_FOUND',
        statusCode: 404,
        message: 'Data not found',
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

router.post(
  '/calculatestatistics/:id',
  publicAuthorization,
  async (req, res) => {
    try {
      const { user, params, body } = req
      if (user) {
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
                  model: Snapshot,
                  as: 'snapshots',
                  where: { id: params.id },
                },
              ],
            },
          ],
        })
        const data = await Snapshot.findOne({
          where: {
            id: params.id,
            userId: invite[0]?.hostId || user.uid,
          },
          include: [{ model: Data, as: 'data' }],
        })
        const statistics = calculateStatistics(
          data.data.map((d) => d.dataValues)
        )
        console.log(statistics)
        const result = await Snapshot.update(
          { statistics: statistics },
          {
            where: { id: params.id, userId: invite[0]?.hostId || user.uid },
            returning: true,
          }
        )
        if (result[0]) {
          res.status(200).send({ statistics: statistics })
        } else {
          res.status(404).send({
            error: 'NOT_FOUND',
            statusCode: 404,
            message: 'Snapshot not found',
          })
        }
      } else {
        const data = await Snapshot.findOne({
          where: {
            'id': params.id,
            '$project.public$': true,
          },
          include: [
            { model: Data, as: 'data' },
            {
              model: Project,
              as: 'project',
            },
          ],
        })
        const statistics = calculateStatistics(
          data.data.map((d) => d.dataValues)
        )
        res.status(200).send({ statistics: statistics })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({
        error: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
        message: error.message,
      })
    }
  }
)

router.post('/calculatecorrelations', publicAuthorization, async (req, res) => {
  try {
    const { user, query } = req
    if (user) {
      const snapshots = await Snapshot.findAll({
        where: {
          [Op.or]: [
            { userId: user.uid },
            { '$project.invites.guestId$': user.uid },
          ],
        },
        include: [
          { model: Data, as: 'data' },
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
      const correlations = calculateCorrelations(
        snapshots.map((s) => {
          return {
            id: s.id,
            name: s.name,
            data: s.data.map((d) => {
              return {
                date: new Date(new Date(d.date)),
                value: d.value,
              }
            }),
          }
        })
      )
      if (correlations) {
        res.status(200).send(correlations)
      } else {
        res.status(404).send({
          error: 'NOT_FOUND',
          statusCode: 404,
          message: 'Snapshot not found',
        })
      }
    } else {
      const snapshots = await Snapshot.findAll({
        where: {
          '$project.public$': true,
        },
        include: [
          { model: Data, as: 'data' },
          {
            model: Project,
            as: 'project',
            where: {
              urlSafeName: query.urlSafeName,
            },
          },
        ],
      })
      const correlations = calculateCorrelations(
        snapshots.map((s) => {
          return {
            id: s.id,
            name: s.name,
            data: s.data.map((d) => {
              return {
                date: new Date(new Date(d.date)),
                value: d.value,
              }
            }),
          }
        })
      )
      res.status(200).send(correlations)
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

module.exports = router
