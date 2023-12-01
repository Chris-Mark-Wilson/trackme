import * as Location from 'expo-location';

export const getLocationPermissions=async()=>{
try{
  let  statusFore  = await Location.requestForegroundPermissionsAsync();
   let  statusBack  = await Location.requestBackgroundPermissionsAsync();
 
      if (statusFore.status !== 'granted' || statusBack.status !== 'granted') {
        console.log('Permission to access location was denied');
        console.log(statusFore,statusBack)
        return  Promise.reject("Permission denied");;
      }

     return "granted"
    }
    catch(error){
      console.log(error,"error cannot get location");
      return Promise.reject(error);
    }
  }
