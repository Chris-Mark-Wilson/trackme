import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ControlButtons } from "./ControlButtons";
import { ZoomSlider } from "../SharedComponents/ZoomSlider";
import { SeekSlider } from "./SeekSlider";
import { MapToggle } from "../SharedComponents/MapToggle";
import MapView, { Polyline, Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { View, Text, StyleSheet } from "react-native";
import { InfoBox } from "./InfoBox";
import { useState,useEffect } from "react";

export const SavedJourneyMapView = ({cursor,selectedJourney,setSelectedJourney,routePoints,index,setIndex,setCursor,isMobile,setIsMobile,speed,setSpeed}) => {

    const [zoom, setZoom] = useState(0.005);
    const [mapStyle, setMapStyle] = useState("standard");
   
    



    const handleMapPress = () => {
        setIsMobile(false);
        setSelectedJourney(null);
      };

    return(
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

{/**--------------------------------------------------------------------------------------------- */ }
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
          <>
          {mapStyle!="standard"&&<View style={{...styles.speedMultiplier,backgroundColor:"grey",opacity:0.7,zIndex:1,borderWidth:1,borderColor:"white",borderRadius:5}}></View>}
          <View style={{...styles.speedMultiplier,zIndex:2,color: mapStyle==="standard"?"black":"white"}}>
          <Text style={{fontSize:20,fontWeight:"bold",color:mapStyle!="standard"?"white":"black"}}>Speed:{(1000 / speed).toFixed(2)} x</Text>
          </View>
          </>
        )}
          <View style={styles.mapToggle}>
          <MapToggle mapStyle={mapStyle} setMapStyle={setMapStyle} />
          </View>
          
      </View>
    </GestureHandlerRootView>
    )
};
const styles=StyleSheet.create({
    container: {
        flex: 1, //100% of screen, space between items
        borderWidth: 1,
        marginTop: 5,
        fontSize: 20,
        borderColor: "black",
      },
    map: {
        width: "100%",
        height: "100%",
      },
    speedMultiplier: {
      position: "absolute",
      bottom: "5%",
      left: "25%",
    justifyContent:"center",
      alignItems: "center",
      width:"40%",
      height:"5%"
    },  
     
      mapToggle:{
        position:'absolute',
        top:10,
        left:"80%",
        zIndex:100
      }
    })