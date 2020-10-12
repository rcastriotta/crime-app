import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import { MaterialIndicator } from 'react-native-indicators';
import { SafeAreaView } from 'react-navigation';

// COMPONENTS
import Colors from '../../../constants/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchBar = props => {
    return (
        <SafeAreaView style={{ flex: 1, position: 'absolute' }} forceInset={{ top: 'always' }} >
            <TouchableOpacity
                activeOpacity={1.0}
                style={{ height: windowHeight < 700 ? windowHeight * .12 : windowHeight * .1, width: windowWidth }}
                onPress={() => props.setVisible()}>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Ionicons name={"md-search"} size={20} color={'white'} />
                        <Text style={styles.text}>Search places</Text>
                    </View>
                    {props.isFetching
                        ? <MaterialIndicator size={15} color={Colors.accent} />
                        : <Text style={styles.radiusText}>reports within {props.radius ? props.radius : 0.5} mi</Text>}
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth * .9,
        height: '60%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: '5%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: '5%',


    },
    textContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        paddingLeft: '5%',
    },
    text: {
        color: 'white',
        marginLeft: 10,
        fontFamily: 'TTN-Medium',
    },
    radiusText: {
        color: Colors.accent,
        fontFamily: 'TTN-Bold'
    }
})

export default SearchBar;