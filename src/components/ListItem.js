import React, {useState, useRef} from 'react';
import {Animated, View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import Constant from './Constant';

// import library
import {Icon} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

const ListItem = ({data, onPress, onDelete, onPinned, onUnpinned}) =>{

    //Active swiped row
    const [rowSlide, setRowSlide] = useState('')

    //render item list
    const Item = ({item}) =>{
        // animation value
        const heightAnimation = useRef(new Animated.Value(50)).current;
        const translateAnimation = useRef(new Animated.Value(0)).current;

        //animate 
        if (item.key === rowSlide){
            Animated.parallel([
                Animated.timing(heightAnimation, {
                    toValue: 0 ,
                    duration: 300,
                    useNativeDriver: false
                }),
                Animated.timing(translateAnimation, {
                    toValue: -Constant.DEVICE_WIDTH ,
                    duration: 300,
                    useNativeDriver: false
                })
              ]).start();
        }

        return (
            <Animated.View style={{flex:1, height: heightAnimation , transform: [{translateX: translateAnimation}]}}>
                <TouchableHighlight 
                    underlayColor={Constant.LIGHT_GREY} 
                    style={styles.content} 
                    onPress={()=>{onPress(item)}} 
                    onLongPress={()=>{item.pinned ? onUnpinned(item.key): onPinned(item)}}
                >   
                    <View style={styles.contentContainer}> 
                        {item.pinned &&
                        <TouchableOpacity onPress={()=>{onUnpinned(item.key)}} style={styles.pin}>
                            <Icon
                            name='push-pin'
                            type='material'
                            color='orange'
                            size={20}
                            />
                        </TouchableOpacity>
                        }
                        <Text numberOfLines={1} > {item.title} </Text>
                    </View>
                </TouchableHighlight>
            </Animated.View>

        )
    }

    //render hidden item (delete button)
    const RenderHiddenItem = ({item, rightActionActivated}) =>{
        //animatino value
        const flexAnim = useRef(new Animated.Value(1)).current;

        //animate
        if (rightActionActivated){
            Animated.timing(flexAnim, {
                toValue: 0 ,
                duration: 300,
                useNativeDriver: false
            }).start()
        }

        return (
            <Animated.View style={[styles.hiddenItem, {flex:flexAnim}]}>
                <TouchableHighlight underlayColor="#FF5258" onPress={()=>{onDelete(item.item.key)}} style={styles.deleteButton}>
                    <Text style={styles.hiddenText}>Delete</Text>
                </TouchableHighlight>
            </Animated.View>
        )
    }

    // when user slide and pass the threshold (40% from right screen)
    const onSlideRight = (data) => {
        if (data.isActivated){
            setRowSlide(data.key)
            setTimeout(()=>{onDelete(data.key)}, 400)
        }
    }

    return (
        <SwipeListView 
            data={data}
            renderItem={(item)=> <Item {...item} />}
            renderHiddenItem={(item)=> <RenderHiddenItem item={item} />}
            rightOpenValue={-75}
            disableRightSwipe={true}
            rightActionValue={-(Constant.DEVICE_WIDTH)}
            rightActivationValue={-(Constant.DEVICE_WIDTH*0.4)}
            onRightActionStatusChange={onSlideRight}
        /> 
    );
}

//stylesheet
const styles = StyleSheet.create({
    content:{
        backgroundColor:'white',
        paddingHorizontal:16,
        justifyContent:'flex-end',
        flex:1
    },
    hiddenItem:{
        backgroundColor:'#FF2D35',
        alignItems:'flex-end',
        flex:1
    },
    hiddenText:{
        color:'white'
    },
    contentContainer:{
        flexDirection:'row',
        height:50,
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
        borderBottomColor: Constant.LIGHT_GREY,
        borderBottomWidth:1,
    },
    deleteButton:{
        backgroundColor:'#FF2D35',
        width:75,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    pin:{
        height:'100%',
        justifyContent:'center',
        paddingHorizontal:5
    }
});

export default ListItem;