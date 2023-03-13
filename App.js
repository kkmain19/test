import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, LogBox, Image, ScrollView } from 'react-native';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import LoginScreen from './Login';

const firebaseConfig = {
  apiKey: "AIzaSyB7aaejpSzaKXgFn9gXKNsTO9QraldLxuw",
  authDomain: "corona-996c5.firebaseapp.com",
  databaseURL: "https://corona-996c5-default-rtdb.firebaseio.com",
  projectId: "corona-996c5",
  storageBucket: "corona-996c5.appspot.com",
  messagingSenderId: "411558349733",
  appId: "1:411558349733:web:1924d28b8926d1d357364c",
  measurementId: "G-KBP8PFXEJL"
};

LogBox.ignoreAllLogs(true);


try {
  firebase.initializeApp(firebaseConfig);
} catch (err) { }


function renderCorona({ item }) {
  var icon = <Image style={{ width: 30, height: 20 }} source={{ uri: `https://covid19.who.int/countryFlags/${item.code}.png` }} />
  var desc = <View>
    <Text>{"ผู้ป่วยสะสม " + item.confirmed + " ราย"}</Text>
    <Text>{"เสียชีวิต " + item.death + " ราย"}</Text>
    <Text>{"รักษาหาย " + item.cure + " ราย"}</Text>
  </View>;
  //return <View><Text>ประเทศ {item.name} มีผู้ป่วย {item.confirmed} ราย</Text></View>
  return <List.Item title={item.name} description={desc} left={(props => icon)}></List.Item>

}

function Loading() {
  return <View><Text>Loading</Text></View>
}

function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  })
}


export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);


  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
  }, []);

  if (user == null) {
    return <LoginScreen />;
  }


  if (corona.length == 0) {
    return <Loading />;
  }


  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card.Cover source={{ uri: "https://images.unsplash.com/photo-1584573062942-d46bb3aee3fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80" }} />
       
        <ScrollView>
          <Card>
            <Card.Title title="Coronavirus Situation" />
            <Card.Content>
              <Text>Your Phone Number: {user.phoneNumber}</Text>
              <FlatList data={corona} renderItem={renderCorona} ></FlatList>
            </Card.Content>
          </Card>
        </ScrollView>
        
        <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
          Sign Out
        </Button>

        <StatusBar style="auto" />
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />
      </View>

    </PaperProvider>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
});
