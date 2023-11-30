import MapView, { Marker, Polyline } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { getLocationPermissions } from "../utils/getLocationPermissions";
import { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Button } from "react-native";
import { useContext } from "react";
import { RouteContext } from "../contexts/routeContext";
import { addJourney } from "../utils/dbApi";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import BackgroundTimer from 'react-native-background-timer';


const LOCATION_TRACKING = 'location-tracking';
let lat=0;
let long=0;
let time=0;

export const RouteMap = ({ navigation }) => {
 
  const { routeData, setRouteData } = useContext(RouteContext);
  const [isMobile, setIsMobile] = useState(false);
  const [counter, setCounter] = useState(0);
  const timerInterval = 1000;
  const [location, setLocation] = useState({});




  //get initial location/////////////////////////////////////
  useEffect(() => {
    getLocationPermissions()
      .then((response) => {
        Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
          foregroundService: {
            notificationTitle: 'Location Tracking',
            notificationBody: 'Location Tracking',
          },
        });
      })
      .catch((error) => {
        console.log(error, "error in get location");
        alert("error in get location");
      })
    
    //cleanup
    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }
  }, []);

  useEffect(() => {
////////////////////////////////////////////////THIS ISNT WORKING SOrt out with backgrOund fetch
     const intervalId=BackgroundTimer.setInterval(() => {
        setCounter((counter) => counter + 1);
        setLocation({ latitude: lat, longitude: long })
        //so the map relies on state changes so cannot
        //use lat,long directly in map
  
     }, timerInterval);
    return () => {
      BackgroundTimer.clearInterval(intervalId);
    }
   
  }, [counter]);

  //add waypoint to routeData////////////////////////////////
  useEffect(() => {
    if (isMobile) {
     
   
      //sort out blocks of 10 waypoints here....
      setRouteData((oldData) => {
        const newData = { ...oldData };
        if (
          oldData.blocks.length > 0 &&
          oldData.blocks[oldData.blocks.length - 1].length < 10
        ) {
          //if there is a block and it is not full
          newData.blocks[oldData.blocks.length - 1].push({
            latitude: lat,
            longitude: long,
            timestamp: Date.now(),
          });
        } else {
          //if there is no block or the last block is full
          newData.blocks.push([
            {
              latitude: lat,
              longitude: long,
              timestamp: Date.now(),
            },
          ]);
        }
        return newData;
      });
    }
  }, [isMobile, counter]);

  //start journey//////////////////////////////////////////
  const handleStartPress = (e) => {
    ;
    
    //set start point and clear waypoint blocks
    setRouteData((oldData) => {
      return {
        ...oldData,
        startPoint: {
          latitude: lat,
          longitude: long,
        },
        startTime: time,
        region: {
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        blocks: [],
      };
    });
    setIsMobile(true);
   
  };

  //stop journey////////////////////////////////////////////
  const handleStopPress = () => {
       
    //stop recording
    setIsMobile(false);
    //store route data in db here....
    //add endpoint and endtime to routeData
    addJourney({
      ...routeData,
      endPoint: {
        latitude: lat,
        longitude: long,
      },
      endTime: time,
    })
      .then((response) => {
        alert("journey saved");
 
        //reset start point temp for test
        setTimeout(() => {
          setRouteData((oldData) => {
            return {
              ...oldData,
              startPoint: null,
              startTime: null,
              endpoint: null,
              endTime: null,
              blocks: [],
            };
          });
          navigation.navigate("My Journeys");
        }, 1000);

      })
      .catch((error) => {
        alert("error in saving journey");
        console.log(error, "error in route map");
      }
      )
    
  };
  //press on map/////////////////////////////////////////////
  const handleMapPress = (e) => {
    console.log(lat, long)
  };
  //render///////////////////////////////////////////////////
  return location.latitude && (
      <View style={styles.container}>
        <MapView
          onPress={handleMapPress}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
          showsUserLocation={true}
          followsUserLocation={true}
          loadingEnabled={true}
          showsCompass={true}
          mapType="standard"
        >
          {/* if isMobile is true, then show the stop button and the route */}
          {isMobile && routeData.startPoint && (
            <>
              <Polyline
                coordinates={[
                  ...routeData.blocks.reduce((acc, block) => {
                    return [...acc, ...block];
                  }, []),
                ]}
                strokeWidth={5}
              />
              <Marker coordinate={routeData.startPoint} pinColor="green" />

           
            </>
          )}
        </MapView>
            
        {!isMobile && lat && long && (
          <View style={styles.startButton}>
            <Button title="Start" onPress={handleStartPress} />
          </View>
        )}
        {isMobile && (
          <View style={styles.stopButton}>
            <Button title="Stop" onPress={handleStopPress} />
          </View>
        )}

        <StatusBar style="auto" />
      </View>
      
    
    
    )
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  startButton: {
    position: "absolute",
    bottom: 50,
    left: 50,
  },
  stopButton: {
    position: "absolute",
    bottom: 50,
    right: 50,
  },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
  }
  if (data) {
    console.log(data,"data" )
      const { locations } = data;
       lat = locations[0].coords.latitude;
    long = locations[0].coords.longitude;
    time=locations[0].timestamp;

   

      console.log(
          `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
      );
  }
});
