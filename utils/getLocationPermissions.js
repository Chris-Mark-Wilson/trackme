import * as Location from 'expo-location';

export const getLocationPermissions = async () => {
  try {
    let statusFore = await Location.requestForegroundPermissionsAsync();
    let statusBack = await Location.requestBackgroundPermissionsAsync();

    if (statusFore.status !== 'granted' && statusBack.status !== 'granted') {
      console.log('Permission to access both foreground and background location was denied');
      return Promise.reject("Both permissions denied");
    } else if (statusFore.status !== 'granted') {
      console.log('Permission to access foreground location was denied');
      return Promise.reject("Foreground permission denied");
    } else if (statusBack.status !== 'granted') {
      console.log('Permission to access background location was denied');
      return Promise.reject("Background permission denied");
    }

    return "granted";
  } catch (error) {
    console.log(error, "error cannot get location");
    return Promise.reject(error);
  }
}