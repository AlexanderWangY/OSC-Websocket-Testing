import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { io } from 'socket.io-client';


uri = `ws://10.144.51.108:8080`

//const ws = new WebSocket(uri);
export const socket = io(uri);
const data = {
  type: 'message',
  data: 'Hello world'
}

// const sendLocation = async () => {
//   try {
//     const data = 
//   }
// }

const dataString = JSON.stringify(data)

const sendMessage = () => {
  try {
    ws.send(dataString); // send a message
  } catch (e) {
    console.log('error sending message')
  }
}

const sendLocation = async (location) => {
  const locationData = {
    type: 'location',
    data: [location.coords.latitude, location.coords.longitude]
  }

  const data = JSON.stringify(locationData)
  try {
    ws.send(data)
  } catch (e) {
    console.log('error sending!')
  }
}

ws.onopen = () => {
  console.log('user joined!')
  // connection opened
  try {
    ws.send(dataString); // send a message
  } catch (e) {
    console.log('error sending message')
  }
};

ws.onmessage = async (data) => {
  // a message was received
  console.log(data)
};

ws.onerror = e => {
  // an error occurred
  console.log(e.message);
};

ws.onclose = e => {
  // connection closed
  console.log('user Left!')
};

export default function App() {

  const [location, setLocation] = useState(null)

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Not granted yet')
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location)
      sendLocation(location)
    }
    
    )();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Button 
        styles={styles.button}
        onPress={sendMessage}
        title='Press me'>
          Press me
        </Button>
      </View>
      <Text>
        {location === null ? 'Loading': 'Location was captured!'}
      </Text>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },

  button: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  }
});
