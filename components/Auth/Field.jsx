import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Dimensions } from 'react-native';

import { Ionicons, AntDesign } from '@expo/vector-icons';
import Validator from 'email-validator';
import PasswordValidator from 'password-validator';


var schema = new PasswordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100                                                                                    
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Password', 'password']); // Blacklist these values

// Validate against a password string

// getting dimensions of screen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Field = props => {
    const [fieldText, setFieldText] = useState('')
    const [validated, setValidated] = useState(false)
    const [textInputRef, setTextInputRef] = useState(null)


    useEffect(() => {
        if (props.label === 'EMAIL') {
            setValidated(Validator.validate(fieldText))
            props.setValidated(Validator.validate(fieldText))
            props.setEmail(fieldText)
        } else if (props.label === 'PASSWORD') {
            setValidated(schema.validate(fieldText))
            props.setValidated(schema.validate(fieldText))
            props.setPassword(fieldText)

        } else if (props.label === 'CONFIRM PASSWORD') {

            setValidated(props.password === fieldText && props.password !== '')
            props.setValidated(props.password === fieldText)

        } else if (props.label === 'FULL NAME') {
            setValidated(fieldText.length > 3)
            props.setValidated(fieldText.length > 3)
            props.setName(fieldText)
        }
    }, [fieldText, props])



    return (
        <TouchableWithoutFeedback onPress={() => {
            props.onPress()
            // textInputRef.blur()
        }
        }>
            <View style={!props.pressed ? styles.container : { ...styles.container, backgroundColor: 'rgba(255, 255, 255, 0.07)' }}>
                <View style={{ width: '10%', alignItems: 'center', marginRight: 10 }}>
                    <Ionicons name={props.icon} size={25} color={props.pressed ? 'white' : '#9F9F9F'} style={styles.icon} />
                </View>
                <View style={styles.textInputContainer}>
                    <View>
                        <Text style={!props.pressed ? styles.label : { ...styles.label, color: '#9F9F9F' }}>{props.label}</Text>

                    </View>
                    {props.pressed || fieldText ? <TextInput
                        autoFocus={true}
                        keyboardAppearance={'dark'}
                        style={{ height: 35, width: '90%', color: 'white', fontFamily: 'TTN-Bold', fontSize: 15 }}
                        selectionColor="white"
                        onSubmitEditing={props.onComplete}
                        autoCorrect={false}
                        value={fieldText}
                        onChangeText={text => setFieldText(text)}
                        onFocus={() => props.onPress()}
                        ref={(ref) => setTextInputRef(ref)}

                    /> : null}
                </View>
                {validated ? <Ionicons name={'md-checkmark'} size={25} color={'#29D680'} style={styles.icon} /> : <View style={styles.checkMarkPlaceholder} />}

            </View>

        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        height: windowHeight * .1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        paddingRight: 20,
        borderRadius: 30
    },
    icon: {

    },
    label: {
        fontSize: 12,
        fontFamily: 'TTN-Medium',
        color: 'white'
    },
    textInputContainer: {
        width: '80%'
    },
    checkMarkPlaceholder: {
        width: 20,
        height: 20,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'gray'
    }
})

export default Field;