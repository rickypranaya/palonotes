import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Constant from './Constant';

// import library
import {Icon} from 'react-native-elements';

const Header = props =>{
    return (
        <View style={styles.header}>

            {/* header title */}
            <Text style={styles.headerTitle}>{props.title}</Text>

            {/* back button */}
            {props.onBack && 
            <TouchableOpacity onPress={props.onBack} style={styles.backButton} >
                <Icon
                name='arrow-back'
                type='material'
                color='#3c3c3c'
                size={25}
                />
            </TouchableOpacity>
            }

            {/* right text button  */}
            <TouchableOpacity style={styles.textButton} onPress={props.onPress}>   
                <Text style={styles.textStyle}>{props.buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
}

// stylesheet
const styles = StyleSheet.create({
    header:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection : 'row',
        height: 44,
        paddingHorizontal: 16,
        
    },
    icon :{
        backgroundColor: Constant.PRIMARY_COLOR,
        borderRadius:5,
        padding:3
    },
    headerTitle :{
        paddingHorizontal:16,
        fontSize: 20,
        fontWeight:'bold',
        position:'absolute',
        width: Constant.DEVICE_WIDTH,
        textAlign:'center'
    },
    backButton:{
        position:'absolute',
        left: 0,
        height:'100%',
        paddingHorizontal:16,
        justifyContent:'center'
    },
    textButton:{
        height:'100%',
        justifyContent:'center',
        position:'absolute',
        right: 16,
    },
    textStyle:{
        color: Constant.PRIMARY_COLOR,
    }
});

export default Header;