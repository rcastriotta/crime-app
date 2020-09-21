import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';

// DATABASE
import firebase from 'firebase';
const geofirestore = require('geofirestore');
const GeoFirestore = geofirestore.initializeApp(Firebase.firestore());
import moment from 'moment'

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';


// REDUX
import { useSelector } from 'react-redux';

// COMPONENTS
import Colors from '../../../constants/Colors';
import Fields from './Fields';
import MapPreview from './MapPreview';
import SearchModal from '../../../components/Main/SearchModal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddCrimeScreen = ({ navigation, route }) => {
    const location = useSelector(state => state.location.currentLocation)
    const [modalVisible, setModalVisible] = useState(false)
    const [chosenLocation, setChosenLocation] = useState(location)
    const [chosenAddress, setChosenAddress] = useState(`${chosenLocation.name}, ${chosenLocation.city}, ${chosenLocation.region}`)
    const [descriptionText, setDescriptionText] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const authorId = useSelector(state => state.user.uid)
    const authorName = useSelector(state => state.user.name)
    const authorProfileImg = useSelector(state => state.user.profileImg) // this will be either null or firebase storage url


    const uploadCrime = async () => {
        if (descriptionText.length > 3) {
            setIsUploading(true)
            const crime = {
                description: descriptionText,
                address: chosenAddress,
                type: route.params.type,
                authorId,
                authorName,
                authorProfileImg,
                reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }

            const geocollection = GeoFirestore.collection('userCrimes');
            geocollection.add({ ...crime, coordinates: new firebase.firestore.GeoPoint(chosenLocation.lat, chosenLocation.lng) })
                .then(() => {
                    setIsUploading(false)
                    navigation.navigate('Tabbed')
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
                <Fields setText={(text) => setDescriptionText(text)} />
                <Text style={styles.categoryTitle}>CHOOSE INCIDENT LOCATION</Text>
                <MapPreview location={chosenLocation} />
                <View style={styles.currentLocation}>
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'TTN-Medium' }}>{chosenAddress}</Text>
                    </View>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.changeLocationButton} onPress={() => setModalVisible(true)}>
                            <Text style={styles.changeLocationText}>Change location</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <TouchableOpacity onPress={uploadCrime} style={styles.submitButton} >
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.buttonText}>Publish Report</Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        {isUploading && <MaterialIndicator size={15} color={'white'} style={{ alignSelf: 'flex-start' }} />}
                    </View>
                </TouchableOpacity>
            </View>
            <SearchModal locationChange={(newLocation, address) => {
                setChosenLocation(newLocation)
                setChosenAddress(address)
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
        height: '8%',
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