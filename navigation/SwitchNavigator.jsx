import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import Colors from '../constants/Colors';

// NAVIGATION
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { NavigationContainer } from '@react-navigation/native';

// FIREBASE
import Firebase from '../api/firebase/config';

// REDUX
import { useDispatch, useSelector } from 'react-redux';

const SwitchNavigator = () => {
    const [signedIn, setSignedIn] = useState(null)
    const authState = useSelector(state => state.auth.loggedIn)

    // Handle user state changes
    useEffect(() => {
        if (authState) {
            setSignedIn(true)
        } else {
            setSignedIn(false)
        }
    }), [authState]


    if (signedIn === null) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: Colors.primary }}>
                <ActivityIndicator color="white" />
            </View>
        )
    }

    return (
        <NavigationContainer>
            {signedIn ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}

export default SwitchNavigator;