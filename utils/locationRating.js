// takes an array of crimes and rates a specific area based off type of crimes and time since occurance
const locationRating = (crimes) => {
    let rating = 100;

    for (crime of crimes) {
        const timeSinceReported = (new Date() - crime.reportedAt) / 86400000

        // highest concern
        if (crime.type === 'Shooting') {
            if (timeSinceReported <= 0.041666) {
                rating = rating - 70
            } else if (timeSinceReported > 0.041666 && timeSinceReported <= 1) {
                rating = rating - 50
            } else if (timeSinceReported > 1 && timeSinceReported <= 7) {
                rating = rating - 30
            } else if (timeSinceReported > 7 && timeSinceReported <= 30) {
                rating = rating - 20
            } else if (timeSinceReported > 30 && timeSinceReported <= 365) {
                rating = rating - 10
            } else {
                rating = rating - 5
            }
            continue;
        }

        // second highest concern
        if (crime.type === 'Assault' || crime.type === 'Robbery') {
            if (timeSinceReported <= 0.041666) {
                rating = rating - 50
            } else if (timeSinceReported > 0.041666 && timeSinceReported <= 1) {
                rating = rating - 30
            } else if (timeSinceReported > 1 && timeSinceReported <= 7) {
                rating = rating - 20
            } else if (timeSinceReported > 7 && timeSinceReported <= 30) {
                rating = rating - 10
            } else if (timeSinceReported > 30 && timeSinceReported <= 365) {
                rating = rating - 5
            } else {
                rating = rating - 2
            }
            continue;
        }

        // all other crimes
        if (timeSinceReported <= 0.041666) {
            rating = rating - 15
        } else if (timeSinceReported > 0.041666 && timeSinceReported <= 1) {
            rating = rating - 10
        } else if (timeSinceReported > 1 && timeSinceReported <= 7) {
            rating = rating - 5
        } else if (timeSinceReported > 7 && timeSinceReported <= 30) {
            rating = rating - 3
        } else if (timeSinceReported > 30 && timeSinceReported <= 365) {
            rating = rating - 1
        } else {
            rating = rating - 1
        }


    }

    // make sure rating doesn't go into negatives
    if (rating < 1) {
        rating = 1
    }
    return rating;
}

export default locationRating;