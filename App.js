/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {Component, useEffect} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
const APIKEY = "41a352ce12d5ca52a662dde9b6b686e8";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location:{
        latitude: 0,
        longitude: 0,
      },
      city: 'NA',
      weather: 'NA',
      currentTemp: 'NA',
      minTempOfTime: 'NA',
      maxTempOfTime: 'NA',
  };
  this.getLocation = this.getLocation.bind(this);
  this.requestLocationPermission = this.requestLocationPermission.bind(this);
  this.getCity = this.getCity.bind(this);
}
  componentDidMount() {
    this.getLocation()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.location !== this.state.location) {
      console.log('getCity');
      this.getCity();
    }
  }
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This App needs access to your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use location');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  async getCity() {
    const {latitude, longitude} = this.state.location;
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`;
    try {
      await axios.get(url)
      .then(response => {
        console.log(response.data[0].name);
        this.setState({
          city: response.data[0].name,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  getLocation() {
    const result = this.requestLocationPermission();
    if (result) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position.coords.latitude, position.coords.longitude);
          this.setState({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      ToastAndroid.show('Cannot get permission', ToastAndroid.SHORT);
    }
    return 
  }
  render() {
    return (
      <SafeAreaView>
        <Text style={styles.viewTitle}>Input City to search Weather</Text>
        <View style = {styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => console.log(text)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={this.getLocation}
        >
          <Text>Search</Text>
        </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Weather</Text>
        <View style = {styles.textContatiner}>
          <Text style = {styles.textLeft}>City</Text>
          <Text style = {styles.textRight}>{this.state.city}</Text>
        </View>
        <View style = {styles.textContatiner}>
          <Text style = {styles.textLeft}>Current Temp</Text>
          <Text style = {styles.textRight}>{this.state.currentTemp}</Text>
        </View>
        <View style = {styles.textContatiner}>
          <Text style = {styles.textLeft}>Weather</Text>
          <Text style = {styles.textRight}>{this.state.weather}</Text>
        </View>
        <View style = {styles.textContatiner}>
          <Text style = {styles.textLeft}>Min Temp Time</Text>
          <Text style = {styles.textRight}>{this.state.minTempOfTime}</Text>
        </View>
        <View style = {styles.textContatiner}>
          <Text style = {styles.textLeft}>Max Temp Time</Text>
          <Text style = {styles.textRight}>{this.state.maxTempOfTime}</Text>
        </View>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  viewTitle: {
    marginTop: 200,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  searchButton: {
    width: 100,
    height: 40,
    backgroundColor: '#5c5c8a',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
  },
  textInput: {
    width: 200,
    height: 60,
    borderColor: 'gray',
    borderWidth: 3,
    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
  },
  textContatiner : {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textLeft: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'left',
    marginLeft: 30,
  },
  textRight: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'auto',
    marginRight: 30,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
