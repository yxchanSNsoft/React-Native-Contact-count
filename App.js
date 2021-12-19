import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, PermissionsAndroid, Pressable , BackHandler } from 'react-native';
import React, {Component} from 'react';
import * as Contacts from 'expo-contacts';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      length : 0,
      comment : "",
      textColor : "red"
    };
  }

  async componentDidMount() {


    this.askPermission()



  }

  

  async askPermission() {
    try {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then(async response => {
        if (!response) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Permission request',
              message: 'Please grant us permission to view your contact list',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          console.log("3", granted === PermissionsAndroid.RESULTS.GRANTED)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.fetchData()
          } else {
            alert('Call Log permission denied, cant use this app');
          }
        } else {
          this.fetchData()
        }
      })
      
    } catch (e) {
      alert(e);
    }
  
}

async fetchData() {

  const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Emails],
  });
  
  if (data.length > 0) {
    console.log("length",data.length)
    this.comment(data.length)
    this.setState({ length : data.length })
    //console.log("begin streaming data" , data)
  }
}

comment =(length)=> {
  if (length < 20) {
    this.setState({ comment : "You need to expand your social circle :(" , textColor : "red" })
  } else if (length > 19 && length < 100 ) {
    this.setState({ comment : "You have a healthy amount of friends :)" , textColor : "blue" })
  } else if (length > 99) {
    this.setState({ comment : "You are a super star!", textColor : "green" })
  }
}

onPress = () => {
  BackHandler.exitApp();
}

render () {
  return (
    <View style={styles.container}>
      <Text style={styles.intro}>How many Contacts do you have?</Text>
      <Text style={{ color: this.state.textColor, fontSize : 45 }}>{this.state.length}</Text>
      <Text style={styles.comment}>{this.state.comment}</Text>
      <Pressable style={styles.button} onPress={this.onPress}>
        <Text style={styles.buttonText}>Exit</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  )
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },  
  intro : {
    color : "black",
    fontSize : 23,
    marginBottom : 15
  },
  comment : {
    margin : 15
  },
  buttonText : {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  button : {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  }
});

