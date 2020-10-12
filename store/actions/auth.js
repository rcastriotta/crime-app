import Firebase from '../../api/firebase/config';

// TYPES
export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'
export const SIGNOUT = 'SIGNOUT'
export const SETUP_COMPLETE = 'SETUP_COMPLETE'


export const login = (email, password) => {
    return async(dispatch) => {
        try {
            await Firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                const userId = Firebase.auth().currentUser.uid
                const email = Firebase.auth().currentUser.email
                const name = Firebase.auth().currentUser.displayName

                dispatch({ type: LOGIN, firstSignIn: true, loggedIn: true, userId, name, email })
            })

        } catch (err) {
            throw (err)
        }
    }
}

export const signup = (email, password, name) => {
    return async(dispatch) => {
        //we can .then the function and add data to firestore (name)
        await Firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(result) {
                // update name 
                name = name.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
                email = email.toLowerCase()

                result.user.updateProfile({
                    displayName: name
                }).catch((err) => {
                    throw (err)
                })

                const userId = result.user.uid

                const user = {
                    userId,
                    name,
                    email,
                }

                Firebase.firestore().collection('users').doc(userId).set(user)
                    .catch(function(err) {
                        throw (err)
                    })

                dispatch({ type: SIGNUP, firstSignIn: true, loggedIn: true, userId, name, email })


            })
            .catch(function(err) {
                throw (err)
            });

    }
}

export const signOut = () => {
    return async(dispatch) => {
        await Firebase.auth().signOut().then(() => {}, function(error) {
            console.log('Sign out failed: ' + error)
        });
        dispatch({ type: SIGNOUT, loggedIn: false })
    }
}

export const setupComplete = () => {
    return (dispatch) => {
        dispatch({ type: SETUP_COMPLETE, firstSignIn: false })
    }
}