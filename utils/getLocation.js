import * as Location from 'expo-location';

export const getLocation=async()=>{
try{
  let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return  Promise.reject("Permission denied");;
      }

      let location = await Location.getCurrentPositionAsync({});
      return location;
    }
    catch(error){
      console.log(error,"error cannot get location");
      return Promise.reject(error);
    }
  }
