import React, {useRef, useEffect, useState} from 'react';
import { View,StyleSheet, TextInput, Keyboard, ScrollView, TouchableOpacity , Text, Image, FlatList} from 'react-native';
import Constant from './Constant';

//import library
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';

const ContentInput = props =>{

    // Preview Image 
    const[previewVisible, setPreviewVisible] = useState(false)
    const[pressedImage, setPressedImage] = useState({})

    // reference
    const inputRef = useRef(null);
    const keyboardDidHideListener = useRef(null)

    // to dismiss keyboard when user press back
    useEffect(() => {
        keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', ()=>{Keyboard.dismiss()});
        return () => {
            keyboardDidHideListener.current.remove();
        };
    }, []);

    // rendering image item
    const RenderImage = ({item}) =>{
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.imageTouch} onPress={()=>{onImagePress(item)}}>
                <Image
                    style={styles.image} 
                    source={{uri:item.uri}}
                    resizeMode='cover'
                />
            </TouchableOpacity>
        )
    }

    // when user press on image
    const onImagePress = (item)=>{
        setPressedImage(item)
        setPreviewVisible(true)
    }

    // fucntion to remove image
    const removeImage =()=>{
        setPreviewVisible (false);
        props.onRemoveImage (pressedImage.key)
    }

    return (
        <View style={styles.textField}>
            <TouchableOpacity activeOpacity={1} style={styles.touchableInput} onPress={()=>{inputRef.current.focus()}}> 
                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* image section */}
                    {props.imageData.length != 0 &&
                    <View> 
                        <FlatList 
                        horizontal={true}
                        data={props.imageData}
                        renderItem={(item)=> <RenderImage {...item}/>}
                        /> 
                    </View>
                    }

                    {/* Content text input */}
                    <TextInput
                        value={props.value}
                        multiline
                        ref={inputRef}
                        placeholder="Note"
                        placeholderTextColor={Constant.LIGHT_GREY}
                        style={styles.contentInput}
                        onChangeText={props.onChange}
                    />
                </ScrollView>
            </TouchableOpacity>
            
            {/* Preview image modal */}
            <Modal
                style={styles.modal}
                isVisible={previewVisible}
                onBackButtonPress={()=>{setPreviewVisible(false)}}
            >
                <Image
                    style={styles.previewImage} 
                    source={{uri : pressedImage.uri}}
                    resizeMode='contain'
                /> 

                <TouchableOpacity style={styles.backButton} onPress={()=>{setPreviewVisible(false)}}>
                    <Icon              
                    name='cross'
                    type='entypo'
                    color='#3c3c3c'
                    size={20}
                    />
                </TouchableOpacity> 

                <TouchableOpacity style={styles.removeButton} onPress={()=>{removeImage()}}>
                    <Icon
                        // reverse
                        name='trash'
                        type='ionicon'
                        color='white'
                        size={20}
                    />
                </TouchableOpacity>
            </Modal>

        </View>
    );
}

// stylesheet
const styles = StyleSheet.create({
    textField:{
        borderWidth:1,
        borderColor: Constant.LIGHT_GREY,
        borderRadius:5,
        marginVertical:3,
        flex:1,
        justifyContent:'flex-start'
    },
    contentInput:{
        justifyContent:'flex-start', 
        textAlignVertical:'top',
        fontSize:15,
        flexDirection:'row',
    },
    scrollContent:{
        padding: 10,        
    },
    imageTouch:{
        paddingHorizontal : 5,
        paddingBottom:20
    },
    image: {
        width:150, 
        height:200, 
        borderRadius:10
    },
    touchableInput:{
        flex:1,        
    },
    backButton:{
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        elevation: 2,
        backgroundColor:'white',
        borderRadius:50,
        position:'absolute',
        top:16, 
        left:16, 
    },
    removeButton:{
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        elevation: 2,
        backgroundColor:'#EA4949',
        borderRadius:50,
        position:'absolute',
        top:16, 
        right:16, 
    },
    modal:{
        margin:0,
        backgroundColor:'black'
    },
    previewImage:{
        width:Constant.DEVICE_WIDTH, 
        height:Constant.DEVICE_HEIGHT
    }
});

export default ContentInput;