import { Text, View, Button } from "react-native";

import { SettingContext } from "../contexts/settingContext";
import { useContext } from "react";

export const Settings = ({ navigation }) => {
  const { interval, setInterval, isRecording } = useContext(SettingContext);

  return isRecording ? (
    <Text>Recording in progress, cannot change interval</Text>
  ) : (
    <>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          height: 400,
          justifyContent: "space-around",
       
        }}
      >
        <Text style={{ fontSize: 20 }}> Timer Settings</Text>
        <Text style={{ fontSize: 15 }}>
          Point Interval: {interval / 1000} seconds
        </Text>
        <Button
          title="Increase Interval +1s"
          onPress={() => setInterval(interval + 1000)}
        ></Button>
        <Button
          title="Decrease Interval -1s"
          onPress={() => interval > 1000 && setInterval(interval - 1000)}
        ></Button>
        <Button
          title="Increase Interval +1m"
          onPress={() => setInterval(interval + 60000)}
        ></Button>
        <Button
          title="Decrease Interval -1m"
          onPress={() => interval > 61000 ? setInterval(interval - 60000):setInterval(1000)}
        ></Button>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          bottom: 50,
          left: "40%",
        }}
      >
        <Button title="Back" onPress={() => navigation.goBack()}></Button>
      </View>
    </>
  );
};
