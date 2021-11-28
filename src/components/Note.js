import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

// components
import Constant from './Constant';
import TitleInput from './TitleInput';
import ContentInput from './ContentInput';
import Header from './Header';

//import library
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

const Note = props =>{

    // Note Data
    const [key , setKey] = useState('')
    const [title , setTitle] = useState('')
    const [content, setContent] = useState('')
    const [datetime, setDatetime] = useState(null)

    // Image Lists if available
    const [images, setImages] = useState([])

    // current date and time format (01 October 21 1:10 AM)
    const [currentDateTime, setCurrentDateTime] = useState(null)
        
    // Initialize data when opening a note
    useEffect(() => {
        var current = (require('moment')().format('DD MMMM YY LT'));
        setCurrentDateTime(current)

        if(props.data) {
            setKey(props.data.key)
            setTitle(props.data.title)
            setContent(props.data.content)
            setDatetime(props.data.datetime)
            setImages(props.data.imageList)
        }
    }, [props.data]);

    // Handle on pressing main button 
    const buttonAction = ()=>{
        props.type === 'edit' ? props.onEdit(key, title, content, currentDateTime, images) : props.onAdd(title,content, currentDateTime, images)
    }


    // Picking image from gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission to access gallery was denied');
            return;
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });
          
            if (!result.cancelled) {
                var randId = Math.random();
                setImages([{key:randId.toString(), uri:result.uri},...images]);
            }
        }
    };

    // Taking Picture from camera
    const snapImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission to access camera was denied');
            return;
        } else {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });
                    
            if (!result.cancelled) {
                var randId = Math.random();
                setImages([{key:randId.toString(), uri:result.uri},...images]);
            }
        }
    };

    //removing Image 
    const onRemoveImage = (key) => {
        const imageIndex = images.findIndex((image) => image.key === key)
        images.splice(imageIndex, 1)
        setImages([...images])
    }

    return (
        <View style={styles.mainScreen}>
            <Header 
                title={props.title} 
                onBack={props.onBack} 
                buttonText={props.mainButton} 
                onPress={buttonAction} 
            />

            <View style={styles.container}>
                <Text style={styles.datetime}>{datetime? datetime: currentDateTime}</Text>
                <TitleInput type={props.type} value = {title} placeholder="Title" onChange={setTitle}/>
                <ContentInput 
                    value= {content} 
                    placeholder='' 
                    onChange={setContent} 
                    imageData = {images}
                    onRemoveImage= {onRemoveImage}
                />
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={()=>{snapImage()}}>
                    <Icon
                    name='camera'
                    type='material'
                    color={Constant.PRIMARY_COLOR}
                    size={25}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={()=>{pickImage()}}>
                    <Icon
                    name='image'
                    type='material'
                    color={Constant.PRIMARY_COLOR}
                    size={25}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

//styleSheet
const styles = StyleSheet.create({
    mainScreen:{
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal:16
    },
    mainButton:{
        padding: 15,
        alignItems:'center',
        textAlign:'center'
    },
    datetime:{
        color:Constant.TERTIARY_GREY_COLOR,
        fontSize : Constant.TERTIARY_FONT_SIZE,
        textAlign:'center',
    },
    bottomContainer:{
        flexDirection:'row',
        paddingHorizontal:16,
    },
    iconButton:{
        height: 50,
        width: 40,
        justifyContent:'center'
    }
});

export default Note;