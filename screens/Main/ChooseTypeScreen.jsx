import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';

// COMPONENTS  
import Colors from '../../constants/Colors';


const ChooseTypeScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.headingContainer}>
                    <Text style={styles.headingText}>Report a crime</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Tabbed')}>
                        <Ionicons name={"md-close"} size={28} color={Colors.accent} />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingRight: 40 }}>
                    <Text style={styles.paragraphText}>By reporting crimes you help keep others around you safe</Text>
                </View>

                <View style={styles.typesContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Add', { title: 'Report Assault', type: 'Assault' })} style={styles.type}>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/types/assault.png')} />
                        </View>
                        <Text style={styles.typeText}>Assault</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Add', { title: 'Report Small Item Theft', type: 'Small Item Theft' })} style={styles.type}>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/types/smallItemTheft.png')} />
                        </View>
                        <Text style={styles.typeText}>Small Item Theft</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Add', { title: 'Report Shooting', type: 'Shooting' })} style={styles.type}>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/types/shooting.png')} />
                        </View>
                        <Text style={styles.typeText}>Shooting</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Add', { title: 'Report Vandalism', type: 'Vandalism' })} style={styles.type}>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/types/vandalism.png')} />
                        </View>
                        <Text style={styles.typeText}>Vandalism</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Add', { title: 'Report Vehicle Theft', type: 'Vehicle Theft' })} style={styles.type}>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/types/vehicleTheft.png')} />
                        </View>
                        <Text style={styles.typeText}>Vehicle Theft</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Add', { title: 'Report Property Damage', type: 'Property Damage' })} style={styles.type}>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/types/propertyDamage.png')} />
                        </View>
                        <Text style={styles.typeText}>Property Damage</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Add', { title: 'Other', type: 'Other' })} style={styles.type}>
                        <View style={styles.imageContainer}>
                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/types/other.png')} />
                        </View>
                        <Text onPress={() => navigation.navigate('Add', { title: 'Report an assault' })} style={styles.typeText}>Other</Text>
                    </TouchableOpacity>


                </View>
            </View>
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
        paddingBottom: 0,
        flex: 1
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headingText: {
        color: 'white',
        fontSize: 25,
        fontFamily: 'TTN-Bold'
    },
    paragraphText: {
        color: '#C1C1C1',
        marginTop: '3%',
        fontFamily: 'TTN-Medium'
    },
    typesContainer: {
        width: '100%',
        // backgroundColor: 'red',
        flex: 1,
        marginTop: '5%',
        justifyContent: 'space-evenly'
    },
    type: {
        width: '100%',
        height: '10%',
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        aspectRatio: 1,
        height: '85%',
        backgroundColor: Colors.accent,
        borderRadius: 100,
        padding: 13
    },
    typeText: {
        marginLeft: '10%',
        color: 'white',
        fontFamily: 'TTN-Bold',
        fontSize: 18
    }

});

export default ChooseTypeScreen;