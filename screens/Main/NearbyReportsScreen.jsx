import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions } from 'react-native';

// COMPONENTS
import Colors from '../../constants/Colors';
import CrimeReport from '../../components/Main/CrimeReport';


// EXTERNAL
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';


// REDUX
import { useSelector } from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const NearbyReportsScreen = () => {
    const crimes = useSelector(state => state.crimes.nearbyCrimes)
    const location = useSelector(state => state.location.currentLocation)
    const [orderedCrimes, setOrderedCrimes] = useState(null)

    useEffect(() => {
        if (crimes) {
            setOrderedCrimes(crimes.sort(function (x, y) {
                return y.reportedAt - x.reportedAt;
            }))
        }
    }, [crimes])

    const renderCrime = (itemData) => {
        return (
            <CrimeReport
                key={itemData.item.id}
                description={itemData.item.description}
                // setSelected={() => setCrimeSelected(null)}
                address={itemData.item.address}
                type={itemData.item.type}
                timeSinceReport={itemData.item.formattedDate}
                authorName={itemData.item.authorName}
                authorId={itemData.item.authorId}
                styles={{ ...styles.crimeReport }}
            />
        )
    }
    return (

        <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.primary }}>
            <View style={styles.topContainer}>
                <Text style={styles.name}>Nearby Crimes</Text>
                <Text style={styles.locationText}>{crimes && crimes.length + ' total'}</Text>
            </View>
            <View>
                {crimes
                    ? <FlatList data={orderedCrimes} renderItem={renderCrime} contentContainerStyle={{ paddingHorizontal: '5%', paddingTop: hp('3%'), paddingBottom: hp('10%') }} />
                    : !location ? <Text style={styles.noLocationText}>Couldn't get current location</Text> : <MaterialIndicator size={20} color={Colors.accent} style={{ marginBottom: '50%' }} />}


            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        // justifyContent: 'space-between',
        width: wp('90%'),
        height: hp('10%'),
        justifyContent: 'space-evenly'

    },
    name: {
        fontSize: wp('7%'),
        color: 'white',
        fontFamily: 'TTN-Medium'
    },
    locationText: {
        fontFamily: 'TTN-Bold',
        color: Colors.accent
    },
    crimeReport: {
        backgroundColor: Colors.secondary,
        alignSelf: 'center',
        width: '90%',
        height: windowHeight < 700 ? hp('30%') : hp('23%'),
        borderRadius: 20,
        shadowColor: 'black',
        shadowOpacity: .3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        marginHorizontal: '2%',
        width: windowWidth * .96,
        marginTop: 0,
        padding: 20,
        marginBottom: hp('3%')
    },
    noLocationText: {
        fontFamily: 'TTN-Medium',
        color: Colors.accent,
        marginTop: '70%'
    }
})

export default NearbyReportsScreen;