import React , {useRef, useEffect} from 'react';
import { View,StyleSheet, TextInput } from 'react-native';
import Constant from './Constant';

const TitleInput = props =>{

    // variables
    const inputRef = useRef(null);

    // focus on text input when component first launched
    useEffect(() => {
        if (props.type === "add"){
            setTimeout(() => inputRef.current.focus(), 100)
        }
    }, []);

    return (
        <View style={styles.textField}> 
            <TextInput
                value={props.value}
                ref={inputRef}
                placeholder= {props.placeholder}
                placeholderTextColor={Constant.LIGHT_GREY}
                returnKeyType="next"
                style={styles.textInput}
                onChangeText={props.onChange}
                onSubmitEditing={(val)=>{}}
            />
        </View>
    );
}

// stylesheet
const styles = StyleSheet.create({
    textField:{
        borderWidth:1,
        borderColor: Constant.LIGHT_GREY,
        borderRadius:5,
        marginTop:5,
    },
    textInput:{
        paddingHorizontal:10,
        paddingVertical: 5, 
        fontSize:16
    }
});

export default TitleInput;