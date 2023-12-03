
import Slider from '@react-native-community/slider';
import { View,StyleSheet,Text } from 'react-native';

export const SeekSlider = ({ index,setIndex,maxIndex,mapStyle }) => {
  return (
    <>
      {mapStyle!="standard"&&<View style={{...styles.horizontalSlider,backgroundColor:"grey",opacity:0.7,zIndex:1,borderWidth:1,borderColor:"white",borderRadius:5}}></View>}
      <View style={{...styles.horizontalSlider,zIndex:2}}>
        <Slider
          style={{ width: "100%", height: 30 }}
          minimumValue={0}
          maximumValue={maxIndex - 1}
          step={1}
          minimumTrackTintColor={mapStyle==="standard"?"black":"white"}
          maximumTrackTintColor={mapStyle==="standard"?"black":"white"}
          thumbTintColor={mapStyle==="standard"?"#2979FF":"red"}
          value={index}
          onValueChange={(value) => setIndex(value)}
        />
      </View>
      {mapStyle!="standard"&&<View style={{...styles.tripSeek,backgroundColor:"grey",opacity:0.7,zIndex:1,borderWidth:1,borderColor:"white",borderRadius:5}}></View>}
      <View
        style={styles.tripSeek}
      >
        <Text style={{ fontSize: 20 ,color:mapStyle==="standard"?"black":"white"}}>Trip Seek</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    horizontalSlider: {
        position: "absolute",
        top: "90%",
        left: "10%",
        width:"60%",
        height: "5%",
       
      },
      tripSeek:{
       
        position: "absolute",
        top: "95%",
        left: "28%",
        width:"30%",
        height: "5%",
        zIndex:2,
        justifyContent:"center",
        alignItems:"center",
      }
})