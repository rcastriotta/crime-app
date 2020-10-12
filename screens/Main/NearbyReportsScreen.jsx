import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native';

// COMPONENTS
import Colors from '../../constants/Colors';
import CrimeReport from '../../components/Main/CrimeReport';
import checkIfLargeCity from '../../utils/checkIfLargeCity';


// EXTERNAL
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIndicator } from 'react-native-indicators';
import { SafeAreaView } from 'react-navigation';


// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as crimeReportsActions from '../../store/actions/crimeReports';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const NearbyReportsScreen = () => {
    const crimes = useSelector(state => state.crimes.nearbyCrimes)
    const location = useSelector(state => state.location.currentLocation)
    const [orderedCrimes, setOrderedCrimes] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (crimes) {
            setOrderedCrimes(crimes.sort(function (x, y) {
                return y.reportedAt - x.reportedAt;
            }))
        }
    }, [crimes])

    const fetchCrimes = () => {
        setIsFetching(true)
        const radius = checkIfLargeCity(location.city, location.region)
        dispatch(crimeReportsActions.fetchCrimes(location.lat, location.lng, radius, 'homescreen', 20))
            .then(() => {
                setIsFetching(false)
            })
            .catch((err) => {
                setIsFetching(false)
                console.log(err)
            })
    }

    const renderCrime = (itemData) => {
        return (
            <CrimeReport
                key={itemData.item.id}
                refreshed={true}
                description={itemData.item.description}
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
                    ? <FlatList
                        data={orderedCrimes}
                        refreshControl={<RefreshControl
                            tintColor={Colors.accent}
                            refreshing={isFetching}
                            onRefresh={() => fetchCrimes()} />}
                        renderItem={renderCrime}
                        contentContainerStyle={{ paddingHorizontal: '5%', paddingTop: hp('3%'), paddingBottom: hp('10%') }}
                    />
                    : !location ? <Text style={styles.noLocationText}>Couldn't get current location</Text> : <MaterialIndicator size={20} color={Colors.accent} style={{ marginBottom: '50%' }} />}


            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topContainer: {
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