import { FETCH_CRIMES, FETCH_MY_REPORTS } from '../actions/crimeReports';

const initialState = {
    mapCrimes: null,
    nearbyCrimes: null,
    myReports: null,
    timeRange: 'today',
    crimeAmounts: null
}


const crimeReportsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CRIMES:
            if (action.screen === 'homescreen') {
                const crimeAmounts = {}
                for (const crime of action.crimes) {
                    const type = crime.type.replace(/ /g, '');
                    if (crimeAmounts[type]) {
                        const mostRecent = crimeAmounts[type].mostRecent < crime.reportedAt ? crime.reportedAt : crimeAmounts[type].mostRecent
                        const timeSince = crimeAmounts[type].mostRecent < crime.reportedAt ? crime.formattedDate : crimeAmounts[type].timeSince
                        crimeAmounts[type] = { amount: crimeAmounts[type].amount + 1, mostRecent: mostRecent, timeSince: timeSince }
                    } else {
                        crimeAmounts[type] = { amount: 1, mostRecent: crime.reportedAt, timeSince: crime.formattedDate }
                    }
                }
                return {...state, nearbyCrimes: action.crimes, crimeAmounts: crimeAmounts }
            }
            return {...state, mapCrimes: action.crimes }
        case FETCH_MY_REPORTS:
            return {...state, myReports: action.reports }
        default:
            return state
    }
}

export default crimeReportsReducer;