import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, TouchableHighlight, Alert, ImagePropTypes } from 'react-native';

import MapStyles from '../../../constants/MapStyles';

// REDUX 
import { useDispatch, useSelector } from 'react-redux'
import * as crimeReportsActions from '../../../store/actions/crimeReports';
import * as locationActions from '../../../store/actions/location';

// EXTERNAL
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';

//COMPONENTS
import SearchBar from './SearchBar';
import SearchModal from '../../../components/Main/SearchModal';
import CrimeReport from '../../../components/Main/CrimeReport';
import MapCrimes from './MapCrimes';

import Colors from '../../../constants/Colors';
import { Circle } from 'react-native-svg';
import { set } from 'react-native-reanimated';

const MapScreen = () => {
    const [isFetching, setIsFetching] = useState(false)
    const location = useSelector(state => state.location.currentLocation) // this is fine because we never need to get anything other than current location
    const mapCrimes = useSelector(state => state.crimes.mapCrimes)
    const [modalVisible, setModalVisible] = useState(false)
    const [crimeSelected, setCrimeSelected] = useState(null)
    const [mapRef, setMapRef] = useState(null)

    // this will check if there's two in of the same lat and lon

    useEffect(() => {
        if (crimeSelected) {
            const conflictingCrimes = mapCrimes.filter(crime => crime.lat === crimeSelected.lat && crime.lon === crimeSelected.lon)

            if (conflictingCrimes.length > 1) {
                setCrimeSelected(conflictingCrimes)
            }
        }

    }, [crimeSelected])





    const locationChange = async (newLocationObj) => {
        const newRegion = {
            latitude: newLocationObj.lat,
            longitude: newLocationObj.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        mapRef.animateToRegion(newRegion)
        getCrimes(newLocationObj)
    }

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

    const dispatch = useDispatch()

    const getCrimes = async (coordinates) => {
        setIsFetching(true)
        await dispatch(crimeReportsActions.fetchCrimes(coordinates.lat, coordinates.lng, 1, 'month', 'mapScreen')).catch((err) => {
            console.log(err)
        })
    }

    // on loadedup we check if we haven't retrieved map crimes yet
    useEffect(() => {
        if (!mapCrimes) {
            (async () => {
                if (!location) {
                    console.log('test')

                    // get location
                    const hasPermissions = await verifyPermissions();
                    await dispatch(locationActions.getLocation(hasPermissions))
                        .catch((err) => {
                            console.log(err)
                        })
                }

                getCrimes({ lat: location.lat, lng: location.lng })
            })();
        }
    }, [mapCrimes])

    const checkIfSelected = (crime) => {
        const isArray = crimeSelected.length > 1
        if (!isArray) {
            return crimeSelected.id === crime.id
                ? <View style={crime.authorName ? { ...styles.userMarkerSelected } : { ...styles.policeMarkerSelected }} />
                : <View id={crime.id} style={crime.authorName ? { ...styles.userMarker } : { ...styles.policeMarker }} />
        } else if (isArray) {
            for (const item of crimeSelected) {
                if (item.id === crime.id) {
                    return <View style={crime.authorName ? { ...styles.userMarkerSelected } : { ...styles.policeMarkerSelected }} />;
                }
            }
            return <View id={crime.id} style={crime.authorName ? { ...styles.userMarker } : { ...styles.policeMarker }} />
        }
    }

    const renderMarker = (crime) => {
        return (
            <Marker
                key={crime.id}
                onPress={() => {
                    setCrimeSelected(crime)
                }}
                coordinate={{
                    latitude: crime.lat,
                    longitude: crime.lon
                }}
            >
                {!crimeSelected ? <View id={crime.id} style={crime.authorName ? { ...styles.userMarker } : { ...styles.policeMarker }} /> : checkIfSelected(crime)}

            </Marker>
        )
    }


    // check if location data already exists -- if doesnt check if location already exists -- get all if doesnt
    if (!location) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }


    return (
        <View style={{ flex: 1 }} >
            <MapView
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                customMapStyle={MapStyles}
                style={styles.map}
                minZoomLevel={14}  // default => 0
                maxZoomLevel={20} // default => 20

                initialRegion={{
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                ref={ref => setMapRef(ref)}
            >
                {mapCrimes && mapCrimes.map(crime => renderMarker(crime))}


            </MapView>
            {crimeSelected && <MapCrimes selected={crimeSelected} setCrimeSelected={() => setCrimeSelected(null)} />}

            <SearchBar setVisible={() => setModalVisible(true)} />
            <SearchModal locationChange={locationChange} visible={modalVisible} setVisible={() => setModalVisible(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    userMarker: {
        width: 20,
        height: 20,
        backgroundColor: Colors.accent,
        borderRadius: 5
    },
    userMarkerSelected: {
        height: 25,
        width: 25,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: Colors.accent,
        borderRadius: 5
    },
    policeMarker: {
        width: 20,
        height: 20,
        backgroundColor: Colors.accent,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 90, 255, 1.0)'
    },
    policeMarkerSelected: {
        height: 25,
        width: 25,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'rgba(0, 90, 255, 1.0)',
        borderRadius: 5
    }

})

export default MapScreen;