import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// COMPONENTS
import Firebase from '../../api/firebase/config';

const CrimeReport = props => {
    const [imageUrl, setImageUrl] = useState(null)
    const componentIsMounted = useRef(true)

    useEffect(() => {
        // when component is unmounted this return is called
        return () => {
            componentIsMounted.current = false
        }
    }, [])

    useEffect(() => {
        if (props.authorName) {
            (async () => {
                Firebase.storage().ref().child(`${props.authorId}/profilePicture/profile.jpg`).getDownloadURL().then(function (url) {
                    if (componentIsMounted.current || props.refreshed) {
                        setImageUrl(url)
                    }
                }).catch(function (error) {
                    return
                });
            })();
        }
    }, [props])

    return (
        <View style={{ ...styles.container, ...props.styles }}>
            <View>
                <Text style={{ ...styles.type, color: props.authorName ? Colors.accent : 'rgba(0, 90, 255, 1.0)', fontSize: 15 }}>{props.type}</Text>
            </View>
            <View>
                <Text style={styles.descriptionText}>{props.description ? props.description : `(Police Report) - ${props.type}`}</Text>
                <View style={styles.address}>
                    <Ionicons name={"md-pin"} size={20} color={'gray'} style={{ marginRight: 8 }} />
                    <Text style={styles.addressText}>{props.address}</Text>
                </View>
            </View>



            <View style={styles.bottomContainer}>
                <View style={styles.author}>
                    {!props.authorName
                        ? <View style={styles.policeReportContainer}>
                            <View style={styles.imageContainer}>
                                <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/police.png')} />
                            </View>
                            <Text style={styles.authorText}>Police Report</Text>
                        </View>
                        : <View style={styles.authorContainer}>
                            <View style={styles.imageContainer}>
                                {imageUrl
                                    ? <Image style={{ height: '100%', width: '100%', marginLeft: -4, borderRadius: 100 }} source={{ uri: imageUrl }} />
                                    : <Image style={{ height: '100%', width: '100%', marginLeft: -4 }} source={require('../../assets/images/userProfile.png')} />
                                }

                            </View>
                            <Text style={{ ...styles.authorText, color: 'white', marginLeft: '3%', fontWeight: 'normal' }}>{props.authorName}</Text>
                        </View>
                    }

                </View>
                <Text style={props.authorName ? styles.timeText : { ...styles.timeText, color: 'rgba(0, 90, 255, 1.0)' }}>{props.timeSinceReport}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'space-between',
        borderRadius: 16,

    },
    type: {
        fontFamily: 'TTN-Bold',
        color: 'white',
        fontSize: 16,
    },

    descriptionText: {
        fontSize: 17,
        color: 'white',
        fontFamily: 'TTN-Bold'
    },
    address: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingRight: 10

    },
    addressText: {
        color: 'gray',
        fontFamily: 'TTN-Medium'
    },
    bottomContainer: {
        flexDirection: 'row',
    },
    author: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeText: {
        color: Colors.accent,
        fontFamily: 'TTN-Medium'
    },
    imageContainer: {
        height: 27,
        width: 27,
        marginRight: 5

    },
    bottomContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    },
    authorText: {
        color: '#005aff',
        fontFamily: 'TTN-Medium'

    },
    policeReportContainer: {
        backgroundColor: 'rgba(0, 90, 255, 0.15)',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        paddingRight: 12,
        borderRadius: 15,
        justifyContent: 'space-between',

    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        width: 30,
        height: 2,
        backgroundColor: Colors.accent,
        marginTop: '2%',
        marginLeft: '1%',
        borderRadius: 16,
        shadowColor: Colors.accent,
        shadowOpacity: 1,
        shadowOffset: { width: 3, height: 4 },
        shadowRadius: 10,
    }
})

export default CrimeReport;