
import Slider from '@react-native-community/slider';
import { View,StyleSheet,Text } from 'react-native';

export const ZoomSlider = ({ zoom,setZoom }) => {
    return (<>
        <View style={styles.verticalSlider}>
            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={0.2}
                minimumTrackTintColor="black"
                maximumTrackTintColor="black"
                thumbTintColor="#2979FF"
                value={0.2 - zoom}
                onValueChange={(value) => setZoom(0.2 - value)}
            />
        </View>
            <View style={{ position: "absolute", top: "65%", right: 5 ,transform:[{rotate:"-90deg"}]}}>
            <Text style={{fontSize:20}}>Zoom</Text>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    verticalSlider: {
        position: "absolute",
        top: "65%",
        left: "60%",
        transform: [{ rotate: "-90deg" }],
      },
})