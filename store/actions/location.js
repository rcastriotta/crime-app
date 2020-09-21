import * as Location from 'expo-location';


// TYPES
export const GET_CURRENT_LOCATION = 'GET_CURRENT_LOCATION';

export const getLocation = (hasPermissions) => {
    return async(dispatch) => {
        if (!hasPermissions) {
            return;
        }
        try {
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000
            });
            const addressInfo = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude })

            const locationInfo = {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                city: addressInfo[0].city,
                region: addressInfo[0].region,
                name: addressInfo[0].name
            }

            dispatch({ type: GET_CURRENT_LOCATION, locationInfo })

        } catch (err) {
            throw (err)
        }
    }
}