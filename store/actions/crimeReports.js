import Firebase from '../../api/firebase/config';

// GEOFIRESTORE
import firebase from 'firebase'
const geofirestore = require('geofirestore');
const GeoFirestore = geofirestore.initializeApp(Firebase.firestore());
const db = Firebase.firestore()

// TYPES
export const FETCH_CRIMES = 'FETCH_CRIMES';
export const FETCH_MY_REPORTS = 'FETCH_MY_REPORTS';

// MODELS
import Crime from '../../models/crime';


export const fetchCrimes = (latitude, longitude, radius, screen, limit) => {
    return async(dispatch) => {
        // get timerange from state
        const crimes = []
        const KMRadius = radius * 1.609;
        // firestore queries
        const query1 = GeoFirestore.collection('policeReports').near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: KMRadius }).where('active', '==', true).limit(limit)
        const query2 = GeoFirestore.collection('userReports').near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: KMRadius }).where('active', '==', true).limit(limit)

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
        const query = db.collection("userReports").where("authorId", "==", getState().user.uid)

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