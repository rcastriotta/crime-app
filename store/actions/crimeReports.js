import Firebase from '../../api/firebase/config';
import axios from 'axios';

// GEOFIRESTORE
import firebase from 'firebase'
const geofirestore = require('geofirestore');
const GeoFirestore = geofirestore.initializeApp(Firebase.firestore());
const fs = Firebase.firestore()
const db = Firebase.database()

// TYPES
export const FETCH_CRIMES = 'FETCH_CRIMES';
export const FETCH_MY_REPORTS = 'FETCH_MY_REPORTS';

// MODELS
import Crime from '../../models/crime';


export const fetchCrimes = (latitude, longitude, radius, screen, limit) => {
    return async(dispatch) => {
        const crimes = []
        const KMRadius = radius * 1.609;
        const spotCrimeRadius = radius === 0.5 ? '0.007' : '0.0035'
        let APIKEY;

        // get current key for spotcrime
        await db.ref('APIKEY').once('value').then(function(snapshot) {
            APIKEY = snapshot.val()
        }).catch((err) => console.log(err));


        const query = GeoFirestore.collection('userReports')
            .near({ center: new firebase.firestore.GeoPoint(latitude, longitude), radius: KMRadius })
            .where('active', '==', true)
            .limit(limit)

        const userCrimeData = query.get()
            .then((querySnapshot) => {
                querySnapshot.forEach(function(doc) {
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
            })
            .catch(function(error) {
                console.log("Error user reports: ", error);
            });


        const policeCrimeData = axios({
                url: `https://spotcrime.com/crimes.json?lat=${latitude}&lon=${longitude}&radius=${spotCrimeRadius}`,
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': APIKEY
                }
            })
            .then((result) => {
                result.data.crimes.forEach(function(doc) {
                    if (doc.type === 'Other') {
                        //return
                    }
                    crimes.push(new Crime(
                        doc.cdid.toString(),
                        doc.type,
                        doc.lat,
                        doc.lon,
                        doc.description,
                        Date.parse(doc.date),
                        doc.address,
                        doc.authorName,
                        doc.authorId,
                    ))
                })
            })
            .catch((err) => console.log('Error getting police reports: ' + err))


        await Promise.all([policeCrimeData, userCrimeData]).then(() => {
            dispatch({ type: FETCH_CRIMES, crimes: crimes, screen: screen })
        });
    }
}

export const fetchMyReports = () => {
    return async(dispatch, getState) => {
        const reports = []
        const query = fs.collection("userReports").where("authorId", "==", getState().user.uid)

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