const defaultState = {
    httpStatus: 200,
    httpContent: null
}

export default (state = defaultState, action) => {
    switch(action.type){
        case '__TAAJ_SET_HTTP_STATUS__':
            return {...state, httpStatus: action.httpStatus}

        case '__TAAJ_SET_HTTP_CONTENT__':
            return {...state, httpContent: action.httpContent}

        default:
            return state;
    }
}

export const mapDispatchToProps = dispatch => ({
    setHttpStatus: httpStatus => dispatch({type: '__TAAJ_SET_HTTP_STATUS__', httpStatus}),
    setHttpContent: httpContent => dispatch({type: '__TAAJ_SET_HTTP_CONTENT__', httpContent}),
})

export const mapStateToProps = state => state