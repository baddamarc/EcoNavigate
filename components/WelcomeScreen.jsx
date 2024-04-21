import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = ({ route }) => {
  const { fullName } = route.params;
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const navigation = useNavigation();

  const handlePlanRoute = () => {
    // Navigate to RouteScreen and pass source and destination as params
    navigation.navigate('Route', { source, destination });
  };

  const handleCarbonFootprints = () => {
    // Handle carbon footprints logic
    console.log('Calculating carbon footprints for route:', source, 'to', destination);
    navigation.navigate('CarbonFootprint', {source, destination});
    // Perform navigation or other actions
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome {fullName}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter source address"
          value={source}
          onChangeText={setSource}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter destination address"
          value={destination}
          onChangeText={setDestination}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Plan Route" onPress={handlePlanRoute} />
        <Button title="Carbon Footprints" onPress={handleCarbonFootprints} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default WelcomeScreen;
