import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export const ControlButtons = ({ routePoints, setSpeed, isMobile, setIsMobile, setIndex, setCursor, mapStyle }) => {
    return (
        <View style={styles.controlButtons}>
            <Pressable onPressIn={() => {
                setSpeed((oSpeed) => {
                    if (oSpeed < 1000) { return oSpeed + 100 } else return oSpeed
                })
            }}><Entypo name="controller-fast-backward" size={36} color={mapStyle === "standard" ? "black" : "white"} /></Pressable>

                    <Pressable onPressIn={() => {
                requestAnimationFrame(() => {
                    if (isMobile) {
                        setIsMobile(false)
                    } else {
                        setIndex(0);
                        setCursor(routePoints[0]);
                    }
                })
            }}>{isMobile ? <Entypo name="controller-paus" size={36} color={mapStyle === "standard" ? "black" : "white"} /> : <Entypo name="controller-stop" size={36} color={mapStyle === "standard" ? "black" : "white"} />}</Pressable>

            <Pressable onPressIn={() => { setIsMobile(true); setSpeed(1000) }}><Entypo name="controller-play" size={36} color={mapStyle === "standard" ? "black" : "white"} /></Pressable>

            <Pressable onPressIn={() => {
                setSpeed((oSpeed) => {
                    if (oSpeed >= 100) {
                        return oSpeed - 100
                    } else return oSpeed
                })
            }}><Entypo name="controller-fast-forward" size={36} color={mapStyle === "standard" ? "black" : "white"} /></Pressable>
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