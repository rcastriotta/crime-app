

import React from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Dimensions, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchBar = props => {
    return (
        <SafeAreaView style={{ flex: 1, position: 'absolute' }}>
            <TouchableOpacity
                activeOpacity={1.0}
                style={{ height: windowHeight < 700 ? windowHeight * .12 : windowHeight * .1, width: windowWidth }}
                onPress={() => props.setVisible()}>
                <View style={styles.container}>
                    <View style={styles.textContainer}>
                        <Ionicons name={"md-search"} size={20} color={'white'} />
                        <Text style={styles.text}>Search places</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth * .9,
        height: '60%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: '5%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,

    },
    textContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        paddingLeft: '5%'
    },
    text: {
        color: 'white',
        marginLeft: 10
    }
})

export default SearchBar;