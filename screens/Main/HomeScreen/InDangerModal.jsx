import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';

// COMPONENTS
import Colors from '../../../constants/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const InDangerModal = props => {

    return (
        <Modal animationType={'slide'} visible={props.visible} transparent={true} style={styles.screen}>
            <View style={styles.container}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => props.setVisible()} />
                <View style={styles.contentContainer}>
                    <Text style={{ color: 'gray', fontFamily: 'TTN-Medium' }}>SELECT ONE</Text>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => props.pressHandler('numbers')}>
                            <Text style={styles.text}>Call emergency number</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => props.pressHandler('places')}>
                            <Text style={styles.text}>Find nearby safe places</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => props.pressHandler('SMS')}>
                            <Text style={styles.text}>Send out group SMS alert</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    contentContainer: {
        height: windowHeight < 700 ? '55%' : '45%',
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: '10%'
    },
    buttonsContainer: {
        flex: 1,
        //backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    button: {
        width: '100%',
        height: '20%',
        borderRadius: 100,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        fontFamily: 'TTN-Bold'
    }
})

export default InDangerModal;