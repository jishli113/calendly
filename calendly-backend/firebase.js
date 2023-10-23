const firebase = require('firebase')
const firebaseConfig = {
    apiKey: "AIzaSyD-N5_DgGdxQ44AgojvdLHeZDOOdO6Cx2o",
    authDomain: "calendlyauth.firebaseapp.com",
    projectId: "calendlyauth",
    storageBucket: "calendlyauth.appspot.com",
    messagingSenderId: "951322701805",
    appId: "1:951322701805:web:df4ab4500c116f3a9ec1e4",
    measurementId: "G-3JXTRBM7HZ"
  };

module.exports = firebase.initializeApp(firebaseConfig)