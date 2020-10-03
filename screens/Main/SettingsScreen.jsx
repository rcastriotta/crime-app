import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, TouchableWithoutFeedback } from 'react-native';

// COMPONENTS
import Colors from '../../constants/Colors';
import SelectContacts from '../../components/Main/SelectContacts';
import Firebase from '../../api/firebase/config';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { MaterialIndicator } from 'react-native-indicators';
import * as ImageManipulator from "expo-image-manipulator";

// REDUX
import { useSelector } from 'react-redux';
import * as authActions from '../../store/actions/auth';

const SettingsModal = ({ navigation }) => {
    const name = useSelector(state => state.user.name)
    const email = useSelector(state => state.user.email)
    const uid = useSelector(state => state.user.uid)
    const [modalVisible, setModalVisible] = useState(false)
    const [contactsList, setContactsList] = useState([])
    const [imageUploading, setImageUploading] = useState(false)
    const [profilePic, setProfilePic] = useState(null)

    const fetchMyProfileImage = () => {
        Firebase.storage().ref().child(`${uid}/profilePicture/profile.jpg`).getDownloadURL().then(function (url) {
            setProfilePic(url)

        }).catch(function () {
            setProfilePic(false)
        });
    }

    useEffect(() => {
        fetchMyProfileImage()
    }, [])

    const verifyPermissions = async () => {
        //will only run if permissions need to be verified
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (result.status !== 'granted') {
            Alert.alert('Insufficient permissions!',
                'You need to grant camera permissions', [{ text: 'Okay!' }])
            return false;
        }
        return true;
    }

    const uriToBlob = async (uri) => {
        try {
            const fetchResponse = await fetch(uri);
            const blob = await fetchResponse.blob();
            // console.log(blob)
            return blob
        } catch (error) {
            console.log('ERR: ' + error.message);
        }
    }

    const getImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1.0
        });

        if (image.uri) {
            const manipResult = await ImageManipulator.manipulateAsync(
                image.uri,
                [],
                { compress: 0.0, format: ImageManipulator.SaveFormat.JPG }
            );

            setImageUploading(true)
            const blob = await uriToBlob(manipResult.uri);
            const storageRef = Firebase.storage().ref(`${uid}/profilePicture/profile.jpg`);
            storageRef.put(blob)
                .then(function () {
                    setImageUploading(false)
                    fetchMyProfileImage()
                })
                .catch((error) => {
                    setImageUploading(false)
                    console.log(error)
                });
        }
    };

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
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={1.0} onPress={getImageHandler} style={styles.imageContainer}>
                    {imageUploading || profilePic === null
                        ? <MaterialIndicator size={20} color={Colors.accent} />
                        : <Image source={profilePic ? { uri: profilePic } : require('../../assets/images/userProfile.png')} style={styles.image} />
                    }
                </TouchableOpacity>
                <View style={styles.textBox}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyReports')}>
                        <Text style={styles.buttonText}>My Reports</Text>
                        <Ionicons name={"ios-arrow-forward"} size={28} color={Colors.accent} style={{ marginTop: '1%' }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => {
                        getContacts()
                        setModalVisible(true)
                    }}>
                        <Text style={styles.buttonText}>Update Emergency Contacts</Text>
                        <Ionicons name={"ios-arrow-forward"} size={28} color={Colors.accent} style={{ marginTop: '1%' }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateInfo', { type: 'email' })}>
                        <Text style={styles.buttonText}>Update Email</Text>
                        <Ionicons name={"ios-arrow-forward"} size={28} color={Colors.accent} style={{ marginTop: '1%' }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateInfo', { type: 'password' })}>
                        <Text style={styles.buttonText}>Change Password</Text>
                        <Ionicons name={"ios-arrow-forward"} size={28} color={Colors.accent} style={{ marginTop: '1%' }} />
                    </TouchableOpacity>

                </View>

                <View style={styles.logout}>
                    <TouchableWithoutFeedback onPress={() => dispatch(authActions.signOut())}>
                        <Text style={{ color: 'gray', fontFamily: 'TTN-Medium' }}>Logout</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <SelectContacts screen={"SettingsHome"} navigation={navigation} data={contactsList} visible={modalVisible} setVisible={() => setModalVisible(false)} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    container: {
        padding: 25,
        flex: 1,
        alignItems: 'center'
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    imageContainer: {
        borderWidth: 2,
        borderColor: Colors.accent,
        borderRadius: 100,
        width: '50%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 100
    },
    textBox: {
        height: '8%',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: '8%',
        alignItems: 'center',
    },
    name: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'TTN-Bold',
    },
    email: {
        color: 'gray',
        fontFamily: 'TTN-Medium'
    },
    buttonsContainer: {
        flex: 5,
        width: '100%',
        paddingVertical: '10%',
        justifyContent: 'space-between'
    },
    button: {
        backgroundColor: Colors.secondary,
        height: '20%',
        width: '100%',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    buttonText: {
        color: 'white',
        fontFamily: 'TTN-Bold',
        color: Colors.accent
    },
    logout: {
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        alignItems: 'center',
    }

})

export default SettingsModal;