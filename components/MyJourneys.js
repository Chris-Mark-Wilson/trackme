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
      
if(index<routePoints.length-2){
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
                <Pressable onPressIn={()=>{setSpeed((oSpeed)=>{
                    if(oSpeed<1000){return oSpeed+100}else return oSpeed})}}><Text style={styles.controlButtonReversed}>{String.fromCharCode(187)}</Text></Pressable>
                {/*Have these 2 just change the play speed and have aplay button in the middle that iterates through the routePoints array on a timerspeed set by the arrows*/}
                 <Pressable onPressIn={()=>{
                    requestAnimationFrame(()=>{
                    if(isMobile){
                        setIsMobile(false)
                    }else{setIndex(0);
                    setCursor(routePoints[0]);
                    }
                    })
                }}><Text style={styles.controlButton}>{isMobile?"||":String.fromCharCode(61)}</Text></Pressable> 
                 <Pressable onPressIn={()=>{setIsMobile(true);setSpeed(1000)}}><Text style={styles.controlButton}>{">"}</Text></Pressable>
                <Pressable onPressIn={()=>{setSpeed((oSpeed)=>{
                    if(oSpeed>=100){
                return oSpeed-100}else return oSpeed})}}><Text style={styles.controlButton}>{String.fromCharCode(187)}</Text></Pressable>
                </View>
        )
    }
    const logArgs=(...args)=>{
        console.log(args);
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
                  
                    {selectedJourney.startPoint && routePoints[index]&&(
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
              
                <Text style={{ position: "absolute", top: 0, left: 10, fontSize: 20, textAlign: "center", marginTop: 20, fontWeight: 'bold' }}>Tap map to go back</Text>

                {/**info box */}

                {routePoints[index] && (//if route points exist show info
                    <View style={styles.info}>
                        {/* display date of cursor point */}
                        <Text style={styles.description}>Date: {new Date(cursor.timestamp).toLocaleDateString()}</Text>

                        {/* add up distances between points*/}
                        <Text style={styles.description}>Total Distance: {((
                            routePoints.reduce((acc, point, index, array) => {
                                if (index < array.length - 1) {
                                    acc += getDistance(point, array[index + 1]);
                                }
                                return acc;
                            }, 0)) * 0.000621371).toFixed(2)} miles</Text>

                            {/* display time of cursor point */}
                        <Text style={isMobile?{...styles.description,color:"blue",borderWidth:1}:{...styles.description,color:"black"}}>Time: {new Date(cursor.timestamp).toLocaleTimeString()}</Text>

                        {/*add up distance to cursor */}
                        <Text style={styles.description}>Distance covered: {((
                            routePoints.slice(0, index + 1).reduce((acc, point, index, array) => {
                                if (index < array.length - 1) {
                                    acc += getDistance(point, array[index + 1]);
                                }
                                return acc;
                            }, 0)) * 0.000621371).toFixed(2)} miles</Text>

                        {/*Calculate and display local speed */}
                        <Text style={styles.description}>Speed: {(((getDistance(cursor, routePoints[index + 1])) / ((routePoints[index + 1].timestamp - cursor.timestamp) / 1000)) * 2.23694).toFixed(2)} mph </Text>

                        {/* calculate and display average journey speed**/}
                        <Text style={styles.description}>Average trip speed: {(((routePoints.reduce((acc, point, index, array) => {
                            if (index < array.length - 1) {
                                acc += getDistance(point, array[index + 1]);
                            }
                            return acc;
                        }, 0)) / ((selectedJourney.endTime - selectedJourney.startTime) / 1000)) * 2.23694).toFixed(2)} mph </Text>
                    </View>
                 )
                 }
                <ControlButtons/>
                {/* //display speed multipler if mobile */}
                {isMobile&&<Text style={{ position: "absolute", bottom: 10, left: 30, fontSize: 20, textAlign: "center", marginTop: 20, fontWeight: 'bold' }}>Speed: {(1000/speed).toFixed(2)} x </Text>}
             
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
        opacity:1

    },
    description:{
        fontSize: 15,
        textAlign: "center",
        fontWeight: 'bold',
     
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
        paddingTop:0,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:10,
        textAlign:"center",
        transform:[{rotate:"180deg"}]
    }
});
