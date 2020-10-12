import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, Button, SafeAreaView, TextInput, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

// EXTERNAL
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// COMPONENTS
import Colors from '../../constants/Colors';
import checkIfLargeCity from '../../utils/checkIfLargeCity';

// REDUX
import { useSelector } from 'react-redux';

const SearchModal = props => {
    const [searchText, setSearchText] = useState('')
    const [results, setResults] = useState([])
    let radius = checkIfLargeCity(props.city, props.region) * 1609

    useEffect(() => {
        (async () => {
            try {
                let results;
                if (props.isAdding) {
                    const result1 = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&types=geocode&language=pt_BR&location=${props.lat},${props.lon}&radius=${radius}&strictbounds&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`)
                    const result2 = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&types=establishment&language=pt_BR&location=${props.lat},${props.lon}&radius=${radius}&strictbounds&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`)
                    results = [...result1.data.predictions, ...result2.data.predictions]
                } else {
                    const result1 = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&types=geocode&language=pt_BR&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`)
                    results = [...result1.data.predictions]
                }

                const addresses = results.map((address) => {
                    return {
                        ...address,
                        description: address.description.replace(', EUA', '')
                    }
                })
                setResults(addresses)
            } catch (err) {
                console.log(err)
            }
        })();
    }, [searchText])

    const onLocationPress = async (address) => {
        const formattedAddress = address.replace(/ /g, '+')

        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`)
            const latLngObj = response.data.results[0].geometry.location
            const address = response.data.results[0].formatted_address
            setResults([])
            props.setVisible()
            props.locationChange(latLngObj, address)
        } catch {

        }
    }

    const renderSearchItems = (itemData) => {
        return (
            <TouchableWithoutFeedback onPress={() => onLocationPress(itemData.item.description)}>
                <View style={styles.searchItemContainer} id={itemData.item.reference}>
                    <View style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, .1)', borderRadius: 100 }}>
                        <Ionicons name={"md-pin"} size={15} color={'white'} style={{ paddingTop: '2%' }} />

                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={{ color: 'white', fontFamily: 'TTN-Medium' }}>{itemData.item.description}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <Modal transparent={true} visible={props.visible} animationType={'slide'}>
            <SafeAreaView style={styles.screen}>
                <View style={styles.searchBar}>
                    <View style={styles.textInputContainer}>
                        <TextInput onChangeText={text => setSearchText(text)} autoFocus={true} autoCorrect={false} keyboardAppearance={'dark'} color={'white'} style={{ fontFamily: 'TTN-Medium' }} />
                    </View>
                    <TouchableOpacity activeOpacity={1.0} onPress={() => {
                        props.setVisible()
                        setResults([])
                    }}>
                        <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>



                </View>
                <FlatList data={results} keyExtractor={item => item.reference} renderItem={renderSearchItems} contentContainerStyle={{ paddingTop: '2%' }} />
            </SafeAreaView>

        </Modal>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'rgba(0, 0, 0, .9)',
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '10%',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        borderBottomColor: 'rgba(255, 255, 255, .2)',
        borderBottomWidth: 1
    },
    textInputContainer: {
        width: '75%',
        height: '60%',
        backgroundColor: 'black',
        alignSelf: 'center',
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, .2)',
        borderWidth: 1,
        justifyContent: 'center',
        paddingLeft: '5%'
    },
    searchItemContainer: {
        width: '85%',
        height: 70,
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: '5%',
        paddingRight: '5%'
    },
    descriptionContainer: {
        marginLeft: '8%',
        height: '100%',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, .2)',
        justifyContent: 'center',

    },
    cancelButton: {
        color: 'white',
        fontFamily: 'TTN-Medium',
        marginRight: '2%',
        fontSize: wp('4.3%')
    }
});

export default SearchModal;