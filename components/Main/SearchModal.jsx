import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Text, Button, SafeAreaView, TextInput, FlatList, TouchableWithoutFeedback } from 'react-native';

// EXTERNAL
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS
import Colors from '../../constants/Colors';

const SearchModal = props => {
    const [searchText, setSearchText] = useState('')
    const [results, setResults] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const result = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&types=geocode&language=pt_BR&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`)
                const addresses = result.data.predictions.map((address) => {
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

        // we should first check if EAU is there
        const formattedAddress = address.replace(', EUA', '').replace(' ', '+')

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
                        <Text style={{ color: 'white' }}>{itemData.item.description}</Text>
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
                        <TextInput onChangeText={text => setSearchText(text)} autoFocus={true} keyboardAppearance={'dark'} color={'white'} />
                    </View>
                    <Button title={'Cancel'} color="white" onPress={() => {
                        props.setVisible()
                        setResults([])
                    }} />

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
        borderBottomColor: '#727272',
        borderBottomWidth: .2
    },
    textInputContainer: {
        width: '75%',
        height: '60%',
        backgroundColor: 'black',
        alignSelf: 'center',
        borderRadius: 10,
        borderColor: '#727272',
        borderWidth: .3,
        justifyContent: 'center',
        paddingLeft: '5%'
    },
    searchItemContainer: {
        width: '85%',
        height: 70,
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: '5%'
    },
    descriptionContainer: {
        marginLeft: '8%',
        height: '100%',
        width: '100%',
        borderBottomWidth: .2,
        borderBottomColor: '#727272',
        justifyContent: 'center',

    }
});

export default SearchModal;