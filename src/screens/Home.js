import React, {useState, useRef} from 'react';
import {Animated, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

// import library
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import Constant from '../components/Constant';
import Header from '../components/Header';
import Note from '../components/Note';
import ListItem from '../components/ListItem';
import Search from '../components/Search';

export default function Home({notes, setNotes}) {

    // Animation Variables
    const fadeOut = useRef(new Animated.Value(1)).current;
    const moveUp = useRef(new Animated.Value(0)).current;
    const shrink = useRef(new Animated.Value(44)).current;
    
    // Modal Visibility State
    const[openNotesModal, setOpenNotesModal] = useState(false)
    const[addNotesModal, setAddNotesModal] = useState(false)

    // Search State
    const[onSearch, setOnSearch] = useState(false)
    const[searchList, setSearchList] = useState([])

    // categorised notes list function (pinned and unpinned)
    const categoriseNotes = (data) =>{
        var pinList = []
        var unpinList = []
    
        data.map((note)=>{
          note.pinned ? pinList.push(note) : unpinList.push(note)
        })
        
        return([...pinList, ...unpinList])
    }
 
    // Add new Notes
    const handleAddNote = (title, content, datetime, imageList) =>{
        var randId = Math.random();
        const object = {
            key: randId.toString(), 
            title : title === ""? "New Note" : title, 
            content : content,
            datetime : datetime,
            pinned : false,
            imageList: imageList
        }

        var newnotes = categoriseNotes([object,...notes])
        
        AsyncStorage.setItem("storedNotes", JSON.stringify(categoriseNotes(newnotes))).then(() => {
            setNotes(newnotes)
            setAddNotesModal(false)
        }).catch(error => {console.log(error)})
    }

    // Edit Notes
    const handleEditNote = (key, title, content, datetime, imageList) =>{
        const noteIndex = notes.findIndex((note) => note.key === key)
        notes[noteIndex].title = title
        notes[noteIndex].content = content
        notes[noteIndex].datetime = datetime
        notes[noteIndex].imageList = imageList
        
        AsyncStorage.setItem("storedNotes", JSON.stringify([...notes])).then(() => {
            setNotes([...notes])
            setOpenNotesModal(false)
        }).catch(error => {console.log(error)})
    }

    // Delete Notes
    const handleDeleteNote = (key) =>{
        const noteIndex = notes.findIndex((note) => note.key === key)
        var temp = notes
        temp.splice(noteIndex, 1)
        
        AsyncStorage.setItem("storedNotes", JSON.stringify([...temp])).then(() => {
            setNotes(notes => ([...temp]))
        }).catch(error => {console.log(error)})
    }

    // handle tap note
    const[pressedNote, setPessedNote] = useState({})
    const handleTapNote = (key)=>{
        setPessedNote(key)
        setOpenNotesModal(true)
    }

    // Pinned Note
    const pinNote = (item)=>{
        var data = item
        data.pinned = true
        const noteIndex = notes.findIndex((note) => note.key === data.key)
        var temp = notes
        temp.splice(noteIndex, 1)

        const newNotes = [data, ...notes]
        AsyncStorage.setItem("storedNotes", JSON.stringify(newNotes)).then(() => {
            setNotes(newNotes)
        }).catch(error => {console.log(error)})
    }

    // unpinned Note
    const unpinNote = (key)=>{
        const noteIndex = notes.findIndex((note) => note.key === key)
        notes[noteIndex].pinned = false
        
        const newNotes = categoriseNotes(notes)

        AsyncStorage.setItem("storedNotes", JSON.stringify(newNotes)).then(() => {
            setNotes(notes => (newNotes))
        }).catch(error => {console.log(error)})
    }

    // Render if note lists are empty
    const RenderEmpty = ()=>{
        return(
            <View style={styles.emptyState}>
                <Image 
                    style={styles.image} 
                    source={require("../../assets/emptyState.jpg")}
                    resizeMode='contain'
                /> 
                <Text style={styles.mainLabel}>Write down your notes</Text>
                <Text style={styles.secondryLabel}>Start by clicking the add button</Text>
            </View>
        )
    } 

    // When Search is pressed
    const onSearchPress = ()=>{
        setOnSearch(true)
        Animated.parallel([
            Animated.timing(fadeOut, {
                toValue: 0 ,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(moveUp, {
                toValue: -44 ,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(shrink, {
                toValue: 0 ,
                duration: 300,
                useNativeDriver: false
            })
          ]).start();
    }

    // When search is out of focus
    const onBlurPress = ()=>{
        setOnSearch(false)
        setSearchList([])
        Animated.parallel([
            Animated.timing(fadeOut, {
                toValue: 1 ,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(moveUp, {
                toValue: 0 ,
                duration: 300,
                useNativeDriver: false
            }),
            ,
            Animated.timing(shrink, {
                toValue: 44 ,
                duration: 300,
                useNativeDriver: false
            })
          ]).start();
    }

    // searching function 
    const searching = (searchInput)=>{
        if (searchInput != ''){
            var l=0, r=searchInput.length -1;
            while(l < searchInput.length && searchInput[l] == ' ') l++;
            while(r > l && searchInput[r] == ' ') r-=1;

            var toSearch = searchInput.substring(l, r+1);
            var results = [];

            for(var i=0; i<notes.length; i++) {
                if(notes[i].title.toLowerCase().indexOf(toSearch.toLowerCase())!=-1) {
                    if (!results.includes(notes[i])){
                        results.push(notes[i]);
                    }
                }
            }
            setSearchList(results)

        }  else {
            setSearchList([])
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Animated.View style={{height: shrink, opacity:fadeOut, transform:[{translateY: moveUp}]}}>
                <Header 
                    title="Palonotes" 
                    iconPress={()=>{setAddNotesModal(true)}} 
                    mainScreen = {true}
                />
            </Animated.View>

            {/* Main Content */}
            {notes.length == 0 ?
                <RenderEmpty/>
            :    
                <>
                    {/* Search Input */}
                    <Search 
                        onFocus={onSearchPress} 
                        onBlur={onBlurPress} 
                        onSearch={searching} 
                    />

                    {/* List of Notes */}
                    <ListItem 
                        data={onSearch? searchList : notes} 
                        onPress={handleTapNote} 
                        onDelete={handleDeleteNote} 
                        onPinned={pinNote}
                        onUnpinned={unpinNote}
                    /> 
                </> 
            }

            {/* Add Button */}
            {!onSearch&&
            <TouchableOpacity style={styles.addIcon} onPress={()=>{setAddNotesModal(true)}}>
                <Icon  
                    name='plus'
                    type='material-community'
                    color='white'
                    size={20}
                />
            </TouchableOpacity> 
            }

            {/* Modal for adding new note */}
            <Modal
                style={styles.modal}
                isVisible={addNotesModal}
                onBackButtonPress={()=>{setAddNotesModal(false)}}
            >
                <Note 
                    type={'add'} 
                    mainButton={'Add Note'} 
                    title={'New Note'} 
                    onAdd={handleAddNote} 
                    onBack={()=>{setAddNotesModal(false)}}
                />
            </Modal>
            
            {/* Modal for read and edit note */}
            <Modal
                style={styles.modal}
                isVisible={openNotesModal}
                onBackButtonPress={()=>{setOpenNotesModal(false)}}
            >
                <Note 
                    type={'edit'} 
                    mainButton={'Save'} 
                    data={pressedNote} 
                    onEdit={handleEditNote} 
                    title={'Edit Note'} 
                    onBack={()=>{setOpenNotesModal(false)}}
                />
            </Modal>
        </View>
    );
}

// stylesheet
const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    paddingTop: Constant.STATUSBAR_HEIGHT,
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E1E2E3",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
  },
  icon :{
      backgroundColor: Constant.PRIMARY_COLOR,
      borderRadius:5,
      padding:3
  },
  modal:{
      flex:1,
      backgroundColor:'white',
      margin:0,
      justifyContent:'flex-start'
  },
  emptyState:{
      flex:1,
      justifyContent:'center',
      alignItems: 'center'
  },
  image:{
      width:Constant.DEVICE_WIDTH*0.6,
      height:Constant.DEVICE_WIDTH*0.6
  },
  mainLabel:{
      fontSize:18,
      fontWeight:'bold'
  },
  secondryLabel:{
      textAlign:'center',
      color:Constant.TERTIARY_GREY_COLOR,
      fontSize : Constant.TERTIARY_FONT_SIZE
  },
  addIcon:{
      elevation:2,
      width:50,
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius: 50,
      backgroundColor: Constant.PRIMARY_COLOR,
      position: 'absolute',
      right: 16,
      bottom: 16
  },
});
