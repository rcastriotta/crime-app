import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

import { Ionicons, AntDesign } from '@expo/vector-icons';

// REDUX
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';


// COMPONENTS
import Field from '../../components/Auth/Field';

import Colors from '../../constants/Colors';
import { useLinkProps } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const LoginScreen = props => {
    const [pressedField, setPressedField] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setPressedField(props.selected)
    }, [props])

    // field values
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // validators
    const [emailValidated, setEmailValidated] = useState(false)
    const [passwordValidated, setPasswordValidated] = useState(false)

    const dispatch = useDispatch();
    const submitButtonHandler = async () => {
        if (emailValidated && passwordValidated) {
            setLoading(true)

            await dispatch(authActions.login(email, password)).catch((err) => {
                setLoading(false)
                console.log(err)

            })

        }
    }

    return (
        <Modal visible={props.visible} transparent={true} style={{ flex: 1 }} animationType="slide">
            <SafeAreaView style={styles.screen}>

                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.headerText}>Welcome Back!</Text>
                        <Text style={styles.bodyText}>Fill in the required info below</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.setVisible(false)}>
                        <Ionicons name={"ios-arrow-down"} size={25} color={'white'} style={{}} />

                    </TouchableOpacity>


                </View>


                <View style={styles.fieldsContainer}>
                    <Field setEmail={text => setEmail(text)} setValidated={(value) => setEmailValidated(value)} icon="md-mail" label="EMAIL" pressed={pressedField === 'email' ? true : false} onComplete={() => setPressedField(null)} onPress={() => setPressedField('email')} />
                    <Field setPassword={text => setPassword(text)} setValidated={(value) => setPasswordValidated(value)} icon="md-lock" label="PASSWORD" pressed={pressedField === 'password' ? true : false} onComplete={() => setPressedField(null)} onPress={() => setPressedField('password')} />
                </View>



                <View style={styles.buttonsContainer}>
                    <TouchableOpacity activeOpacity={passwordValidated && emailValidated ? .7 : 1.0} onPress={submitButtonHandler} >
                        <View style={passwordValidated && emailValidated ? { ...styles.button, opacity: 1.0 } : { ...styles.button, opacity: .3 }}><Text style={styles.buttonText}>SIGN IN</Text></View>
                    </TouchableOpacity>
                    {loading ? <ActivityIndicator color="white" /> : null}
                    <View style={{ flexDirection: 'row', marginBottom: '10%' }}>
                        <Text style={{ color: 'white', marginRight: 5, fontFamily: 'TTN-Bold' }}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => props.setVisible(true)}><Text style={{ color: Colors.accent, fontFamily: 'TTN-Bold' }}>Sign up</Text></TouchableOpacity>
                    </View>
                </View>


            </SafeAreaView>
        </Modal>




    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'rgba(17, 20, 34, .98)'
    },
    headerContainer: {

        paddingHorizontal: 20,
        paddingBottom: 20,
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 25,
        fontFamily: 'TTN-Bold',
        color: 'white',
        marginBottom: 10,

    },
    bodyText: {
        fontSize: 15,
        color: Colors.accent,
        fontFamily: 'TTN-Medium'
    },

    fieldsContainer: {
        paddingHorizontal: 10,
        height: windowHeight * .2,
    },
    buttonsContainer: {

        paddingHorizontal: 20,
        alignItems: 'center',

        flex: 3,
        paddingTop: 40,
        justifyContent: 'space-between'
    },
    button: {
        width: 200,
        height: 50,
        borderRadius: 100,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: 'TTN-Bold',
        fontSize: 15,
        color: 'white'
    }
})

export default LoginScreen;