import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// COMPONENTS
import InDangerModal from './InDangerModal';
import SafePlacesModal from './SafePlacesModal';
import EmergencyNumbers from './EmergencyNumbers';
import AnimatedCircle from './AnimatedCircle';
import ReportsData from './ReportsData';
import Colors from '../../../constants/Colors';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as SMS from 'expo-sms';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as crimeReportsActions from '../../../store/actions/crimeReports';
import * as locationActions from '../../../store/actions/location';


// SCREEN DIMENSIONS
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const name = useSelector(state => state.user.name)
    const location = useSelector(state => state.location.currentLocation)
    const [isFetching, setIsFetching] = useState(false)
    const [currentCity, setCurrentCity] = useState(null)
    const contacts = useSelector(state => state.user.emergencyContacts)
    const [amount, setAmount] = useState(0)
    const [fetchFailed, setFetchFailed] = useState(false)

    // modals
    const [modalVisible, setModalVisible] = useState(false)
    const [placesModalVisible, setPlacesModalVisible] = useState(false)
    const [numbersModalVisible, setNumbersModalVisible] = useState(false)



    const verifyPermissions = async () => {
        //will only run if permissions need to be verified
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(`Couldn't get location!`,
                `Go to settings to grant permissions`, [{ text: 'Okay!' }])
            return false;
        }
        return true;
    }

    // once location data is recieved we grab nearby crime data
    useEffect(() => {
        if (location) {
            setIsFetching(true)
            const coordinates = { lat: location.lat, lng: location.lng }
            const city = `${location.name}, ${location.city}, ${location.region}`
            setCurrentCity(city)
            dispatch(crimeReportsActions.fetchCrimes(coordinates.lat, coordinates.lng, 10, 'timeRange', 'homescreen'))
                .then(() => {
                    setIsFetching(false)
                })
                .catch((err) => {
                    setIsFetching(false)
                    setFetchFailed(true)
                    console.log(err)
                })
        }
    }, [location])


    // on first load we grab location, we can also setup location listener here instead
    useEffect(() => {
        (async () => {
            setIsFetching(true)
            const hasPermissions = await verifyPermissions();
            dispatch(locationActions.getLocation(hasPermissions)).catch((err) => {
                console.log(err)
            })
        })();
    }, [])


    const sendSMS = async () => {
        const numbers = []
        contacts.forEach(contact => contact.phoneNumbers.forEach(numberInfo => numbers.push(numberInfo.number)))

        const { result } = await SMS.sendSMSAsync(
            numbers,
            `DANGER ALERT: The person contacting you is in danger.\n\nCURRENT LOCATION: ${currentCity}\n\n\nSent via Safety`,
        )
    }

    const mainModalPressHandler = type => {
        if (type === 'places') {
            setPlacesModalVisible(true)
            setModalVisible(false)
        } else if (type === 'numbers') {
            setNumbersModalVisible(true)
            setModalVisible(false)
        } else if (type === 'SMS') {
            sendSMS();
            setModalVisible(false)
        }
    }

    return (
        <View style={{ flexGrow: 1 }}>
            <ScrollView bounces={false} contentContainerStyle={{ height: hp('80%') + (amount * hp('13%')) }}>
                <SafeAreaView style={styles.screen}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['#2A2E3E', Colors.primary]}
                        style={{
                            position: 'absolute',
                            width: windowWidth,
                            height: windowHeight,
                        }}
                    />
                    <View style={styles.topContainer}>
                        <Text style={styles.name}>Hello, {name && name.split(' ')[0]}</Text>
                        <View style={{ height: '20%', width: '100%' }}>
                            {isFetching
                                ? <MaterialIndicator size={15} color={Colors.accent} style={{ alignSelf: 'flex-start' }} />
                                : <Text style={styles.locationText}>Near {currentCity}</Text>
                            }
                        </View>
                    </View>

                    <AnimatedCircle />
                    <ReportsData setAmount={(num) => setAmount(num)} />

                    <InDangerModal setVisible={() => setModalVisible(false)} visible={modalVisible} pressHandler={mainModalPressHandler} />
                    <SafePlacesModal visible={placesModalVisible} setVisible={() => setPlacesModalVisible(false)} />
                    <EmergencyNumbers visible={numbersModalVisible} setVisible={() => setNumbersModalVisible(false)} />

                </SafeAreaView>
            </ScrollView>
            <TouchableOpacity style={styles.dangerButton} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={['#AB9CFF', Colors.accent]} style={{ width: '100%', height: '100%', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.buttonText}>In Danger?</Text>

                </LinearGradient>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        height: 3000

    },
    topContainer: {
        // justifyContent: 'space-between',
        width: wp('90%'),
        height: hp('10%'),
        justifyContent: 'space-evenly'

    },
    name: {
        fontSize: hp('3.5%'),
        color: 'white',
        fontFamily: 'TTN-Medium'
    },
    locationText: {
        fontFamily: 'TTN-Bold',
        color: Colors.accent
    },
    button: {
        width: '70%',
        height: hp('6%'),
        backgroundColor: Colors.accent,
        borderRadius: 100,
        marginTop: hp('6%'),
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: hp('1.8%')
    },
    dangerButton: {
        position: 'absolute',
        flex: 1,
        marginTop: hp('80%'),
        width: hp('24%'),
        height: hp('6%'),
        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,

    }
})

export default HomeScreen;