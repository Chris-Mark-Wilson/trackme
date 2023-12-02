
import Slider from '@react-native-community/slider';
import { View,StyleSheet,Text } from 'react-native';

export const SeekSlider = ({ index,setIndex,maxIndex }) => {
  return (
    <>
      <View style={styles.verticalSlider}>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={maxIndex-1}
          step={1}
          minimumTrackTintColor="black"
          maximumTrackTintColor="#D1D1D6"
          thumbTintColor="#2979FF"
          value={index}
          onValueChange={(value) => setIndex(value)}
        />
      </View>
      <View
        style={{
          position: "absolute",
          top: "95%",
          left: "40%",
     
        }}
      >
        <Text style={{ fontSize: 20 }}>Trip Seek</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    verticalSlider: {
        position: "absolute",
        top: "90%",
        left: "20%",
       
      },
})