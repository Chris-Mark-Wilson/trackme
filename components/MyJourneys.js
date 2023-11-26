import React, { useEffect, useState } from 'react';
import { getAllJourneys,deleteJourney,clearAllJourneys } from '../utils/dbApi';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button, Pressable } from 'react-native';
import MapView, {Polyline,Marker} from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';


export const MyJourneys = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [journeyList, setJourneyList] = useState([])
    const [selectedJourney, setSelectedJourney] = useState(null);
    useEffect(() => {
        //focus listener ensures up to date data
        navigation.addListener('focus', () => {

        setIsLoading(true)
        getAllJourneys()
            .then((journeys) => {
                setJourneyList(journeys);
                console.log(journeys, "journeys in my journeys");
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error, "error in my journeys");
            })
        })
        return () => {
            navigation.removeListener('focus', () => { })
        }
    }, [navigation])



    const myItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10 }} />;
    };

    const myListEmpty = () => {
        return (
            <View style={{ alignItems: "center" }}>
                <Text style={styles.item}>No journey data found</Text>
            </View>
        );
    };
    const handleMapPress = () => {
        setSelectedJourney(null);
    }


    return isLoading ? (<Text>Loading...</Text>) :
        ((selectedJourney) ? 
        <View style={styles.container}>
          <MapView
            onPress={handleMapPress}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={selectedJourney.region}
            
          >
            {/* if journey selected show mapview*/}
            {selectedJourney.startPoint && (
              <>
                <Polyline
                  coordinates={[
                    ...selectedJourney.blocks.reduce((acc, block) => {
                      return [...acc, ...block];
                    }, []),
                  ]}
                  strokeWidth={5}
                />
                <Marker coordinate={selectedJourney.startPoint} pinColor="green" />
    
            </> )}
          </MapView>
          {/* {!isMobile && (
            <View style={styles.startButton}>
              <Button title="Start" onPress={handleStartPress} />
            </View>
          )}
          {isMobile && (
            <View style={styles.stopButton}>
              <Button title="Stop" onPress={handleStopPress} />
            </View>
          )} */}
    
          {/* <StatusBar style="auto" /> */}
        </View> ://or if no selected journey view list
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={journeyList}
                    renderItem={({ item }) => {
                        const date=new Date(item.startTime);
                    
                        return (
                            <Pressable onPress={() => {
                                setSelectedJourney(item);
                            }}>
                            <Text style={styles.item}>{`${date.toLocaleDateString()},${date.toLocaleTimeString()}`}</Text>
                            </Pressable>
                        )
                    }

                    }
                    keyExtractor={(item) => item.startTime}
                    ItemSeparatorComponent={myItemSeparator}
                    ListEmptyComponent={myListEmpty}
                    ListHeaderComponent={() => (
                        <Text style={{ fontSize: 30, textAlign: "center", marginTop: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                            All Journeys
                        </Text>
                    )}
                    ListFooterComponent={() => (
                        <Text style={{ fontSize: 30, textAlign: "center", marginBottom: 20, fontWeight: 'bold' }}>End List</Text>
              )}
            />
            <Button title="Clear Journeys" onPress={() => {
                clearAllJourneys();
                setJourneyList([]);
            }

            }/>
            <Button title="Go to Map" onPress={() => navigation.navigate('Map')} />
          </SafeAreaView>
        
          );
         }
        
         
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            marginTop: 5,
            fontSize: 20,
            borderColor: "black",
            
          },
          item: {
            padding: 20,
            marginTop: 5,
            fontSize: 15,
          },
          map: {
            width: "100%",
            height: "100%",
          },
        });
  