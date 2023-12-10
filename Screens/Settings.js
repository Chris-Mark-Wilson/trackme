import {Text,View, Button } from "react-native";

import { SettingContext } from "../contexts/settingContext";
import { useContext } from "react";


export const Settings = ({ navigation }) => {   
    const{interval, setInterval} = useContext(SettingContext);
    return(<>
        <View>
            <Text>Settings</Text>
            <Text>Interval: {interval/1000}seconds</Text>
            <Button title="Increase Interval" onPress={() => setInterval(interval + 1000)}></Button>
            <Button title="Decrease Interval" onPress={() => interval>1000&&setInterval(interval - 1000)}></Button>
        </View>
        <View>
            <Button title="Go to Map" onPress={() => navigation.navigate('Map')}></Button>
        </View>
        </>
    )
}