import React, { useEffect, useState } from "react";
import {
  getAllJourneys
 } from "../utils/dbApi";
import {
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import { SavedJourneyList } from "./SavedJourneysComponents/SavedJourneyList";
import { SavedJourneyMapView } from "./SavedJourneysComponents/SavedJourneyMapView";

export const SavedJourneys = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [index, setIndex] = useState(0);
  const [journeyList, setJourneyList] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    //focus listener ensures up to date data
    navigation.addListener("focus", () => {
      setIsLoading(true);
      getAllJourneys()
        .then((journeys) => {
          //if no journeys set journeyList to empty array or it crashes
          setJourneyList(journeys||[]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error, "error in my journeys");
        });
    });
    //cleanup
    return () => {
      navigation.removeListener("focus", () => { });
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



  const NavButton = () => {
    return (
      <View style={styles.navDelete}>
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
    )
  }

  return isLoading ? (
    <Text>Loading...</Text>
  ) : selectedJourney && cursor.latitude ? (
    <SavedJourneyMapView
      cursor={cursor}
      selectedJourney={selectedJourney}
      setSelectedJourney={setSelectedJourney}
      routePoints={routePoints}
      index={index}
      setIndex={setIndex}
      setCursor={setCursor}
      isMobile={isMobile}
      setIsMobile={setIsMobile} 
      speed={speed}
      setSpeed={setSpeed}
       />
    // end map journey display
  ) : (
    //or if no selected journey view saved journey list
    <>
      <SavedJourneyList
        setCursor={setCursor}
        setSelectedJourney={setSelectedJourney}
        journeyList={journeyList}
        setJourneyList={setJourneyList} />
      <NavButton />
    </>   
  );
};

const styles=StyleSheet.create({
  navDelete: {
 
    height: 50,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
})
