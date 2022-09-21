const admin = require('firebase-admin')

const firebaseAdmin = admin.initializeApp(
  admin.credential.applicationDefault(),
  'https://wicked-problems.firebaseio.com'
)

module.exports = firebaseAdmin
