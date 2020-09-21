import React from 'react';
import { View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

// SCREENS
import WelcomePage from '../screens/Auth/WelcomeScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import LoginScreen from '../screens/Auth/LoginScreen';

import Colors from '../constants/Colors';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator headerMode={'none'} mode="modal">
            <Stack.Screen name="Welcome" component={WelcomePage} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    )
}

export default AuthNavigator;