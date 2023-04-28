import React, {Component, useEffect} from 'react';

import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
} from 'react-native';

class WeatherComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.textContatiner}>
        <Text style={styles.textLeft}>{this.props.title}</Text>
        <Text style={styles.textRight}>{this.props.info}</Text>
      </View>
    );
  }
}
export default WeatherComponent;
const styles = StyleSheet.create({
  textContatiner: {
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
    textAlign: 'right',
    marginRight: 30,
  },
});
