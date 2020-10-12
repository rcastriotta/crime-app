import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import Colors from '../constants/Colors';

// NAVIGATION
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { NavigationContainer } from '@react-navigation/native';

// REDUX
import { useSelector } from 'react-redux';

const SwitchNavigator = () => {
    const authState = useSelector(state => state.auth.loggedIn)

    if (authState === null) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: Colors.primary }}>
                <ActivityIndicator color="white" />
            </View>
        )
    }

    return (
        <NavigationContainer>
            {authState ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}

export default SwitchNavigator;