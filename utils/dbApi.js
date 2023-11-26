import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllJourneys = async () => {
    try {
      
        const journeys = await AsyncStorage.getItem('journeys');
        const myJourneys = JSON.parse(journeys);
        console.log(myJourneys,"journeys in api");
        return myJourneys;
    } catch (error) {
        console.log(error,"error in api get all journeys");
        return Promise.reject(error);
    }
}

export const addJourney = async (journey) => {
    try {
        let myJourneys = await getAllJourneys();
        console.log(myJourneys,"my journeys in add journey");
        let newJourneys = myJourneys ? [...myJourneys] : []//create new array if myJourneys is null
        newJourneys.push(journey);
        await AsyncStorage.setItem('journeys', JSON.stringify(newJourneys));
        return journey;
    } catch (error) {
        console.log(error,"error in api add journey");
        return Promise.reject(error);
    }
}
export const deleteJourney = async (startTime) => {
    try {
        let myJourneys = await getAllJourneys();
        let newJourneys = myJourneys.filter((journey) => journey.startTime !== startTime);
        await AsyncStorage.setItem('journeys', JSON.stringify(newJourneys));
        return startTime;
    } catch (error) {
        console.log(error,"error in api delete journey");
        return Promise.reject(error);
    }
}

export const clearAllJourneys = async () => {
    try {
        await AsyncStorage.removeItem('journeys');
    } catch (error) {
        console.log(error,"error in api clear all journeys");
        return Promise.reject(error);
    }
}