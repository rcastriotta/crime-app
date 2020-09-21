import Firebase from '../../api/firebase/config';


// TYPES
export const UPDATE_NAME = 'UPDATE_PASSWORD'
export const UPDATE_PROFILE_IMAGE = 'UPDATE_PROFILE_IMAGE'
export const ADD_CONTACTS = 'ADD_CONTACTS'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'


export const addContacts = (contacts) => {
    return (dispatch) => {
        dispatch({ type: ADD_CONTACTS, emergencyContacts: contacts })
    }
}

export const updateProfileImage = (uri) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_PROFILE_IMAGE, uri: uri })
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

// we need to reauthenticate and then update password
export const changePassword = (password) => {
    return async(dispatch) => {
        var user = firebase.auth().currentUser;

        user.updatePassword(password).then(function() {
            // Update successful.
        }).catch(function(error) {
            console.log(error)
        });
    }
}