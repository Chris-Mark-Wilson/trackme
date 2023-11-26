import React, { useEffect, useState } from 'react';
import { getAllJourneys, deleteJourney, clearAllJourneys } from '../utils/dbApi';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button, Pressable } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
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



    const MyItemSeparator = () => {
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

                        </>)}
                </MapView>
                <Text style={{ position: "absolute", top: 0, left: 10, fontSize: 20, textAlign: "center", marginTop: 20, fontWeight: 'bold' }}>Tap map to go back</Text>

                {/* <StatusBar style="auto" /> */}
            </View> ://or if no selected journey view list
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={journeyList}
                    renderItem={({ item }) => {
                        const date = new Date(item.startTime);

                        return (
                            <Pressable onPress={() => {
                                setSelectedJourney(item);
                            }}><View style={styles.listItem}>
                                    <Text style={styles.item}>{`${date.toLocaleDateString()},${date.toLocaleTimeString()}`}</Text>
                                    <View style={styles.deleteButton}>
                                        <Button color={"red"} title="Delete" onPress={() => {
                                            deleteJourney(item.startTime);
                                            setJourneyList(journeyList.filter((journey) => journey.startTime !== item.startTime));
                                        }
                                        } />
                                    </View>
                                </View>
                            </Pressable>
                        )
                    }

                    }
                    keyExtractor={(item) => item.startTime}
                    ItemSeparatorComponent={MyItemSeparator}
                    ListEmptyComponent={myListEmpty}
                    ListHeaderComponent={() => (<View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 30, textAlign: "center", marginTop: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                            All Journeys
                        </Text>
                        <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 20, fontWeight: 'bold' }}>tap timestamp to view journey on map</Text>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 20, fontWeight: 'bold',textDecorationLine:"underline" }}>End List</Text>
                    )}
                />
                <View style={styles.footer}>
                    <Button color="red" title="Clear All Journeys" onPress={() => {
                        clearAllJourneys();
                        setJourneyList([]);
                    }


                    } />
                    <Button color="green" title="Back to Local Map" onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Map')
                        }

                    }
                    } />
                </View>
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
    listItem:
        { flexDirection: "row", justifyContent: "space-between" },

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
    }
});
