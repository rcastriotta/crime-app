import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// EXTERNAL
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../../../constants/Colors';
import { MaterialIndicator } from 'react-native-indicators';

// REDUX
import { useSelector } from 'react-redux';
import { useLinkProps } from '@react-navigation/native';

const ReportsData = props => {
    // get crime data from past moth 
    const initalData = useSelector(state => state.crimes.crimeAmounts)
    const [crimeAmounts, setCrimeAmounts] = useState(null)

    useEffect(() => {
        if (initalData) {
            const data = Object.entries(initalData)
            setCrimeAmounts(data.sort(function (x, y) {
                return y[1].mostRecent - x[1].mostRecent;
            }))
            props.setAmount(data.length)
        }
    }, [initalData])


    const renderItem = data => {

        const formatData = () => {
            if (data[0] === 'VehicleTheft') {
                return ('Vehicle Theft')
            } else if (data[0] === 'SmallItemTheft') {
                return ('Small Item Theft')
            } else if (data[0] === 'PropertyDamage') {
                return ('Property Damage')
            } else {
                return data[0]
            }
        }

        return (
            <View style={styles.category} key={Math.random()}>
                <View style={styles.crimeCountContainer}>
                    <View style={styles.crimeCount}>
                        <Text style={styles.countText}>{data[1].amount}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.information}>
                    <Text style={styles.title}>{data[0] && formatData()}</Text>
                    <View style={styles.mostRecent}>
                        <Text style={styles.mostRecentText}>Most Recent</Text>
                        <View style={styles.circle} />
                        <Text style={styles.timeAgoText}>{data[1].timeSince}</Text>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.headerText}>LOCATION DETAILS</Text>
                <View style={styles.circle} />
                <Text style={{ color: Colors.accent, fontFamily: 'TTN-Medium' }}>within 10 mi</Text>
            </View>
            <View style={styles.categoriesContainer}>

                {crimeAmounts
                    ? crimeAmounts.map((typeData) => renderItem(typeData))
                    : <MaterialIndicator size={30} color={Colors.accent} style={{ marginTop: '25%' }} />
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: '5%',
        paddingTop: 10,
    },
    headerText: {
        fontFamily: 'TTN-Medium',
        color: 'rgba(255, 255, 255, .3)'
    },
    categoriesContainer: {
        width: '100%',
        marginTop: hp('3%'),
        justifyContent: 'space-between',

    },
    category: {
        width: '100%',
        height: hp('12%'),
        flexDirection: 'row',
        backgroundColor: '#1B1E2F',
        shadowOpacity: .53,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 20,
        borderRadius: hp('2%'),
        marginBottom: hp('4%')

    },
    crimeCountContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    crimeCount: {
        height: '60%',
        aspectRatio: 1,
        backgroundColor: 'rgba(127, 106, 250, .15)',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'

    },
    countText: {
        fontFamily: 'TTN-Medium',
        fontSize: hp('3.5%'),
        color: Colors.accent
    },
    information: {
        flex: 2,
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: '6%'

    },
    divider: {
        width: 1,
        height: '70%',
        backgroundColor: 'rgba(255, 255, 255, .2)',
        alignSelf: 'center'
    },
    title: {
        fontSize: hp('2%'),
        fontFamily: 'TTN-Bold',
        color: 'white'
    },
    mostRecent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mostRecentText: {
        fontFamily: 'TTN-Medium',
        color: 'gray'
    },
    circle: {
        width: 2,
        height: 2,
        marginHorizontal: hp('1%'),
        borderRadius: 100,
        backgroundColor: 'gray',
    },
    timeAgoText: {
        fontFamily: 'TTN-Medium',
        color: Colors.accent
    }
})

export default ReportsData;