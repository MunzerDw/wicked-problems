import firebase from 'firebase/app'

let firebaseAnalytics

export async function initFirebaseAnalytics() {
  if (!firebaseAnalytics) {
    await require('firebase/analytics')
    firebaseAnalytics = await firebase.analytics()
  }
  return firebaseAnalytics
}
