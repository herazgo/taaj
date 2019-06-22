const defaultState = {
  username: null,
  password: null,
  errorMessage: null,
}

export default (state = defaultState, action) => {
  switch(action.type){
    case 'SET_AUTH_USERNAME':
      return { ...state, username: action.value }

    case 'SET_AUTH_PASSWORD':
      return { ...state, password: action.value }

    case 'SET_AUTH_ERROR':
      return { ...state, errorMessage: action.value }

    default:
      return state;
  }
}

export const mapStateToProps = state => state

export const mapDispatchToProps = dispatch => ({
  setUser: value => dispatch({type: 'SET_AUTH_USERNAME', value: value}),
  setPass: value => dispatch({type: 'SET_AUTH_PASSWORD', value: value}),
  setError: value => dispatch({type: 'SET_AUTH_ERROR', value: value}),
})
