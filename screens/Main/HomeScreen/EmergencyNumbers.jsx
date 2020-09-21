import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

// COMPONENTS
import Colors from '../../../constants/Colors';
import { useSelector } from 'react-redux';

// EXTERNAL
import axios from 'axios';

const EmergencyNumbers = props => {

    return (
        <Modal transparent={true} visible={props.visible} animationType="slide">
            <View style={styles.container}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => props.setVisible()} />
                <View style={styles.contentContainer}>
                    <Text style={styles.titleText}>Emergency numbers</Text>
                    <View style={styles.line} />

                    <View style={styles.numbersContainer}>
                        <View style={styles.number}>
                            <View style={styles.info}>
                                <Text style={styles.name}>Police/Fire</Text>
                                <Text style={styles.numberText}>911</Text>
                            </View>

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Call</Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.number}>
                            <View style={styles.info}>
                                <Text style={styles.name}>Poison Control</Text>
                                <Text style={styles.numberText}>(800) 222-1222</Text>
                            </View>

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Call</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.number}>
                            <View style={styles.info}>
                                <Text style={styles.name}>Animal Poison Control</Text>
                                <Text style={styles.numberText}>(888) 426-4435</Text>
                            </View>

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Call</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.number}>
                            <View style={styles.info}>
                                <Text style={styles.name}>Suicide Hotline</Text>
                                <Text style={styles.numberText}>(800)-273-8255</Text>
                            </View>

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Call</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        padding: 30,
        paddingHorizontal: 20
    },
    titleText: {
        color: Colors.accent,
        fontFamily: 'TTN-Bold',

        fontSize: 18
    },
    line: {
        backgroundColor: Colors.accent,
        height: 3,
        width: 40,
        borderRadius: 100,
        marginTop: 10
    },
    number: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '15%'
    },
    numbersContainer: {
        height: '100%',
        width: '100%',
        paddingTop: '2%',
        paddingBottom: '10%',
        justifyContent: 'space-evenly'

    },
    button: {
        width: '25%',
        height: '70%',
        borderRadius: 100,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    name: {
        fontSize: 18,
        fontFamily: 'TTN-Bold',
        fontWeight: 'bold',
        color: 'black'
    },
    info: {
        height: '100%',
        justifyContent: 'space-evenly'
    },
    numberText: {
        color: 'gray',
        fontSize: 15,
        fontFamily: 'TTN-Medium'

    },

});

export default EmergencyNumbers;