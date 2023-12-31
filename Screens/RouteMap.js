import MapView, { Marker, Polyline } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { getLocationPermissions } from "../utils/getLocationPermissions";
import { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Button } from "react-native";
import { useContext } from "react";
import { RouteContext } from "../contexts/routeContext";
import { SettingContext } from "../contexts/settingContext";
import { addJourney } from "../utils/dbApi";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ZoomSlider } from "./SharedComponents/ZoomSlider";
import { Stopwatch } from "./RouteMapComponents/Stopwatch";
import { MapToggle } from './SharedComponents/MapToggle'
import { clearAllJourneys } from "../utils/dbApi";

import { AppState } from "react-native";

// global variables for background location tracking
const LOCATION_TRACKING = "location-tracking";
let lat = 0;
let long = 0;
let time = 0;
let waypoints = [];
/*
these need to be global so that they can be accessed by the background task manager
the function has to use the global variables, otherwise it will not work
it cant handle state variables in the background...
the state variables are used to update the map and the stopwatch(counter always runs a 1 second intervals)
the global variables are used to update the route data
the route data is used to store the journey in the db
it copies the waypoints from the global variables to the route data
when the app is in the foreground
otherwise it just stores the waypoints in the global variables
it starts getting location data at the interval specified in settings
the moment the app is opened
it only starts recording when the start button is pressed
it stops recording when the stop button is pressed
and stores the journey in the db
*/

export const RouteMap = ({ navigation }) => {
  const { routeData, setRouteData } = useContext(RouteContext);
  const{interval,isRecording,setIsRecording}=useContext(SettingContext)
 
  const [counter, setCounter] = useState(0);
  const timerInterval = 1000;
  const [location, setLocation] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);
  const [mapStyle,setMapStyle]=useState('standard')

  const [zoom, setZoom] = useState(0.005);

  //setup location tracking and appstate listeners////////////////////////
  useEffect(() => {
    /////////////////////////////
    //for testing
    // clearAllJourneys();
    ///////////////////////////////

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    getLocationPermissions()
      .then((response) => {
        Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: interval,

          foregroundService: {
            notificationTitle: "Location Tracking",
            notificationBody: "Location Tracking",
          },
          pausesUpdatesAutomatically: false,
        });
      })
      .catch((error) => {
        console.log(error, "error in get location");
        alert("error in get location", error);
      });

    //cleanup
    return () => {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      subscription.remove();
    };
  }, [interval]);

  //handle appstate change///////////////////////////////////////////
  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
      // The app has come to the foreground, copy the data recorded whilst in the background
      if (isRecording) {
        setRouteData((oldData) => {
          return {
            ...oldData,
            points: [...waypoints],
          };
        });
      }

      setLocation({ ...waypoints[waypoints.length - 1] });
      setAppState(nextAppState);
    }
  };

  //restart counter when recording starts for stopwatch////////////////////////
  useEffect(() => {
    setCounter(0);
  },[isRecording])

  ///timer for updating location//////////////////////////////////////
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((oldCounter) => oldCounter + 1);
    }, timerInterval);
    return () => {
      clearInterval(timer);
    };
  }, [counter]);

  //update location///////////////////////////////////////////////
  useEffect(() => {
    setLocation({ ...waypoints[waypoints.length - 1] });
    if (isRecording) {
      
      //add waypoint to routeData////////////////////////////////
   
        setRouteData((oldData) => {
          return {
            ...oldData,
            points: [...waypoints],
          };
        });
      }
    
  }, [counter]);

  //start journey//////////////////////////////////////////
  const handleStartPress = (e) => {
    //clear waypoints
    waypoints = [];
    //push start point to waypoints
    waypoints.push({ latitude: lat, longitude: long, timestamp: time });
    //set start point and clear waypoint
    setRouteData((oldData) => {
      return {
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
        points: waypoints,
        interval:interval
      };
    });
    setIsRecording(true);
  };

  //stop journey////////////////////////////////////////////
  const handleStopPress = () => {
    //stop recording
    setIsRecording(false);
    //store route data in db here....
    //if more than one initial waypoint
    //add endpoint and endtime to routeData
  
    if (waypoints.length > 1) {
      addJourney({
        ...routeData,
        endPoint: waypoints[waypoints.length - 1],
        endTime: waypoints[waypoints.length - 1].timestamp,
      })
        .then(() => {
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
                points: [],
              };
            });
            navigation.navigate("Saved Journeys");
          }, 1000);
        })
        .catch((error) => {
          alert("error in saving journey");
          console.log(error, "error in route map");
        });
    } else {
      //only one initial waypoint recorded 
      alert("Insufficient Journey Data");
    }
  };
  //press on map/////////////////////////////////////////////
  const handleMapPress = (e) => {
    console.log(lat, long);
  };
  //render///////////////////////////////////////////////////
  return (
    location.latitude && (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            onPress={handleMapPress}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: zoom,
              longitudeDelta: zoom,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            loadingEnabled={true}
            showsCompass={true}
            mapType={mapStyle}
          >
            {/* if isRecording is true, then show the stop button and the route */}
            {isRecording && routeData.startPoint && (
              <>
                <Polyline coordinates={[...routeData.points]} strokeWidth={4} strokeColor={mapStyle==="standard"?"black":"red"}/>
                <Marker coordinate={routeData.startPoint} pinColor="green" />
              </>
            )}
          </MapView>

          {/*vertical slider for zoom **/}
          <ZoomSlider zoom={zoom} setZoom={setZoom} mapStyle={mapStyle}/>

          {!isRecording && lat && long && (
            <View style={styles.startButton}>
              <Button title="Start" onPress={handleStartPress} />
            </View>
          )}
          {isRecording && (
            <View style={styles.stopButton}>
              <Button title="Stop" onPress={handleStopPress} />
            </View>
          )}
          {isRecording && routeData&&(
            <Stopwatch
              
              counter={counter}
            />
          )
          }
          <View style={styles.mapToggle}>
          <MapToggle mapStyle={mapStyle} setMapStyle={setMapStyle} />
          </View>

          <StatusBar style="auto" />
        </View>
      </GestureHandlerRootView>
    )
  );
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
    left: "65%",
  },
  verticalSlider: {
    position: "absolute",
    top: "65%",
    right: 0,
    height: "100%",
    width: 40,
    // zIndex:100
  },
  mapToggle:{
    position:'absolute',
    top:10,
    left:"70%",
    zIndex:100
  }
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log(error, "error in task manager");
    alert("error in background task manager", error);
  }
  if (data) {
    // console.log(data.locations[0].coords, "data")
    const { locations } = data;
    lat = locations[0].coords.latitude;
    long = locations[0].coords.longitude;
    time = locations[0].timestamp;
    // console.log(lat,long,time,"location")
    waypoints.push({ latitude: lat, longitude: long, timestamp: time });

    // console.log(waypoints.length,"number of waypoints in task manager")
  }
});
