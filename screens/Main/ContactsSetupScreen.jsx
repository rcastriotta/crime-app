import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';

// COMPONENTS
import SelectContacts from '../../components/Main/SelectContacts';
import Colors from '../../constants/Colors';

// REDUX
import * as authActions from '../../store/actions/auth';
import { useDispatch } from 'react-redux';

const ContactsSetupScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [contactsList, setContactsList] = useState([])
    const dispatch = useDispatch();

    const getContacts = async () => {
        //will only run if permissions need to be verified
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
            });
            const compare = (a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            }

            data.sort(compare);
            setContactsList(data)
            setModalVisible(true)
        }

    }


    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.textContainer}>
                <Text style={styles.header}>Add emergency contacts</Text>
                <Text style={styles.paragraph}>If ever in danger, Crime App allows you to send out an SOS text message to all selected contacts at once.</Text>
            </View>

            <View style={styles.iconContainer}>
                <Ionicons name={"md-people"} size={200} color={Colors.accent} />

            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={getContacts} style={styles.buttonFiled}><Text style={{ ...styles.buttonText, color: 'white' }}>Add</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home')
                    dispatch(authActions.setupComplete())
                }} style={styles.button}><Text style={{ ...styles.buttonText, color: Colors.accent }}>Skip</Text></TouchableOpacity>
            </View>
            <SelectContacts screen={"Home"} navigation={navigation} setVisible={() => setModalVisible(false)} visible={modalVisible} data={contactsList} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '20%',
        paddingHorizontal: 30
    },
    header: {
        textAlign: 'center',
        color: 'white',
        fontSize: 22,
        fontFamily: 'TTN-Bold'
    },
    paragraph: {
        marginTop: 10,
        textAlign: 'center',
        color: '#C1C1C1',
        fontSize: 18,
        fontFamily: 'TTN-Medium'
    },
    iconContainer: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    buttonsContainer: {
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonFiled: {
        width: '80%',
        height: '18%',
        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    button: {
        marginTop: 15,
        width: '80%',
        height: '18%',
        backgroundColor: Colors.secondary,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'TTN-Bold'
    },

})

export default ContactsSetupScreen;