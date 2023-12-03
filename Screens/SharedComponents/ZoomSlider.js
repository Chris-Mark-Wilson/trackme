
import Slider from '@react-native-community/slider';
import { View,StyleSheet,Text } from 'react-native';

export const ZoomSlider = ({ zoom,setZoom,mapStyle }) => {
    return (<>
        {mapStyle!="standard"&&<View style={{...styles.verticalSlider,backgroundColor:"grey",opacity:0.7,zIndex:1,borderWidth:1,borderColor:"white",borderRadius:5}}></View>}

        <View style={{...styles.verticalSlider,zIndex:2}}>
            <Slider
                style={{ width: "100%", height: "100%" }}
                minimumValue={0}
                maximumValue={0.2}
                minimumTrackTintColor={mapStyle==="standard"?"black":"white"}
                maximumTrackTintColor={mapStyle==="standard"?"black":"white"}
                thumbTintColor={mapStyle==="standard"?"#2979FF":"red"}
                value={zoom}
                inverted={true}
                onValueChange={(value) => setZoom(value)}
            />
        </View>
        {mapStyle!="standard"&&<View style={{flex:1,position:"absolute",top:"65%",left:"80%",width:"30%",height:"4%",backgroundColor:"grey",opacity:0.7,zIndex:1,borderWidth:1,borderColor:"white",borderRadius:5,transform:[{rotate:"-90deg"}]}}></View>}

            <View style={{flex:1,justifyContent:"center",zIndex:2, position: "absolute", top: "65%", left:"80%" ,width:"30%",height:"4%",alignItems:"center",transform:[{rotate:"-90deg"}]}}>

            <Text style={{fontSize:20,color:mapStyle==="standard"?"black":"white"}}>Zoom</Text>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    verticalSlider: {
        position: "absolute",
        top: "65%",
        left: "40%",
        height:"4%",
        width:"95%",
        transform: [{ rotate: "-90deg" }],
      },
})