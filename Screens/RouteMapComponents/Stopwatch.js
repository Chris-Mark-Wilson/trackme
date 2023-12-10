import {View,Text,StyleSheet} from 'react-native'
import {secondsToTimeString} from '../../utils/secondsToTimeString'

export const Stopwatch = ({counter}) =>{
    const time=secondsToTimeString(counter)
    return(
        <View style={styles.container}> 
        <Text style={styles.text}>{time}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        bottom: 50,
        left: 50,
        backgroundColor: 'silver',
        width: 100,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    }
})