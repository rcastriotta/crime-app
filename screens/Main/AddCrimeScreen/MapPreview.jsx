import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

// Components
import Colors from '../../../constants/Colors';
const MapPreview = props => {
    let imagePreviewUrl;

    if (props.location) {
        imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${props.location.lat
            },${props.location.lng
            }&zoom=15&size=650x450&maptype=roadmap&style=element:geometry%7Ccolor:0x111422&style=element:labels.text.fill%7Ccolor:0x746855&style=element:labels.text.stroke%7Ccolor:0x242f3e&style=feature:administrative.locality%7Celement:labels.text.fill%7Ccolor:0xd59563&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0xd59563&style=feature:poi.park%7Celement:geometry%7Ccolor:0x263c3f&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x6b9a76&style=feature:road%7Celement:geometry%7Ccolor:0x38414e&style=feature:road%7Celement:geometry.stroke%7Ccolor:0x212a37&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x9ca5b3&style=feature:road.highway%7Celement:geometry%7Ccolor:0x746855&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0x1f2835&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0xf3d19c&style=feature:transit%7Celement:geometry%7Ccolor:0x2f3948&style=feature:transit.station%7Celement:labels.text.fill%7Ccolor:0xd59563&style=feature:water%7Celement:geometry%7Ccolor:0x17263c&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x515c6d&style=feature:water%7Celement:labels.text.stroke%7Ccolor:0x17263c&size=480x360&markers=color:0x8471EF%7Clabel:%7C${props.location.lat
            },${props.location.lng}&key=AIzaSyCpFespimqgN7ACag02lSD1lCltQdbrq88`;
    }

    return (
        <View style={styles.mapPreview}>
            {props.location ? <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} /> : props.children}
        </View>
    )
};

const styles = StyleSheet.create({
    mapPreview: {
        height: '25%',
        width: '100%',
        borderRadius: 10,
        marginTop: '5%',
        shadowColor: 'black',
        shadowOpacity: .3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 10,
    },
    mapImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15

    }
});

export default MapPreview;