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
  Keyboard,
} from 'react-native';
import axios from 'axios';
import WeatherComponent from './WeatherComponent';
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
      inPutCity: '',
      city: 'NA',
      weather: 'NA',
      currentTemp: 'NA',
      minTemp: 'NA',
      maxTemp: 'NA',
      start : true,
  };
  this.getLocation = this.getLocation.bind(this);
  this.requestLocationPermission = this.requestLocationPermission.bind(this);
  this.getCity = this.getCity.bind(this);
  this.getWeather = this.getWeather.bind(this);
  this.captializeFirstLetter = this.captializeFirstLetter.bind(this);
  this.handleSearch = this.handleSearch.bind(this);
  this.getGCode = this.getGCode.bind(this);
}
  componentDidMount() {
    this.getLocation()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.location !== this.state.location && this.state.start) {
      console.log('getCity');
      
      this.getCity();
      this.getWeather();
    } else if (prevState.location !== this.state.location) {
      console.log('getWeather');
      this.getWeather()
    }
  }
  /**
   * 
   * Get current location geocode
   */
  async getGCode () {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${this.state.inPutCity}&limit=${1}&appid=${APIKEY}`;
    try {
      await axios.get(url)
      .then(response => {
        if (response.data.length === 0) {
          ToastAndroid.show('Cannot find city', ToastAndroid.SHORT);
          this.setState({
            inPutCity: '',
            city: 'NA',
            weather: 'NA',
            currentTemp: 'NA',
            minTemp: 'NA',
            maxTemp: 'NA',
          });
          return;
        } else {
          this.setState({
            location: {
              latitude: response.data[0].lat,
              longitude: response.data[0].lon,
            },
          });
        }
      })
      .catch(error => {
        ToastAndroid.show('Internet Error', ToastAndroid.SHORT);
        console.log(error);
      });
    } catch (error) {
      ToastAndroid.show('Cannot get Gcode', ToastAndroid.SHORT);
    }   
  }
  handleSearch = () => {
    Keyboard.dismiss();
    if (this.state.inPutCity === '') {
      ToastAndroid.show('Please input city', ToastAndroid.SHORT);
      return;
    } else {
      this.getGCode();
    }
  }
  /**
   * 
   * Get current weather by city name
   */
  async getWeather() {
    const {latitude, longitude} = this.state.location;
    const url = `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${latitude}&lon=${longitude}&appid=${APIKEY}`;
    try {
      await axios.get(url)
      .then(response => {
        this.setState({
          city: this.state.start ? this.state.city : this.captializeFirstLetter(this.state.inPutCity.toLowerCase()),
          weather: response.data.weather[0].main,
          currentTemp: response.data.main.temp + ' °F',
          minTemp: response.data.main.temp_min + ' °F',
          maxTemp: response.data.main.temp_max + ' °F',
          start: false,
        });
      }).catch(error => {
        ToastAndroid.show('Internet Error', ToastAndroid.SHORT);
        console.log(error);
      });
    } catch (error) {
      ToastAndroid.show('Cannot get Weather', ToastAndroid.SHORT);
    }
  }
  captializeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  /**
   * 
   * Request location permission
   */
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
        this.setState({
          city: response.data[0].name,
        });
      }).catch(error => {
        ToastAndroid.show('Internet Error', ToastAndroid.SHORT);
        console.log(error);
      });
    } catch (error) {
      ToastAndroid.show('Unexpected Erro', ToastAndroid.SHORT);
    }
  }
  /**
   * Get current location of this device 
   * @returns 
   */
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
          }
          );
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
          onChangeText={text => this.setState({inPutCity: text})}
          value={this.state.inPutCity}
          placeholder="Input City"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={this.handleSearch}
        >
          <Text>Search</Text>
        </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Weather</Text>
        <WeatherComponent title ="City" info = {this.state.city}/>
        <WeatherComponent title ="Weather" info = {this.state.weather}/>
        <WeatherComponent title ="Current Temp" info = {this.state.currentTemp}/>
        <WeatherComponent title ="Min Temp Time" info = {this.state.minTemp}/>
        <WeatherComponent title ="Min Temp Time" info = {this.state.maxTemp}/>

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

  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;
