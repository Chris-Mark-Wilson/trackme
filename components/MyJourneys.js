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
import { ControlButtons } from "./ControlButtons";
import { secondsToTimeString } from "../utils/secondsToTimeString";
import { ZoomSlider } from "./ZoomSlider";
import { SeekSlider } from "./SeekSlider";

export const MyJourneys = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [ASPECT_RATIO, setASPECT_RATIO] = useState(windowWidth / windowHeight);
  const [zoom, setZoom] = useState(0.005);
  const [isLoading, setIsLoading] = useState(true);
  const [journeyList, setJourneyList] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    //focus listener ensures up to date data
    navigation.addListener("focus", () => {
      setIsLoading(true);
      getAllJourneys()
        .then((journeys) => {
          setJourneyList(journeys);
          console.log("got all journeys");
          console.log(ASPECT_RATIO, "aspect ratio");
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error, "error in my journeys");
        });
    });
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
          onRegionChange={(newRegion) => {
            console.log(zoom, "zoom level in region change");
          }}
        >
          {/* if journey selected show mapview*/}

          {selectedJourney.startPoint && routePoints[index] && (
            <>
              <Polyline coordinates={[...routePoints]} strokeWidth={2} />
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
        <ZoomSlider zoom={zoom} setZoom={setZoom} />
            <SeekSlider index={index} setIndex={setIndex} maxIndex={routePoints.length-1}/>
        <Text
          style={{
            position: "absolute",
            top: 0,
            left: 10,
            fontSize: 20,
            textAlign: "center",
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          Tap map to go back
        </Text>

        {/**info box */}
        {/**--------------------------------------------------------------------------------------------- */}
        {routePoints[index] && ( //if route points exist show info
          <View style={styles.info}>
            {/* display date of cursor point */}
            <Text style={styles.description}>
              Date: {new Date(cursor.timestamp).toLocaleDateString()}
            </Text>
            {/* display time of cursor point */}
            <Text
              style={
                isMobile
                  ? { ...styles.description, color: "blue", borderWidth: 1 }
                  : { ...styles.description, color: "black" }
              }
            >
              Time: {new Date(cursor.timestamp).toLocaleTimeString()}
            </Text>

            {/* add up distances between points*/}
            <Text style={styles.description}>
              Total Distance:{" "}
              {(
                routePoints.reduce((acc, point, index, array) => {
                  if (index < array.length - 1) {
                    acc += getDistance(point, array[index + 1]);
                  }
                  return acc;
                }, 0) * 0.000621371
              ).toFixed(2)}{" "}
              miles
            </Text>
            <Text style={styles.description}>
              Total Time:{" "}
              {secondsToTimeString(
                (selectedJourney.endTime - selectedJourney.startTime) / 1000
              )}
            </Text>

            {/*add up distance to cursor */}
            <Text style={styles.description}>
              Distance covered:{" "}
              {(
                routePoints
                  .slice(0, index + 1)
                  .reduce((acc, point, index, array) => {
                    if (index < array.length - 1) {
                      acc += getDistance(point, array[index + 1]);
                    }
                    return acc;
                  }, 0) * 0.000621371
              ).toFixed(2)}{" "}
              miles
            </Text>

            {/*Calculate and display local speed */}
            <Text style={styles.description}>
              Speed:{" "}
              {(
                (getDistance(cursor, routePoints[index + 1]) /
                  ((routePoints[index + 1].timestamp - cursor.timestamp) /
                    1000)) *
                2.23694
              ).toFixed(2)}{" "}
              mph{" "}
            </Text>

            {/* calculate and display average journey speed**/}
            <Text style={styles.description}>
              Average trip speed:{" "}
              {(
                (routePoints.reduce((acc, point, index, array) => {
                  if (index < array.length - 1) {
                    acc += getDistance(point, array[index + 1]);
                  }
                  return acc;
                }, 0) /
                  ((selectedJourney.endTime - selectedJourney.startTime) /
                    1000)) *
                2.23694
              ).toFixed(2)}{" "}
              mph{" "}
            </Text>
          </View>
        )}
        {/**--------------------------------------------------------------------------------------------- */}
        <ControlButtons
          routePoints={routePoints}
          setSpeed={setSpeed}
          isMobile={isMobile}
          setIndex={setIndex}
          setIsMobile={setIsMobile}
          setCursor={setCursor}
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
            }}
          >
            Speed: {(1000 / speed).toFixed(2)} x{" "}
          </Text>
        )}
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
  info: {
    position: "absolute",
    top: 50,
    left: 0,
    height: 150,
    width: "90%",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: "5%",
    marginRight: "5%",
    opacity: 1,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});
