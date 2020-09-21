import { GET_CURRENT_LOCATION } from '../actions/location';

const initialState = {
    currentLocation: null
}


const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CURRENT_LOCATION:
            return { currentLocation: action.locationInfo }

        default:
            return state
    }
}

export default locationReducer;