import React from 'react'
import ReactDOM from 'react-dom'
import './styles/tailwind.css'
import './index.css'
import App from './App/App.js'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

// DEFAULTS
TimeAgo.addDefaultLocale(en)
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL

ReactDOM.render(<App />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
