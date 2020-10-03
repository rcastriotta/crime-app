import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, Image } from 'react-native';

// EXTERNAL
import Swiper from 'react-native-swiper'
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// COMPONENTS
import Colors from '../../constants/Colors';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';

const windowWidth = Dimensions.get('window').width;


const WelcomeScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [signupModalVisible, setSignupModalVisible] = useState(false)
    const [loginModalVisible, setLoginModalVisible] = useState(false)
    let _swiper = null

    const buttonPressHandler = () => {
        if (currentIndex === 2) {
            setSignupModalVisible(true)
        }
        _swiper.scrollBy(currentIndex + 1)
    }

    return (
        <View style={styles.screen}>

            <Swiper automaticallyAdjustContentInsets={false}
                showsHorizontalVerticalIndicator={true}
                showsPagination={true}
                bounces={false}
                loop={false}
                onIndexChanged={(index) => setCurrentIndex(index)}
                ref={(swiper) => { _swiper = swiper; }}
                dotColor={'#7B7B7B'}
                activeDotColor={Colors.accent}
            >

                <ImageBackground source={require('../../assets/images/background1.jpg')} style={styles.imgBackground} imageStyle={{
                    width: windowWidth * 3,
                    height: '100%',
                    transform: [
                        { translateX: 0, },
                        { translateY: 0, },

                    ]

                }}>
                    <View style={styles.textContainer}>
                        <Text style={styles.heading}>Stay safe at all times</Text>
                        <Text style={styles.bodyText}>See nearby crimes in your area posted by citizens and by the police. Find nearby safe places. Send out safety alerts.</Text>
                    </View>

                </ImageBackground>



                <ImageBackground source={require('../../assets/images/background1.jpg')} style={styles.imgBackground} imageStyle={{
                    width: windowWidth * 3,
                    height: '100%',
                    transform: [
                        { translateX: 0 - windowWidth, },
                        { translateY: 0, },

                    ]

                }}>
                    <View style={styles.textContainer}>
                        <Text style={styles.heading}>Reduce levels of crime</Text>
                        <Text style={styles.bodyText}>Help bring the offender(s) to justice to make sure crimes don't get repeated.</Text>
                    </View>
                </ImageBackground>

                <ImageBackground source={require('../../assets/images/background1.jpg')} style={styles.imgBackground} imageStyle={{
                    width: '300%',
                    height: '100%',
                    transform: [
                        { translateX: 0 - (windowWidth * 2), },
                        { translateY: 0, },

                    ]
                }}>

                    <View style={styles.textContainer}>
                        <Text style={styles.heading}>Keep others safe</Text>
                        <Text style={styles.bodyText}>File a crime report directly from your smartphone to keep others aware of threats nearby.</Text>
                    </View>
                </ImageBackground>




            </Swiper>


            <View style={styles.imageContainer}>
                <Image source={require('../../assets/iconWhite.png')} style={{ width: '100%', height: '100%' }} />
            </View>
            <TouchableOpacity style={styles.button} onPress={buttonPressHandler} activeOpacity={0.7}>
                <LinearGradient colors={['#AB9CFF', Colors.accent]} style={{ width: '100%', height: '100%', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.buttonText}>{currentIndex === 2 ? 'Get Started' : 'Continue'}</Text>

                </LinearGradient>
            </TouchableOpacity>
            <SignupScreen selected={'name'} visible={signupModalVisible} setVisible={(showOther) => {
                setSignupModalVisible(false)

                if (showOther) {
                    setLoginModalVisible(true)
                }
            }} />
            <LoginScreen selected={'email'} visible={loginModalVisible} setVisible={(showOther) => {
                setLoginModalVisible(false)

                if (showOther) {
                    setSignupModalVisible(true)
                }
            }} />

        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'

    },
    button: {
        width: '80%',
        aspectRatio: 5.5,
        backgroundColor: Colors.accent,
        position: 'absolute',
        bottom: '15%',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: Colors.accent,
        borderRadius: 100,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,

    },

    buttonText: {
        fontSize: 20,
        fontFamily: 'TTN-Bold',
        color: 'white'
    },
    textContainer: {
        marginTop: 120,
        paddingHorizontal: '5%'
    },
    heading: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'TTN-Bold',
        textAlign: 'center',

    },
    bodyText: {
        color: '#EEEEEE',
        textAlign: 'center',
        fontSize: 15,
        marginHorizontal: 15,
        marginTop: 20,
        lineHeight: 25,
        fontFamily: 'TTN-Medium'
    },
    imageContainer: {
        position: 'absolute',
        width: 100,
        height: 100,
        bottom: hp('70%')
    }


})

export default WelcomeScreen;