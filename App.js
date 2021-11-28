import React, {useState} from 'react';
import Home from './src/screens/Home';

// import library
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

export default function App() {

  // variables
  const [ready, setReady] = useState(false)
  const [notes, setNotes]= useState([])

  // loading notes from local storage
  const LoadNotes = ()=>{
    AsyncStorage.getItem("storedNotes").then(data => {
      if(data !== null){
        setNotes(JSON.parse(data))
      }
    }).catch((error)=> console.log(error))
  }

  // check whether app is ready
  if (!ready){
    return(
      <AppLoading
        startAsync={LoadNotes}
        onFinish={()=> setReady(true)}
        onError={console.warn}
      />
    )
  }

  return (
      <Home notes={notes} setNotes={setNotes}/>
  );
}