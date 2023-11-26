import MapView, { Marker, Polyline } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
// import MapViewDirections from 'react-native-maps-directions';
import { getLocation } from "../utils/getLocation";
import { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Button } from "react-native";
import { useContext } from "react";
import { RouteContext } from "../contexts/routeContext";
import { addJourney } from "../utils/dbApi";

//mport {API_KEY} from '@env';

export const RouteMap = ({ navigation }) => {
  const { routeData, setRouteData } = useContext(RouteContext);
  const [isMobile, setIsMobile] = useState(false);
  const [counter, setCounter] = useState(0);
  const timerInterval = 1000;

  const [location, setLocation] = useState({});
  const [region, setRegion] = useState(null);

  const [waypoints, setWaypoints] = useState([]);
  //get initial location/////////////////////////////////////
  useEffect(() => {
    getLocation()
      .then((location) => {
        setLocation(location);
        console.log("got location", location.coords);
        if(!region){
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
      })
    
      .catch((error) => {
        alert(error);
        console.log(error, "error in catch");
        setCounter(0)
      });
  }, [counter]);

  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        setCounter((counter) => counter + 1);
        console.log("counter:", counter);
      }, timerInterval);
    } else {
      //stop pressed
      setCounter(0);
      if (counter != 0) {
        console.log("start point", routeData.startPoint);
        routeData.blocks.forEach((block) => {
          block.forEach((point) => {
            console.log("waypoint", point);
          });
          console.log("block end");
        });
        console.log("end point", routeData.endPoint);
      }
    }
  }, [counter, isMobile]);

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
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          //if there is no block or the last block is full
          newData.blocks.push([
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          ]);
        }
        return newData;
      });
    }
  }, [isMobile, counter]);

  //start journey//////////////////////////////////////////
  const handleStartPress = (e) => {
    console.log("pressed start - event:", location.coords);
    if (location.coords) {
      //set start point and clear waypoint blocks
      setRouteData((oldData) => {
        return {
          ...oldData,
          startPoint: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          startTime: Date.now(),
          region: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          blocks: [],
        };
      });
      setIsMobile(true);
    } else {
      alert("location not available");
    }
  };

  //stop journey////////////////////////////////////////////
  const handleStopPress = () => {
    //set endpoint
    setRouteData({
      ...routeData,
      endPoint: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      endTime: Date.now(),
    });
    //stop timer
    setIsMobile(false);
    //store route data in db here....
addJourney(routeData)
.then((response)=>{
  alert("journey saved");
  console.log(response,"response in route map");
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
.catch((error)=>{
  alert("error in saving journey");
  console.log(error,"error in route map");
}
)
    
  };
  //press on map/////////////////////////////////////////////
  const handleMapPress = (e) => {
    console.log("pressed map at:", e.nativeEvent.coordinate);
  };
  //render///////////////////////////////////////////////////
  return (
    <View style={styles.container}>
      <MapView
        onPress={handleMapPress}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
        loadingEnabled={true}
        showsCompass={true}
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

            {/* {
            routeData.blocks.map((block, index) => {
              //each block is a 'route' with a start and end point
              //the rest of the points in between are waypoints
              // <MapViewDirections
              //   key={index}
              //   origin={block[0]}
              
              //   {...(block.length > 1 && { waypoints: block.slice(1, block.length - 1) })
              //   }
               
              //   destination={block[block.length - 1]}
              //   apikey={API_KEY}
              //   strokeWidth={4}
              //   strokeColor="#248DFF"
              //   mode="WALKING"
              // />
            })
          } */}
          </>
        )}
      </MapView>
      {!isMobile && location.coords&&(
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
    right: 50,
  },
});
