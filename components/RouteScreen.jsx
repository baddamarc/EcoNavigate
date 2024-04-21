import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

const RouteScreen = ({ route }) => {
  const { source, destination } = route.params;
  const [coordinates, setCoordinates] = useState([]);
  const [region, setRegion] = useState(null);
  const [travelInfo, setTravelInfo] = useState(null);


  useEffect(() => {
    fetchDirections();
  }, []);

  const fetchDirections = async () => {
    try {
      const apiKey = "AIzaSyBjP_5gUEXzvCPbK1QaOSbq36qT8zD7XtQ";
      const fullApi = `https://maps.googleapis.com/maps/api/directions/json?origin=${source}&destination=${destination}&key=${apiKey}`;
      console.log("API: ", fullApi);
      const response = await fetch(fullApi);
      const data = await response.json();
      if (data.status === 'OK') {
        const routeCoordinates = decodePolyline(data.routes[0].overview_polyline.points);
        const route = data.routes[0];
        setCoordinates(routeCoordinates);
	      console.log('Length: ', coordinates.length);

	
	// Set travel info for available modes
        const availableModes = route.legs.map(leg => leg.steps[0].travel_mode);
        const travelInfo = {};
        if (availableModes.includes('BICYCLING')) {
          travelInfo.bike = route.legs.find(leg => leg.steps[0].travel_mode === 'BICYCLING').duration.text;
        }
        if (availableModes.includes('DRIVING')) {
          travelInfo.car = route.legs.find(leg => leg.steps[0].travel_mode === 'DRIVING').duration.text;
        }
        if (availableModes.includes('WALKING')) {
          travelInfo.walk = route.legs.find(leg => leg.steps[0].travel_mode === 'WALKING').duration.text;
        }
        setTravelInfo(travelInfo);
        // Calculate the bounding box
        const minLat = Math.min(routeCoordinates[0].latitude, routeCoordinates[routeCoordinates.length - 1].latitude);
        const maxLat = Math.max(routeCoordinates[0].latitude, routeCoordinates[routeCoordinates.length - 1].latitude);
        const minLng = Math.min(routeCoordinates[0].longitude, routeCoordinates[routeCoordinates.length - 1].longitude);
        const maxLng = Math.max(routeCoordinates[0].longitude, routeCoordinates[routeCoordinates.length - 1].longitude);
        // Set the map region to fit the bounding box
        setRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.abs(maxLat - minLat) * 1.2, // Add some padding to the delta
          longitudeDelta: Math.abs(maxLng - minLng) * 1.2, // Add some padding to the delta
        });
      } else {
        console.error('Error fetching directions:', data.error_message || data.status);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  return (
	
    <View style={styles.container}>
	{/* Display travel info */}
      {travelInfo && (
        <View style={styles.travelInfoContainer}>
          <Text style={styles.travelInfoText}>Bike: {travelInfo.bike}</Text>
          <Text style={styles.travelInfoText}>Car: {travelInfo.car}</Text>
          <Text style={styles.travelInfoText}>Walk: {travelInfo.walk}</Text>
        </View>
      )}
	{/* Map */}

      <MapView
        style={styles.map}
        region={region} // Set the map region dynamically
      >
        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#000"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};


const decodePolyline = (polyline) => {
  const points = [];
  let index = 0;
  const len = polyline.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = polyline.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default RouteScreen;

