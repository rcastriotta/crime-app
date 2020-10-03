import React, { useState } from 'react';
import { Circle } from 'react-native-maps';

const CustomCircle = ({ onLayout, ...props }) => {
    const [ref, setRef] = useState(null)

    function onLayoutCircle() {
        if (ref.current) {
            ref.current.setNativeProps({
                strokeWidth: 1,
                strokeColor: 'rgba(127, 106, 250, .5)',
                fillColor: 'rgba(127, 106, 250, .08)'

            });
        }
        // call onLayout() from the props if you need it
    }

    return <Circle ref={(ref) => setRef(ref)} onLayout={onLayoutCircle} {...props} />;
}

export default CustomCircle;