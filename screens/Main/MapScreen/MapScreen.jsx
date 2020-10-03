import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, TouchableHighlight, Alert, ImagePropTypes } from 'react-native';

import MapStyles from '../../../constants/MapStyles';

// REDUX 
import { useDispatch, useSelector } from 'react-redux'
import * as crimeReportsActions from '../../../store/actions/crimeReports';
import * as locationActions from '../../../store/actions/location';

// EXTERNAL
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import { AdMobInterstitial } from 'expo-ads-admob';

//COMPONENTS
import SearchBar from './SearchBar';
import SearchModal from '../../../components/Main/SearchModal';
import MapCrimes from './MapCrimes';
import checkIfLargeCity from '../../../utils/checkIfLargeCity';

import Colors from '../../../constants/Colors';

const MapScreen = () => {
    const [isFetching, setIsFetching] = useState(false)
    const location = useSelector(state => state.location.currentLocation) // this is fine because we never need to get anything other than current location
    const mapCrimes = useSelector(state => state.crimes.mapCrimes)
    const [modalVisible, setModalVisible] = useState(false)
    const [crimeSelected, setCrimeSelected] = useState(null)
    const [mapRef, setMapRef] = useState(null)
    const [currentRadius, setCurrentRadius] = useState(null)
    const [changedRegion, setChangedRegion] = useState(null)
    const [circleStyles, setCircleStyles] = useState(null)


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
        setChangedRegion(newRegion)
        getCrimes(newLocationObj)
        showAd()
    }

    const dispatch = useDispatch()

    const getCrimes = async (coordinates) => {
        let radius;
        setIsFetching(true)

        if (!currentRadius && location) {
            // we initialize the map screen to the same radius that the crime report data is based off of
            radius = checkIfLargeCity(location.city, location.region)
            setCurrentRadius(radius)
        } else {
            setCurrentRadius(0.5)
            radius = 0.5
        }
        await dispatch(crimeReportsActions.fetchCrimes(coordinates.lat, coordinates.lng, radius, 'mapScreen', 100)).catch((err) => {
            console.log(err)
        })
        setIsFetching(false)
    }

    const showAd = async () => {
        await AdMobInterstitial.setAdUnitID('ca-app-pub-1190322108532531/8960723008') //ca-app-pub-1190322108532531/8960723008
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
        await AdMobInterstitial.showAdAsync();
    }

    // on first load
    useEffect(() => {
        setCircleStyles({
            strokeWidth: 1,
            strokeColor: 'rgba(127, 106, 250, .5)',
            fillColor: 'rgba(127, 106, 250, .08)'
        })

        showAd();

        if (!mapCrimes) {
            (async () => {
                if (!location) {
                    getCrimes({ lat: 40.7127753, lng: -74.0059728 })
                } else {
                    getCrimes({ lat: location.lat, lng: location.lng })
                }
            })();
        }
    }, [])

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
                    latitude: location ? location.lat : 40.7127753,
                    longitude: location ? location.lng : -74.0059728,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                ref={ref => setMapRef(ref)}
            >
                {mapCrimes && mapCrimes.map(crime => renderMarker(crime))}
                <Circle
                    key={location ? (location.lat + location.lng).toString() : (40.7127753 + -74.0059728).toString()}
                    center={{
                        latitude: changedRegion ? changedRegion.latitude : location ? location.lat : 40.7127753,
                        longitude: changedRegion ? changedRegion.longitude : location ? location.lng : -74.0059728
                    }}
                    radius={currentRadius ? (currentRadius * 1600) : 800}
                    strokeWidth={circleStyles && circleStyles.strokeWidth}
                    strokeColor={circleStyles && circleStyles.strokeColor}
                    fillColor={circleStyles && circleStyles.fillColor}
                />


            </MapView>
            {crimeSelected && <MapCrimes selected={crimeSelected} setCrimeSelected={() => setCrimeSelected(null)} />}

            <SearchBar isFetching={isFetching} radius={currentRadius} setVisible={() => setModalVisible(true)} />
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
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#4B3F91'
    },
    userMarkerSelected: {
        height: 28,
        width: 28,
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
        backgroundColor: 'rgba(0, 90, 255, 1.0)',
        borderWidth: 1,
        borderColor: '#00338F'
    },
    policeMarkerSelected: {
        height: 28,
        width: 28,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'rgba(0, 90, 255, 1.0)',
        borderRadius: 5
    }

})

export default MapScreen;