import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Linking } from 'react-native';

// REDUX
import { useSelector } from 'react-redux';

// EXTERNAL
import axios from 'axios';
import { getDistance } from 'geolib';
import { MaterialIndicator } from 'react-native-indicators';


// COMPONENTS
import Colors from '../../../constants/Colors';

const SafePlacesModal = props => {
    const location = useSelector(state => state.location.currentLocation)
    const [places, setPlaces] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const radius = props.radius * 1609


    const getPlaceDistance = (placeLat, placeLng) => {
        return getDistance(
            { latitude: location.lat, longitude: location.lng },
            { latitude: placeLat, longitude: placeLng }
        );
    }

    const getDirections = (lat, lng) => {
        if (Platform.OS === 'ios') {
            Linking.openURL(`http://maps.apple.com/?daddr=${lat},${lng}`)
        } else {
            Linking.openURL(`http://maps.google.com/?daddr=${lat},${lng}`)
        }
    };

    useEffect(() => {
        // only loads when modal is opened to prevent unnecessary calls
        if (location && props.visible) {
            setIsFetching(true);
            (async () => {
                try {
                    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`)
                    let results = response.data.results.filter((place) => 'opening_hours' in place
                        || place.types.includes('police')
                        || place.types.includes('fire_station'))

                    results = results.sort(function (x, y) {
                        // show open values first
                        if ('opening_hours' in x && 'opening_hours' in y) {
                            return (x.opening_hours.open_now === y.opening_hours.open_now) ? 0 : x.opening_hours.open_now ? -1 : 1;
                        }
                    });

                    results = results.sort(function (x, y) {
                        // show open values first
                        return ('opening_hours' in x === 'opening_hours' in y) ? 0 : 'opening_hours' in x ? 1 : -1
                    });

                    setPlaces(results)
                    setIsFetching(false)
                } catch (err) {
                    console.log(err)
                }
            })();
        }

    }, [props.visible])

    const renderPlace = (itemData) => {
        let openStatus = null
        let openInformationAvailable = null;
        if ('opening_hours' in itemData.item) {
            openInformationAvailable = true
            if (itemData.item.opening_hours.open_now) {
                openStatus = 'Open'
            } else {
                openStatus = 'Closed'
            }
        }
        return (
            <View id={itemData.item.place_id} style={styles.place}>
                <View style={styles.placeInfo}>
                    <Text style={styles.placeName}>{itemData.item.name}</Text>
                    <View style={styles.placeStatus}>
                        <Text style={openInformationAvailable ? openStatus === 'Open' ? styles.placeStatusText : { ...styles.placeStatusText, color: 'red' } : { ...styles.placeStatusText, color: 'gray' }}>{openInformationAvailable ? openStatus : 'Unknown'}</Text>
                        <View style={{ marginHorizontal: 7, width: 3, height: 3, borderRadius: 100, backgroundColor: 'gray' }} />
                        <Text style={styles.miles}>
                            {location && (getPlaceDistance(itemData.item.geometry.location.lat, itemData.item.geometry.location.lng) / 1609.34).toFixed(1)
                            } mi</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => getDirections(itemData.item.geometry.location.lat, itemData.item.geometry.location.lng)}>
                    <Text style={{ color: 'white', fontFamily: 'TTN-Medium' }}>Get directions</Text>
                </TouchableOpacity>
            </View>
        )
    }



    return (
        <Modal transparent={true} visible={props.visible} animationType="slide">
            <View style={styles.container}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => props.setVisible()} />
                <View style={styles.contentContainer}>
                    <Text style={styles.titleText}>Safe Places Nearby</Text>
                    <View style={styles.line} />
                    {location
                        ? isFetching ? <MaterialIndicator size={25} color={Colors.accent} style={{ alignSelf: 'center', marginBottom: '20%' }} /> : <FlatList keyExtractor={item => item.place_id} style={{ marginTop: '5%', paddingHorizontal: '5%' }} data={places} renderItem={renderPlace} />
                        : <Text style={styles.noLocationText}>Couldn't get current location</Text>}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        flex: 1
    },
    contentContainer: {
        height: '60%',
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 30,
    },
    titleText: {
        fontFamily: 'TTN-Bold',
        color: Colors.accent,
        fontSize: 18,
        marginLeft: '5%'
    },
    line: {
        backgroundColor: Colors.accent,
        height: 3,
        width: 40,
        borderRadius: 100,
        marginTop: 10,
        marginLeft: '5%'
    },
    place: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        height: 60
    },
    placeInfo: {
        justifyContent: 'space-evenly',
        flex: 1,
        height: '100%',
        paddingRight: 10
    },
    placeStatus: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        width: '35%',
        height: '60%',
        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeName: {
        color: 'black',
        fontFamily: 'TTN-Bold',
        fontSize: 17

    },
    placeStatusText: {
        color: '#29D680',
        fontFamily: 'TTN-Bold'
    },
    miles: {
        color: 'gray'
    },
    noLocationText: {
        fontFamily: 'TTN-Medium',
        alignSelf: 'center',
        marginTop: '40%',
        color: 'gray'
    }
});

export default SafePlacesModal;