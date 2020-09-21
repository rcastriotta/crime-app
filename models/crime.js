import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')


class Crime {
    constructor(id, type, lat, lon, description, reportedAt, address, authorName, authorId, authorProfileImg) {
        this.id = id;
        this.type = type;
        this.lat = lat;
        this.lon = lon;
        this.description = description;
        this.reportedAt = reportedAt;
        this.address = address;
        this.authorName = authorName;
        this.authorId = authorId;
        this.authorProfileImg = authorProfileImg;
    }
    get formattedDate() {
        return timeAgo.format(this.reportedAt)
    }
};

export default Crime;