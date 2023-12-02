import {Switch} from 'react-native';
 
export const MapToggle = ({mapStyle,setMapStyle}) => {
    return (
       
        <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={mapStyle === "standard" ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
            mapStyle === "standard"
                ? setMapStyle("satellite")
                : setMapStyle("standard");
            }}
            value={mapStyle === "standard" ? false : true}
        />
       
    );
    }