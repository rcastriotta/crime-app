import Firebase from '../../api/firebase/config';
import geohash from 'ngeohash';
import moment from 'moment';

// GEOFIRESTORE
import firebase from 'firebase'
const geofirestore = require('geofirestore');
const GeoFirestore = geofirestore.initializeApp(Firebase.firestore());
const db = Firebase.firestore()

// TYPES
export const FETCH_CRIMES = 'FETCH_CRIMES';
export const FETCH_NEARBY = 'FETCH_NEARBY';
export const FETCH_MY_REPORTS = 'FETCH_MY_REPORTS';

// COMPONENTS
import Crime from '../../models/crime';

/*
export const fetchCrimes = (latitude, longitude, distance, time, screen) => {
    return async(dispatch) => {
        // get timerange from state
        const crimes = []

        const getGeohashRange = (latitude, longitude, distance) => {
            const lat = 0.0144927536231884; // degrees latitude per mile
            const lon = 0.0181818181818182; // degrees longitude per mile

            let lowerLat = latitude - (lat * distance)
            let lowerLon = longitude - (lon * distance)

            let upperLat = latitude + (lat * distance)
            let upperLon = longitude + (lon * distance)



            // formatting 
            // upperLat = upperLat.lastIndexOf('.') > 3 ? upperLat.substr(0, upperLat.lastIndexOf('.')) + upperLat.substr(upperLat.lastIndexOf('.') + 1) : upperLat
            // upperLon = upperLon.lastIndexOf('.') > 3 ? upperLon.substr(0, upperLon.lastIndexOf('.')) + upperLon.substr(upperLon.lastIndexOf('.') + 1) : upperLon

            const lower = geohash.encode(lowerLat, lowerLon)
            const upper = geohash.encode(upperLat, upperLon)

            console.log('LOWER ' + lowerLat, lowerLon)
            console.log('UPPER ' + upperLat, upperLon)

            return {
                lower,
                upper
            }
        }
        const getTimeRange = () => {
            if (time === 'week') {
                return moment().subtract(7, 'days').unix()
            } else if (time === 'month') {
                return moment().subtract(30, 'days').unix()
            } else if (time === 'year') {
                return moment().subtract(1, 'years').unix()
            }

        }
        const timeRange = getTimeRange()
        const range = getGeohashRange(latitude, longitude, distance);
        console.log(range.lower, range.upper)
        const ref = db.collection("Crimes")
            .where("hashedLocation", ">=", range.lower)
            .where("hashedLocation", "<=", range.upper)

        await ref.get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (doc.data().unixTimestamp >= timeRange) {
                        // calculate how far away it is from user and the time it occured and to calculate status
                        crimes.push({...doc.data(), id: doc.id })


                    }
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        dispatch({ type: FETCH_CRIMES, crimes: crimes, screen: screen })
    }
}
*/
export const fetchCrimes = (latitude, longitude, radius, time, screen) => {

    return async(dispatch) => {
        // get timerange from state
        const crimes = []


        // firestore queries
        const query1 = GeoFirestore.collection('massCrimes').near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius })
        const query2 = GeoFirestore.collection('userCrimes').near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius })

        const handleResponseData = (querySnapshot) => {
            querySnapshot.forEach(function(doc) {

                // calculate how far away it is from user and the time it occured and to calculate status
                crimes.push(new Crime(
                    doc.id,
                    doc.data().type,
                    doc.data().coordinates.latitude,
                    doc.data().coordinates.longitude,
                    doc.data().description,
                    doc.data().reportedAt.toDate(),
                    doc.data().address,
                    doc.data().authorName,
                    doc.data().authorId,
                    doc.data().authorProfileImg,
                ))

            })
        }

        const policeCrimeData = query1.get()
            .then((querySnapshot) => handleResponseData(querySnapshot))
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        const userCrimeData = query2.get()
            .then((querySnapshot) => handleResponseData(querySnapshot))
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });


        await Promise.all([policeCrimeData, userCrimeData]).then(() => {

            dispatch({ type: FETCH_CRIMES, crimes: crimes, screen: screen })
        });

    }
}

export const fetchMyReports = () => {
    return async(dispatch, getState) => {
        const reports = []
        const query = db.collection("userCrimes").where("authorId", "==", getState().user.uid)

        await query.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    reports.push(new Crime(
                        doc.id,
                        doc.data().type,
                        doc.data().coordinates.latitude,
                        doc.data().coordinates.longitude,
                        doc.data().description,
                        doc.data().reportedAt.toDate(),
                        doc.data().address,
                        doc.data().authorName,
                        doc.data().authorId,
                        doc.data().authorProfileImg,
                    ))
                })
                dispatch({ type: FETCH_MY_REPORTS, reports: reports })
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
}