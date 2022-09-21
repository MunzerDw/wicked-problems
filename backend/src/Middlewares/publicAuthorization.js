const firebaseAdmin = require('../Services/firebase')

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1]
  } else {
    req.authToken = null
  }
  next()
}

function publicAuthorization(req, res, next) {
  // return next()
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req
      const user = await firebaseAdmin.auth().verifyIdToken(authToken)
      req.user = user
      return next()
    } catch (e) {
      return next()
    }
  })
}

module.exports = publicAuthorization
