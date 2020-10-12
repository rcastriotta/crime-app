import React from 'react';
import { View, Dimensions, StyleSheet, Image } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// FIREBASE
import { useSelector, useDispatch } from 'react-redux';


import Colors from '../constants/Colors';

// SCREENS
import HomeScreen from '../screens/Main/HomeScreen/HomeScreen';
import MapPage from '../screens/Main/MapScreen/MapScreen';
import AddCrimeScreen from '../screens/Main/AddCrimeScreen/AddCrimeScreen';
import LocationSetupScreen from '../screens/Main/LocationSetupScreen';
import ContactsSetupScreen from '../screens/Main/ContactsSetupScreen';
import ChooseTypeScreen from '../screens/Main/ChooseTypeScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import MyReports from '../screens/Main/MyReports';
import UpdateInfo from '../screens/Main/UpdateInfo';
import NearbyReportsScreen from '../screens/Main/NearbyReportsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const Settings = () => {
    return (
        <Stack.Navigator headerMode={'none'} screenOptions={{ cardStyle: { backgroundColor: Colors.primary, flex: 1 } }}>
            <Stack.Screen name="SettingsHome" component={SettingsScreen} />
            <Stack.Screen name="MyReports" component={MyReports} />
            <Stack.Screen name="UpdateInfo" component={UpdateInfo} />
        </Stack.Navigator>
    )
}

const Placeholder = () => <View style={{ flex: 1, background: 'blue' }}></View>

const TabbedNav = () => {
    return (
        <Tab.Navigator tabBarOptions={{
            activeTintColor: Colors.accent,

            style: {
                backgroundColor: Colors.secondary,
                borderTopWidth: 0,
                shadowColor: 'black',
                shadowOpacity: .5,
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 10,

            }
        }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: () => { return null },
                tabBarIcon: ({ focused, color }) => (
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <AntDesign name={'home'}
                            size={30} color={color}
                            style={{ marginTop: '8%', height: 40 }}
                        />


                    </View>

                )
            }}
            />

            <Tab.Screen name="NearbyReports" component={NearbyReportsScreen} options={{
                tabBarLabel: () => { return null },
                tabBarIcon: ({ focused, color }) => (
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Ionicons name={'md-paper'}
                            size={30} color={color}
                            style={{ marginTop: '10%', height: 40, alignSelf: 'center' }}
                        />


                    </View>

                )
            }}
            />
            <Tab.Screen name="Scan" component={Placeholder} options={{
                tabBarLabel: () => { return null },
                tabBarIcon: () =>
                    <View style={{
                        width: '52%', aspectRatio: 1, backgroundColor: Colors.accent, borderRadius: 10, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.accent,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 5,
                        shadowOpacity: .5

                    }}>
                        <Ionicons name="md-add"
                            size={25} color={'white'}
                            style={{ marginTop: 3, marginLeft: .5 }}
                        />
                    </View>

            }}
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate('Add')
                    }
                })} />
            <Tab.Screen name="Map" component={MapPage} options={{
                tabBarLabel: () => { return null },
                tabBarIcon: ({ color, focused }) =>
                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Ionicons name={'md-search'}
                            size={30} color={color}
                            style={{ marginTop: '8%', height: 40 }}
                        />


                    </View>

            }} />

            <Tab.Screen name="SettingsScreen" component={Settings} options={{
                tabBarLabel: () => { return null },
                tabBarIcon: ({ focused, color }) => (

                    <View style={{ height: '100%', alignItems: 'center' }}>
                        <Feather name={'user'}
                            size={28} color={color}
                            style={{ marginTop: '8%', height: 40 }} />
                    </View>

                )
            }}
            />
        </Tab.Navigator>
    );
};

const AddCrime = () => {
    return (
        <Stack.Navigator headerMode={'none'} screenOptions={{ cardStyle: { backgroundColor: Colors.secondary, flex: 1 } }}>
            <Stack.Screen name="Choose" component={ChooseTypeScreen} />
            <Stack.Screen name="Add" component={AddCrimeScreen} />
        </Stack.Navigator>
    )
}


const HomeNavigator = () => {
    return (
        <Stack.Navigator mode="modal" headerMode={'none'} screenOptions={{ cardStyle: { backgroundColor: Colors.primary, flex: 1 } }}>
            <Stack.Screen name="Tabbed" component={TabbedNav} />
            <Stack.Screen name="Add" component={AddCrime} />
        </Stack.Navigator>
    )
}


const SetupNavigator = () => {
    return (
        <Stack.Navigator headerMode={'none'} screenOptions={{ cardStyle: { backgroundColor: Colors.primary, flex: 1 } }}>
            <Stack.Screen name="Location" component={LocationSetupScreen} />
            <Stack.Screen name="Contacts" component={ContactsSetupScreen} />
        </Stack.Navigator>
    )
}
const MainNavigator = () => {
    return (
        <Stack.Navigator
            mode="none"
            screenOptions={{ cardStyle: { backgroundColor: Colors.primary, flex: 1 } }}
            headerMode={'none'}
            initialRouteName={useSelector(state => state.auth.firstSignIn) ? 'Setup' : 'Main'}
        >
            <Stack.Screen name="Home" component={HomeNavigator} options={{ animationEnabled: false }} />
            <Stack.Screen name="Setup" component={SetupNavigator} options={{ animationEnabled: false }} />
        </Stack.Navigator>
    )
}


export default MainNavigator;
