import React from 'react';
import { View, Text, Pressable } from 'react-native';

export const ControlButtons = ({ setSpeed, isMobile,setIsMobile,setIndex,setCursor }) => {
    return (
        <View style={styles.controlButtons}>
            <Pressable onPressIn={() => {
                setSpeed((oSpeed) => {
                    if (oSpeed < 1000) { return oSpeed + 100 } else return oSpeed
                })
            }}><Text style={styles.controlButtonReversed}>{String.fromCharCode(187)}</Text></Pressable>
            {/*Have these 2 just change the play speed and have aplay button in the middle that iterates through the routePoints array on a timerspeed set by the arrows*/}
            <Pressable onPressIn={() => {
                requestAnimationFrame(() => {
                    if (isMobile) {
                        setIsMobile(false)
                    } else {
                        setIndex(0);
                        setCursor(routePoints[0]);
                    }
                })
            }}><Text style={styles.controlButton}>{isMobile ? "||" : String.fromCharCode(61)}</Text></Pressable>
            <Pressable onPressIn={() => { setIsMobile(true); setSpeed(1000) }}><Text style={styles.controlButton}>{">"}</Text></Pressable>
            <Pressable onPressIn={() => {
                setSpeed((oSpeed) => {
                    if (oSpeed >= 100) {
                        return oSpeed - 100
                    } else return oSpeed
                })
            }}><Text style={styles.controlButton}>{String.fromCharCode(187)}</Text></Pressable>
        </View>
    )
}

const styles = {
    controlButtons: {
        position: "absolute",
        bottom: 50,
        left: 0,
        height: 60,
        width: "80%",
        marginLeft: "10%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },

    controlButton: {
        fontSize: 40,
        borderWidth: 2,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        textAlign: "center",
    },
    controlButtonReversed: {
        
        fontSize: 40,
        borderWidth: 2,
        paddingTop: 0,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        textAlign: "center",
        transform: [{ rotate: "180deg" }]
    },
}