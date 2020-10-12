import Firebase from '../../api/firebase/config';


// TYPES
// export const UPDATE_NAME = 'UPDATE_PASSWORD'; --- soon
export const ADD_CONTACTS = 'ADD_CONTACTS';
export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const SET_LAST_REPORT_TIME = 'SET_LAST_REPORT_TIME';


export const addContacts = (contacts) => {
    return (dispatch) => {
        dispatch({ type: ADD_CONTACTS, emergencyContacts: contacts })
    }
}

export const updateEmail = (email) => {
    return async(dispatch) => {
        const user = Firebase.auth().currentUser;

        await user.updateEmail(email).then(function() {
            dispatch({ type: UPDATE_EMAIL, email: email.toLowerCase() })
        }).catch(function(error) {
            throw (error)
        });
    }
}

export const setLastReportTime = () => {
    return (dispatch) => {
        const time = new Date()
        dispatch({ type: SET_LAST_REPORT_TIME, time })
    }
}