import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

// COMPONENTS
import CrimeReport from '../../components/Main/CrimeReport';
import Colors from '../../constants/Colors';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as crimeReportActions from '../../store/actions/crimeReports';

// EXTERNAL
import { Ionicons } from '@expo/vector-icons';

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
                {myReports.length === 0
                    ? <Text style={styles.noReportsText}>You haven't posted any reports. Post one now!</Text>
                    : <FlatList data={myReports} renderItem={renderCrimeReport} contentContainerStyle={{ flex: 1, paddingHorizontal: 10 }} />
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
        height: 160,
        marginTop: 20,
        borderWidth: .2,
        borderColor: '#5B5B5B',
        padding: 15
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