import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, Image, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';

import Colors from '../../constants/Colors';

import { Ionicons } from '@expo/vector-icons';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from '../../store/actions/user';
import * as authActions from '../../store/actions/auth';

// COMPONENTS
import Contact from './Contact';

const SelectContacts = props => {
    const [currentData, setCurrentData] = useState(null)
    const [selectedContacts, setSelectedContacts] = useState(null)

    const emergencyContacts = useSelector(state => state.user.emergencyContacts)
    const data = props.data

    useEffect(() => {
        setCurrentData(props.data)
        setSelectedContacts(emergencyContacts)
    }, [props])


    const search = (text) => {
        setCurrentData(data.filter(el => el.name.includes(text)))
    }

    const pressHandler = (value, data) => {
        if (value) {
            setSelectedContacts([...selectedContacts, data])
        } else {
            setSelectedContacts(selectedContacts.filter(el => el.id !== data.id))
        }
    }

    const renderContacts = (itemData) => {
        return (
            <Contact pressed={selectedContacts.filter(el => el.id === itemData.item.id).length > 0} image={itemData.item.imageAvailable ? itemData.item.image.uri : null} id={itemData.item.id} name={itemData.item.name} onPress={(value, index) => pressHandler(value, itemData.item)} />
        )
    }

    dispatch = useDispatch()
    const submitButtonHandler = () => {
        props.setVisible()
        dispatch(userActions.addContacts(selectedContacts))
        dispatch(authActions.setupComplete())
        props.navigation.navigate(props.screen)
    }

    return (
        <Modal animationType="slide" visible={props.visible}>
            <SafeAreaView style={styles.screen}>
                <View style={styles.headerContainer}>
                    <Text style={styles.text}>Select up to 10</Text>
                    <TouchableOpacity onPress={submitButtonHandler} style={styles.submitButton}>
                        <Ionicons name={"md-checkmark"} size={24} color={'white'} style={{ paddingTop: 2 }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchBar}>
                    <Ionicons name={"md-search"} size={23} color={'white'} />
                    <TextInput keyboardAppearance={'dark'} placeholder="Search" placeholderTextColor="gray" onChangeText={search} selectionColor="white" style={{ color: 'white', marginLeft: '5%', width: '100%' }} />
                </View>
                <View style={styles.flatlistContainer}>
                    <FlatList style={{ width: '100%' }} data={currentData} renderItem={renderContacts} />
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({

    screen: {
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        flex: 1
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        height: '10%'
    },
    text: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'white'
    },
    submitButton: {
        width: 30,
        height: 30,
        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBar: {
        marginTop: '1%',
        width: '90%',
        height: '6%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 100,
        paddingLeft: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    flatlistContainer: {
        paddingTop: '5%',
        width: '100%',
        height: '100%',
    }

});

export default SelectContacts;