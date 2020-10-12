import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';

// COMPONENTS
import Colors from '../../constants/Colors';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import Validator from 'email-validator';
import PasswordValidator from 'password-validator';
import firebase from 'firebase'
import { MaterialIndicator } from 'react-native-indicators';


// REDUX
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from '../../store/actions/user';

var schema = new PasswordValidator();

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100                                                                                    
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Password', 'password']);

const UpdateInfo = ({ navigation, route }) => {
    const type = route.params.type
    const [focused, setFocused] = useState(null)
    const [updating, setUpdating] = useState(false)
    const currentEmail = useSelector(state => state.user.email)

    const [fieldOneText, setFieldOneText] = useState('')
    const [fieldTwoText, setFieldTwoText] = useState('')
    const [fieldThreeText, setFieldThreeText] = useState('')

    const [oneValidated, setOneValidated] = useState(false)
    const [twoValidated, setTwoValidated] = useState(false)
    const [threeValidated, setThreeValidated] = useState(false)

    const [submitted, setSubmitted] = useState(false)


    useEffect(() => {
        if (type === 'email') {
            setTwoValidated(Validator.validate(fieldTwoText))
            setThreeValidated(fieldTwoText === fieldThreeText && fieldThreeText !== '')
        } else if (type === 'password') {
            setTwoValidated(schema.validate(fieldTwoText))
            setThreeValidated(fieldTwoText === fieldThreeText && fieldThreeText !== '')
        }
    }, [fieldOneText, fieldTwoText, fieldThreeText])

    const dispatch = useDispatch()

    const submitButtonHandler = async () => {
        // reauthenticate 
        setUpdating(true)
        setOneValidated(true)
        const user = Firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            fieldOneText
        );
        await user.reauthenticateWithCredential(credential).then(function () {
            if (type === 'email') {
                if (twoValidated && threeValidated) {
                    dispatch(userActions.updateEmail(fieldThreeText))
                        .then(() => {
                            navigation.navigate('SettingsHome')
                        }).catch(function (error) {
                            const errorString = error.toString()
                            if (errorString.includes('The email address is already in use by another account.')) {
                                Alert.alert(
                                    "Email address already exists",
                                    "Please try again",
                                    [
                                        { text: "OK" }
                                    ],
                                    { cancelable: false }
                                );
                            }
                        });

                }
            } else if (type === 'password') {
                if (twoValidated && threeValidated) {

                    user.updatePassword(fieldThreeText).then(function () {
                        navigation.navigate('SettingsHome')
                    }).catch(function (error) {
                        throw (error)
                    });
                }
            }
        }).catch(function (error) {
            const errorString = error.toString()
            if (errorString.includes('invalid')) {
                setOneValidated(false)
            } else {
                Alert.alert(
                    "Error Updating Information",
                    "Please try again",
                    [
                        { text: "OK" }
                    ],
                    { cancelable: false }
                );
                console.log(error)
            }
        });
        setUpdating(false)
        setSubmitted(true)
    }


    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('SettingsHome')}>
                            <Ionicons name={"ios-arrow-back"} size={28} color={Colors.accent} style={{}} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>{type === 'email' ? 'Update Email' : 'Change Password'}</Text>
                    </View>

                    <View style={{ flex: 1 }} />
                </View>
                <View style={styles.fields}>
                    <TextInput
                        keyboardAppearance={'dark'}
                        selectionColor="white"
                        placeholder={type === 'password' ? 'Old Password' : 'Password'}
                        placeholderTextColor={'gray'}
                        onBlur={() => setFocused(null)}
                        autoFocus={true}
                        onFocus={() => setFocused(1)}
                        style={focused === 1 ? styles.focused : submitted && !oneValidated ? { ...styles.notFocused, borderBottomColor: 'red' } : styles.notFocused}
                        onChangeText={(text) => {
                            setFieldOneText(text)
                            setSubmitted(false)
                        }}

                    />
                    <TextInput
                        keyboardAppearance={'dark'}
                        selectionColor="white"
                        onFocus={() => setFocused(2)}
                        onBlur={() => setFocused(null)}
                        placeholder={type === 'password' ? 'New Password' : 'New Email'}
                        placeholderTextColor={'gray'}
                        style={focused === 2 ? styles.focused : submitted && !twoValidated ? { ...styles.notFocused, borderBottomColor: 'red' } : styles.notFocused}
                        onChangeText={(text) => {
                            setFieldTwoText(text)
                            setSubmitted(false)
                        }}
                    />

                    <TextInput
                        keyboardAppearance={'dark'}
                        selectionColor="white"
                        onFocus={() => setFocused(3)}
                        onBlur={() => setFocused(null)}
                        placeholder={type === 'password' ? 'Confirm New Password' : 'Confirm New Email'}
                        placeholderTextColor={'gray'}
                        style={focused === 3 ? styles.focused : submitted && !threeValidated ? { ...styles.notFocused, borderBottomColor: 'red' } : styles.notFocused}
                        onChangeText={(text) => {
                            setFieldThreeText(text)
                            setSubmitted(false)
                        }}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={submitButtonHandler}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flexGrow: 1 }}>
                        <Text style={styles.buttonText}>{type === 'password' ? 'Change Password' : 'Update Email'}</Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        {updating && <MaterialIndicator size={15} color={'white'} style={{ alignSelf: 'flex-start' }} />}
                    </View>

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.primary,
        flex: 1
    },
    container: {
        paddingHorizontal: 25,
        paddingTop: 10,
        flex: 1,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    headerTextContainer: {
        width: '100%',
        alignItems: 'center',
        width: '70%'
    },
    headerText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'TTN-Bold'
    },
    fields: {
        height: '50%',
        width: '100%',
        marginTop: '15%',
    },
    focused: {
        borderBottomColor: Colors.accent,
        borderBottomWidth: 2,
        height: '15%',
        marginBottom: '10%',
        color: 'white',
        fontFamily: 'TTN-Medium'
    },
    notFocused: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        height: '15%',
        marginBottom: '10%',
        color: 'white',
        fontFamily: 'TTN-Medium'
    },
    button: {
        width: '100%',
        height: '8%',
        backgroundColor: Colors.accent,
        borderRadius: 10,
        marginTop: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        color: 'white',
        fontFamily: 'TTN-Bold',
        alignSelf: 'center'
    }
})

export default UpdateInfo;