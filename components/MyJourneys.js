import React, { useEffect, useState } from 'react';
import { getAllJourneys, deleteJourney, clearAllJourneys } from '../utils/dbApi';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button, Pressable } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import {getDistance} from 'geolib';


export const MyJourneys = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [journeyList, setJourneyList] = useState([])
    const [selectedJourney, setSelectedJourney] = useState(null);
    const[cursor,setCursor]=useState(null);
    const[routePoints,setRoutePoints]=useState([]);
    const[index,setIndex]=useState(0);
    const [speed,setSpeed]=useState(1000);
    const [isMobile, setIsMobile] = useState(false);
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
    useEffect(()=>{
if(selectedJourney){
    //copy all blocks into 1 long array
    setRoutePoints([
        ...selectedJourney.blocks.reduce((acc, block) => {
            return [...acc, ...block];
        }, []),
    ])
}
    },[selectedJourney])

useEffect(()=>{
    if(isMobile){
if(index<routePoints.length-1){
    setTimeout(()=>{
        setIndex(index+1);
        setCursor(routePoints[index]);
    },speed)

    }
    else{
        setCursor(routePoints[0])
        setIndex(0);
        setIsMobile(false);
    }
}
  
},[index,isMobile])


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

    const ControlButtons=()=>{
        return(
            <View style={styles.controlButtons}>
                <Pressable onPress={()=>{setSpeed((oSpeed)=>{
                    if(oSpeed<1000){return oSpeed+100}else return oSpeed})}}><Text style={styles.controlButtonReversed}>{String.fromCharCode(187)}</Text></Pressable>
                {/*Have these 2 just change the play speed and have aplay button in the middle that iterates through the routePoints array on a timerspeed set by the arrows*/}
                 <Pressable onPress={()=>{setIsMobile(false)}}><Text style={styles.controlButton}>{"||"}</Text></Pressable> 
                 <Pressable onPress={()=>{setIsMobile(true);setSpeed(1000)}}><Text style={styles.controlButton}>{">"}</Text></Pressable>
                <Pressable onPress={()=>{setSpeed((oSpeed)=>{
                    if(oSpeed>=100){
                return oSpeed-100}})}}><Text style={styles.controlButton}>{String.fromCharCode(187)}</Text></Pressable>
                </View>
        )
    }
    /////////////INSTALLED GEOLIB TO GET DISTANCE BETWEEN POINTS AND USE THAT TO SET SPEED
    /////////////////////////////LAST THING I TOUCHED BEFORE IT BROKE SOMETHING IS NULL FOR SOME REASON^^^^^^^


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
                  
                    {selectedJourney.startPoint && routePoints&&(
                        <>
                            <Polyline
                                coordinates={[...routePoints]}
                                strokeWidth={2}
                            />
                            <Marker title="start" coordinate={selectedJourney.startPoint} pinColor="green" />
                            <Marker title ="end" coordinate={selectedJourney.endPoint} pinColor="red" />
                            <Marker title="cursor" coordinate={routePoints[index] } pinColor="blue" />

                        </>)}
                </MapView>
                {/**if journey selected show control buttons*/}
                <Text style={{ position: "absolute", top: 0, left: 10, fontSize: 20, textAlign: "center", marginTop: 20, fontWeight: 'bold' }}>Tap map to go back</Text>
                <View style={styles.info}>
                    <Text style={styles.description}>Time: {new Date(cursor.timestamp).toLocaleTimeString()}</Text>
                    <Text style={styles.description}>Latitude: {cursor.latitude}</Text>
                    <Text style={styles.description}>Longitude: {cursor.longitude}</Text>

                </View>
                <ControlButtons/>
                {/* //display speed if mobile */}
                {isMobile&&<Text style={{ position: "absolute", bottom: 10, left: 30, fontSize: 20, textAlign: "center", marginTop: 20, fontWeight: 'bold' }}>Speed: {(1000/speed).toFixed(2)} x {speed} </Text>}
             
            </View> ://or if no selected journey view list
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={journeyList}
                    renderItem={({ item }) => {
                        const date = new Date(item.startTime);

                        return (
                            <Pressable onPress={() => {
                                setSelectedJourney(item);
                                setCursor({latitude:item.startPoint.latitude,longitude:item.startPoint.longitude,timestamp:item.blocks[0][1].timestamp});
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
    ,info:{
        position: "absolute",
        top:50,
        left: 0,
        height: 100,
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
        opacity:1

    },
    description:{
        fontSize: 15,
        textAlign: "center",
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    controlButtons:{position:"absolute",
    bottom:50,
    left:0,
    height:60,
    width:"80%",
    marginLeft:"10%",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center"
},

    controlButton:{
        fontSize:40,
        borderWidth:2,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:10,
        textAlign:"center",
    },
    controlButtonReversed:{
        fontSize:40,
        borderWidth:2,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:15,
        textAlign:"center",
        transform:[{rotate:"180deg"}]
    }
});