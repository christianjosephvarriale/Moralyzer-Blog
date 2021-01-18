import { combineReducers } from 'redux'
import BlogReducer from './BlogReducer.js'
import AppReducer from './AppReducer.js'

export default combineReducers ({
  BlogReducer,
  AppReducer
})