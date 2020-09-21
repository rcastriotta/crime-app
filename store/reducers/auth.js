import { LOGIN, SIGNUP, SIGNOUT, SETUP_COMPLETE } from '../actions/auth';


// THIS WILL STORE WHETHER ITS USERS FIRST TIME LOGGING IN


// store tokens here if necessary
const authReducer = (state = {}, action) => {
    switch (action.type) {
        case SIGNUP:
            return {...state, firstSignIn: action.firstSignIn, loggedIn: action.loggedIn }
        case LOGIN:
            return {...state, firstSignIn: action.firstSignIn, loggedIn: action.loggedIn }
        case SIGNOUT:
            return {...state, loggedIn: action.loggedIn }
        case SETUP_COMPLETE:
            return {...state, firstSignIn: action.firstSignIn }
        default:
            return state
    }
}

export default authReducer;