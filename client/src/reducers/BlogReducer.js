import { POST_ACTIONS } from '../actions/types'

const initalState = {
  posts: [],
  post: {}
}

const BlogReducer = (state = initalState, action) => {
  switch (action.type) {
    case POST_ACTIONS.FETCH:
      return {
        ...state,
        post: action.payload
      }
    case POST_ACTIONS.FETCH_ALL:
      return {
        ...state,
        posts: action.payload,
      }
    default:
      return state
  }
}

export default BlogReducer