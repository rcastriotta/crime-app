import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert } from 'react-native';

// DATABASE
import firebase from 'firebase';
const geofirestore = require('geofirestore');
const GeoFirestore = geofirestore.initializeApp(Firebase.firestore());

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';
import axios from 'axios';


// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as crimeReportsActions from '../../../store/actions/crimeReports';
import * as userActions from '../../../store/actions/user';

// COMPONENTS
import Colors from '../../../constants/Colors';
import Fields from './Fields';
import MapPreview from './MapPreview';
import SearchModal from '../../../components/Main/SearchModal';
import checkIfLargeCity from '../../../utils/checkIfLargeCity';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const AddCrimeScreen = ({ navigation, route }) => {
    const location = useSelector(state => state.location.currentLocation)
    const [modalVisible, setModalVisible] = useState(false)
    const [chosenLocation, setChosenLocation] = useState(location)
    const [chosenAddress, setChosenAddress] = useState(chosenLocation ? `${chosenLocation.name}, ${chosenLocation.city}, ${chosenLocation.region}` : `Couldn't get location`)
    const [descriptionText, setDescriptionText] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const authorId = useSelector(state => state.user.uid)
    const authorName = useSelector(state => state.user.name)
    const [validated, setValidated] = useState(false)
    const lastReportedAt = useSelector(state => state.user.lastReportedAt)

    const getDynamicTimestamp = async () => {
        // prevents local date changes to bypass post wait time
        try {
            const result = await axios.get('http://worldtimeapi.org/api/timezone/America/New_York')
            const date = result.data.datetime
            return date
        } catch (err) {
            console.log(err)
            return null
        }
    }
    const dispatch = useDispatch()

    const uploadCrime = async () => {
        if (validated && location) {
            setIsUploading(true)
            let date = await getDynamicTimestamp()

            if (!date) {
                setIsUploading(false)
                Alert.alert(
                    "Error posting report",
                    "Please try again later",
                    [
                        { text: "Okay" }
                    ],
                    { cancelable: false }
                );
                return;
            }
            date = Date.parse(date)
            const canPost = (date - Date.parse(lastReportedAt)) > 86400000

            // check if it's been more than a day since last upload
            if (!canPost) {
                setIsUploading(false)
                Alert.alert(
                    "Error posting report",
                    "Please wait 24 hours between posting crime reports",
                    [
                        { text: "Okay" }
                    ],
                    { cancelable: false }
                );
                return;
            }

            setIsUploading(true)
            const report = {
                description: descriptionText,
                address: chosenAddress,
                type: route.params.type,
                authorId,
                authorName,
                active: true,
                reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            const geocollection = GeoFirestore.collection('userReports');

            geocollection.add({ ...report, coordinates: new firebase.firestore.GeoPoint(chosenLocation.lat, chosenLocation.lng) })
                .then(() => {
                    dispatch(userActions.setLastReportTime())
                    setTimeout(() => {
                        dispatch(crimeReportsActions.fetchCrimes(location.lat, location.lng, checkIfLargeCity(location.city, location.region), 'homescreen', 20)).then(() => {
                            setIsUploading(false)
                            navigation.navigate('Tabbed')
                        })
                    }, 500)

                })
                .catch((err) => console.log(err))
        }
    }


    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.headingContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name={"md-arrow-back"} size={30} color={Colors.accent} />
                    </TouchableOpacity>
                    <Text style={styles.headingText}>{route.params.title}</Text>
                </View>
                <Text style={styles.categoryTitle}>DESCRIPTION</Text>
                <Fields setValidated={value => setValidated(location ? value : false)} setText={(text) => setDescriptionText(text)} />
                <Text style={styles.categoryTitle}>CHOOSE INCIDENT LOCATION</Text>
                <MapPreview location={chosenLocation} />
                <View style={styles.currentLocation}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'TTN-Medium' }}>{chosenAddress}</Text>
                    </View>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.changeLocationButton} onPress={() => setModalVisible(true)} activeOpacity={1}>
                            <Text style={styles.changeLocationText}>Change location</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <TouchableOpacity onPress={uploadCrime} activeOpacity={validated ? 0.7 : 1}>
                    <View style={validated ? styles.submitButton : { ...styles.submitButton, opacity: 0.3 }} >
                        <View style={{ flex: 1 }} />
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.buttonText}>Publish Report</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            {isUploading && <MaterialIndicator size={15} color={'white'} style={{ alignSelf: 'flex-start' }} />}
                        </View>
                    </View>

                </TouchableOpacity>
            </View>
            <SearchModal city={location ? location.city : null} region={location ? location.region : null} isAdding={true} lat={location && location.lat.toString()} lon={location && location.lng.toString()} locationChange={(newLocation, address) => {
                setChosenLocation(newLocation)
                setChosenAddress(address.replace(', USA', '').replace(/\d{5}/, ''))
            }} setVisible={() => setModalVisible(false)} visible={modalVisible} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    container: {
        padding: 25,
        paddingTop: 0,
        flex: 1
    },
    headingContainer: {
    },
    headingText: {
        color: 'white',
        fontSize: hp('3%'),
        fontWeight: 'bold',
        marginTop: '5%',
        fontFamily: 'TTN-Bold'
    },


    buttonText: {
        color: 'white',
        fontFamily: 'TTN-Bold',
        fontSize: wp('4%')
    },
    currentLocation: {
        flexDirection: 'row',
        width: '100%',
        height: '15%',

    },
    changeLocationButton: {
        width: '90%',
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        height: '40%',
        borderRadius: 100
    },
    changeLocationText: {
        color: 'white',
        fontFamily: 'TTN-Medium'
    },
    submitButton: {
        width: '100%',
        aspectRatio: 5.3,
        backgroundColor: Colors.accent,
        borderRadius: 10,
        flexDirection: 'row',
        marginTop: windowHeight < 700 ? '2%' : '10%'
    },
    categoryTitle: {
        marginTop: '15%', color: '#C1C1C1', fontSize: hp('1.7%'), fontFamily: 'TTN-Medium'
    }
})

export default AddCrimeScreen;