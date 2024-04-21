import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CarbonFootprints = ({ route }) => {
  const { source, destination } = route.params;
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    getDistance(source, destination)
      .then(distance => {
        setDistance(distance);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [source, destination]);

  // Sample data for carbon emissions (in kilograms of CO2 per kilometer)
  const emissionsData = {
    walk: 0,        // Sample data, replace with actual values
    bike: 0.02,
    car: 0.14,
    publicTransport: 0.06,
  };

  // Method to calculate carbon emissions based on distance and transportation mode
  const calculateCarbonEmissions = (distance, mode) => {
    // Ensure distance is a valid number
    if (isNaN(distance)) {
      console.error('Invalid distance:', distance);
      return null;
    }
  
    // Ensure emission value for mode is a valid number
    const emission = emissionsData[mode];
    if (isNaN(emission)) {
      console.error('Invalid emission value for mode', mode, ':', emission);
      return null;
    }
  
    // Calculate carbon emissions
    const emissions = distance * emission;
    const roundedEmissions = emissions.toFixed(2);

    return roundedEmissions;
  };
  
  const camelCaseToCapsWithSpaces = (input) => {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
  };
  // Function to display the calculated carbon emissions
  const renderCarbonEmissions = () => {
    if (distance === null) {
      return null; // Distance not available yet
    }

    return (
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cellHeader}>Transport Mode</Text>
          <Text style={styles.cellHeader}>Carbon Emissions (kg CO2)</Text>
        </View>
        {Object.entries(emissionsData).map(([mode, emission]) => (
          <View key={mode} style={styles.row}>
            <Text style={styles.cell}>{camelCaseToCapsWithSpaces(mode)}</Text>
            <Text style={styles.cell}>{calculateCarbonEmissions(distance, mode)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Carbon Footprints</Text>
      <Text style={styles.distance}>Distance: {distance} mi</Text>
      {renderCarbonEmissions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  distance: {
    fontSize: 18,
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
  },
  cellHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

async function getDistance(origin, destination) {
  try {
    const apiKey = 'AIzaSyBjP_5gUEXzvCPbK1QaOSbq36qT8zD7XtQ';
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Check if API request was successful
    if (data.status === 'OK') {
        // Extract distance from response and convert to a valid number
        const distanceText = data.routes[0].legs[0].distance.text;
        const distanceValue = parseFloat(distanceText.replace(/[^\d.]/g, '')); // Remove non-numeric characters
        console.log(distanceValue);
        return distanceValue;
      }  else {
      console.error('Error fetching directions:', data.error_message || data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
}

export default CarbonFootprints;
