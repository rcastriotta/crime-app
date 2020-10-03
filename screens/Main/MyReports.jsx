import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';

// COMPONENTS
import CrimeReport from '../../components/Main/CrimeReport';
import Colors from '../../constants/Colors';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as crimeReportActions from '../../store/actions/crimeReports';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MyReports = ({ navigation }) => {
    const dispatch = useDispatch()
    const myReports = useSelector(state => state.crimes.myReports)

    useEffect(() => {
        dispatch(crimeReportActions.fetchMyReports())
    }, [])

    const renderCrimeReport = itemData => {
        return (
            <CrimeReport
                type={itemData.item.type}
                description={itemData.item.description}
                authorName={itemData.item.authorName}
                address={itemData.item.address}
                timeSinceReport={itemData.item.formattedDate}
                authorId={itemData.item.authorId}
                styles={styles.crimeReport} />
        )
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <View style={{ width: '100%' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('SettingsHome')}>
                        <Ionicons name={"ios-arrow-back"} size={28} color={Colors.accent} style={{ marginTop: '1%', marginLeft: 20 }} />
                    </TouchableOpacity>
                </View>
                {myReports && myReports.length === 0
                    ? <Text style={styles.noReportsText}>You haven't posted any reports. Post one now!</Text>
                    : <FlatList data={myReports} renderItem={renderCrimeReport} contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }} />
                }
            </View>
        </SafeAreaView>
    )
}




const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        flex: 1,
    },
    container: {
        flex: 1,
        width: '100%',
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
    noReportsText: {
        color: 'white',
        fontFamily: 'TTN-Medium',
        alignSelf: 'center',
        marginTop: '80%',
        marginHorizontal: '10%'
    }

})

export default MyReports;