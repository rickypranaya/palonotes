import React , {useState, useRef} from 'react';
import {Animated, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

//import library and component
import Constant from './Constant';
import { Icon } from 'react-native-elements';

const Search = props =>{

    // variables
    const cancelAnim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef(null);
    const [searchInput, setSearchInput] = useState('')

    // when input is on focus
    const onFocusSearch = ()=>{
        props.onFocus()

        Animated.timing(cancelAnim, {
            toValue: 41 ,
            duration: 400,
            useNativeDriver: false
        }).start()
    }

    //when input is on blur
    const onBlurSearch = ()=>{
        inputRef.current.clear()
        inputRef.current.blur()
        props.onBlur()

        Animated.timing(cancelAnim, {
            toValue: 0 ,
            duration: 400,
            useNativeDriver: false
        }).start()
    }

    return (
        <View style={styles.container}>

            {/* search box */}
            <View style={styles.searchContainer}>     
                <Icon
                name='search-outline'
                type='ionicon'
                color="black"
                size={18}
                />
                
                <TextInput
                    ref={inputRef}
                    placeholder= 'Search Notes'
                    placeholderTextColor={Constant.LIGHT_GREY}
                    returnKeyType="search"
                    style={styles.search}
                    onChangeText={(val)=>{
                        props.onSearch(val)
                        setSearchInput(val)
                    }}
                    onFocus={onFocusSearch}                        
                    onEndEditing={()=>{
                        !searchInput && onBlurSearch()
                    }}
                />
            </View>
            
            {/* cancel button */}
            <Animated.View style={[styles.cancel, {width:cancelAnim}]}>
                <TouchableOpacity onPress={onBlurSearch}>
                    <Icon
                    name='close-circle'
                    type='ionicon'
                    color='lightgrey'
                    size={25}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

// stylesheet
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:44,
    },
    search:{
        flex:1,
        paddingVertical:3,
        paddingHorizontal:5
    },
    searchContainer:{ 
        flex:1,
        borderRadius:10,
        flexDirection: 'row',
        alignItems:'center',
        borderColor: Constant.LIGHT_GREY,
        borderWidth:1,
        flexDirection:'row', 
        justifyContent:'space-between', 
        marginHorizontal:16,
        paddingHorizontal: 10,
        marginVertical:5,
    },
    cancel:{
        justifyContent:'center',
        alignItems:'flex-start'
        // paddingRight:16,
    },
    cancelText:{
        color: Constant.PRIMARY_COLOR
    }
});

export default Search;