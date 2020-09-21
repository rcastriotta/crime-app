import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';

import { useSelector } from 'react-redux';

// EXTERNAL
import axios from 'axios';
import { getDistance } from 'geolib';


// COMPONENTS
import Colors from '../../../constants/Colors';

const SafePlacesModal = props => {
    const location = useSelector(state => state.location.currentLocation)
    const [places, setPlaces] = useState([])


    const getPlaceDistance = (placeLat, placeLng) => {
        return getDistance(
            { latitude: location.lat, longitude: location.lng },
            { latitude: placeLat, longitude: placeLng }
        );
    }

    useEffect(() => {
        if (location) {
            (async () => {
                try {
                    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1500&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`)
                    setPlaces(response.data.results)
                } catch (err) {
                    console.log(err)
                }
            })();
        }

    }, [location])

    const renderPlace = (itemData) => {
        let open = null
        if ('opening_hours' in itemData.item) {
            open = itemData.item.opening_hours.open_now;
        }
        return (
            <View id={itemData.item.place_id} style={styles.place}>
                <View style={styles.placeInfo}>
                    <Text style={styles.placeName}>{itemData.item.name}</Text>
                    <View style={styles.placeStatus}>
                        <Text style={open ? styles.placeStatusText : { ...styles.placeStatusText, color: 'red' }}>{open ? 'Open' : 'Closed'}</Text>
                        <View style={{ marginHorizontal: 7, width: 3, height: 3, borderRadius: 100, backgroundColor: 'gray' }} />
                        <Text style={styles.miles}>
                            {location && (getPlaceDistance(itemData.item.geometry.location.lat, itemData.item.geometry.location.lng) / 1609.34).toFixed(1)
                            } mi</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button}>
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
                    <FlatList keyExtractor={item => item.place_id} style={{ marginTop: '5%', paddingHorizontal: '5%' }} data={places} renderItem={renderPlace} />
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
        fontWeight: 'bold'
    },
    miles: {
        color: 'gray'
    }
});

export default SafePlacesModal;