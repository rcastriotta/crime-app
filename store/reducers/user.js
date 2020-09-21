import { ADD_CONTACTS, UPDATE_PROFILE_IMAGE, UPDATE_EMAIL } from '../actions/user';
import { SIGNUP, LOGIN, SIGNOUT } from '../actions/auth';

const initialState = {
    name: null,
    uid: null,
    email: null,
    profileImg: null,
    emergencyContacts: []
}


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGNUP:
            return {...state, uid: action.userId, name: action.name, email: action.email }
        case LOGIN:
            return {...state, uid: action.userId, name: action.name, email: action.email }
        case SIGNOUT:
            return initialState
        case ADD_CONTACTS:
            return {...state, emergencyContacts: action.emergencyContacts }
        case UPDATE_PROFILE_IMAGE:
            return {...state, profileImg: action.uri }
        case UPDATE_EMAIL:
            return {...state, email: action.email }
        default:
            return state
    }
}

export default userReducer;