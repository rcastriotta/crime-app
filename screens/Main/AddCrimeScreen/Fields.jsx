import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

// EXTERNAL
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Fields = props => {
    const [text, setText] = useState('')

    useEffect(() => {
        if (text.length > 10) {
            props.setValidated(true)
        } else {
            props.setValidated(false)
        }
    }, [text])

    return (
        <TextInput
            placeholder="Ex. Man assaulted while buying groceries"
            placeholderTextColor={'#8A8A8A'}
            multiline={true}
            maxLength={70}
            numberOfLines={2}
            style={{
                color: 'white',
                fontSize: wp('4.4%'),
                fontFamily: 'TTN-Bold',
                width: '100%',
                height: '12%',
                backgroundColor: 'rgba(255, 255, 255, .1)',
                borderRadius: 15,
                marginTop: '5%',
                paddingTop: 15,
                paddingBottom: 15,
                paddingHorizontal: 15
            }}
            selectionColor={'white'}
            blurOnSubmit={true}
            onChangeText={(text) => setText(text)}
            value={text}
            keyboardAppearance={'dark'}
            onBlur={() => props.setText(text)}

        //onSubmitEditing={() => ke}
        />
    )
}

const styles = StyleSheet.create({
    descriptionContainer: {
        width: '100%',
        height: '12%',
        backgroundColor: 'rgba(255, 255, 255, .1)',
        borderRadius: 15,
        marginTop: '5%',
        paddingTop: 10,
        paddingHorizontal: 15
    }
})


export default Fields;