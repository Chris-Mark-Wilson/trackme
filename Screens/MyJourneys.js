import React, { useEffect, useState } from "react";
import {
  getAllJourneys,
  deleteJourney,
  clearAllJourneys,
} from "../utils/dbApi";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Button,
  Pressable,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { getDistance } from "geolib";
import { Dimensions } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ControlButtons } from "./MyJourneyComponents/ControlButtons";
import { secondsToTimeString } from "../utils/secondsToTimeString";
import { ZoomSlider } from "./SharedComponents/ZoomSlider";
import { SeekSlider } from "./MyJourneyComponents/SeekSlider";
import { MapToggle } from "./SharedComponents/MapToggle";
import { InfoBox } from "./MyJourneyComponents/InfoBox";

export const MyJourneys = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [zoom, setZoom] = useState(0.005);
  const [isLoading, setIsLoading] = useState(true);
  const [journeyList, setJourneyList] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [isMobile, setIsMobile] = useState(false);
  const [mapStyle, setMapStyle] = useState("standard");
  useEffect(() => {
    //focus listener ensures up to date data
    navigation.addListener("focus", () => {
      setIsLoading(true);
      getAllJourneys()
        .then((journeys) => {
          setJourneyList(journeys);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error, "error in my journeys");
        });
    });
    //cleanup
    return () => {
      navigation.removeListener("focus", () => {});
    };
  }, [navigation]);

  //Journey Selected//////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (selectedJourney) {
      //copy all journey waypoints
      setRoutePoints([...selectedJourney.points]);
    }
  }, [selectedJourney]);

  useEffect(() => {
    if (isMobile) {
      if (index < routePoints.length - 2) {
        setTimeout(() => {
          setIndex(index + 1);
        }, speed);
      } else {
        setCursor(routePoints[0]);
        setIndex(0);
        setIsMobile(false);
      }
    }
    setCursor(routePoints[index]);
  }, [index, isMobile]);

  const MyItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10 }}
      />
    );
  };

  const myListEmpty = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.item}>No journey data found</Text>
      </View>
    );
  };
  const handleMapPress = () => {
    setIsMobile(false);
    setSelectedJourney(null);
  };

  const logArgs = (...args) => {
    console.log(args, "args in logargs");
  };

  return isLoading ? (
    //////////////////////////////////////////////////////////////////////////////////////////////////
    <Text>Loading...</Text>
  ) : selectedJourney && cursor.latitude ? (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/**needed for rn-vertical-slider */}
      <View style={styles.container}>
        <MapView
          onPress={handleMapPress}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: cursor.latitude,
            longitude: cursor.longitude,
            latitudeDelta: zoom,
            longitudeDelta: zoom,
          }}
       
          mapType={mapStyle}
        >


          {selectedJourney.startPoint && routePoints[index] && (
            <>
              <Polyline coordinates={[...routePoints]} strokeWidth={4}strokeColor={mapStyle==="standard"?"black":"red"} />
              <Marker
                title="start"
                coordinate={selectedJourney.startPoint}
                pinColor="green"
              />
              <Marker
                title="end"
                coordinate={selectedJourney.endPoint}
                pinColor="red"
              />
              <Marker
                title="cursor"
                coordinate={routePoints[index]}
                pinColor="blue"
              />
            </>
          )}
        </MapView>
        {/** vertical slider for zoom level -----------------------------------------------------------*/}
        <ZoomSlider zoom={zoom} setZoom={setZoom} mapStyle={mapStyle}/>
           {!isMobile&& <SeekSlider index={index} setIndex={setIndex} maxIndex={routePoints.length-1} mapStyle={mapStyle}/>}
       
        {/**info box */}
          {/**--------------------------------------------------------------------------------------------- */}
          {routePoints[index] && ( //if route points exist show info
         <InfoBox routePoints={routePoints} index={index} mapStyle={mapStyle} cursor={cursor} isMobile={isMobile} selectedJourney={selectedJourney} list={false} position={{top:5,left:0}}/>
        )}
        {/**--------------------------------------------------------------------------------------------- */}
        <ControlButtons
          routePoints={routePoints}
          setSpeed={setSpeed}
          isMobile={isMobile}
          setIndex={setIndex}
          setIsMobile={setIsMobile}
          setCursor={setCursor}
          mapStyle={mapStyle}
        />
        {/* //display speed multipler if mobile */}
        {isMobile && (
          <Text
            style={{
              position: "absolute",
              bottom: 10,
              left: 30,
              fontSize: 20,
              textAlign: "center",
              marginTop: 20,
              fontWeight: "bold",
              color: mapStyle==="standard"?"black":"white",
            }}
          >
            Speed: {(1000 / speed).toFixed(2)} x{" "}
          </Text>
        )}
          <View style={styles.mapToggle}>
          <MapToggle mapStyle={mapStyle} setMapStyle={setMapStyle} />
          </View>
      </View>
    </GestureHandlerRootView> // end map journey display
  ) : (
    ///////////////////////////////////////////////////////////////////////////////////////
    // start journey list display

    //or if no selected journey view list
    <SafeAreaView style={styles.container}>
      <FlatList
        data={journeyList}
        renderItem={({ item }) => {
          const date = new Date(item.startTime);

          return (
            <Pressable
              onPress={() => {
                setCursor({
                  latitude: item.startPoint.latitude,
                  longitude: item.startPoint.longitude,
                  timestamp: item.points[1].timestamp,
                });
                setSelectedJourney(item);
              }}
            >
              <View style={styles.listItem}>
                <Text
                  style={styles.item}
                >{`${date.toLocaleDateString()},${date.toLocaleTimeString()}`}</Text>
                <View style={styles.deleteButton}>
                  <Button
                    color={"red"}
                    title="Delete"
                    onPress={() => {
                      deleteJourney(item.startTime);
                      setJourneyList(
                        journeyList.filter(
                          (journey) => journey.startTime !== item.startTime
                        )
                      );
                    }}
                  />
                </View>
              </View>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.startTime}
        ItemSeparatorComponent={MyItemSeparator}
        ListEmptyComponent={myListEmpty}
        ListHeaderComponent={() => (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 30,
                textAlign: "center",
                marginTop: 20,
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              All Journeys
            </Text>
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                marginBottom: 20,
                fontWeight: "bold",
              }}
            >
              tap timestamp to view journey on map
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            End List
          </Text>
        )}
      />
      <View style={styles.footer}>
        <Button
          color="red"
          title="Clear All Journeys"
          onPress={() => {
            clearAllJourneys();
            setJourneyList([]);
          }}
        />
        <Button
          color="green"
          title="Back to Local Map"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("Map");
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    fontSize: 20,
    borderColor: "black",
  },
  listItem: { flexDirection: "row", justifyContent: "space-between" },

  item: {
    padding: 20,
    marginTop: 5,
    fontSize: 15,
  },
  deleteButton: {
    width: 200,
    height: 40,
    fontSize: 10,
    textAlign: "center",

    alignSelf: "center",
    color: "blue",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  footer: {
    height: 150,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
 
 
  mapToggle:{
    position:'absolute',
    top:10,
    left:"80%",
    zIndex:100
  }
});
