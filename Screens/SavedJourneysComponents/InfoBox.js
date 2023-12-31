import { View, Text, StyleSheet, Dimensions } from "react-native";
import getDistance from "geolib/es/getPreciseDistance";
import { secondsToTimeString } from "../../utils/secondsToTimeString";

export const InfoBox = ({
  routePoints,
  index,
  mapStyle,
  cursor,
  isMobile,
  selectedJourney,
  list,
  position,
}) => {
  return (
    <>
      {/*show greyed out background if not standard map*/}
      {!list && (
        <View
          style={{
            ...styles.info,
            opacity: 0.7,
            zIndex: 1,
            backgroundColor: "grey",
            top: position.top,
            left: position.left,
          }}
        ></View>
      )}

      <View
        style={{
          ...styles.info,
          borderWidth: list ? 0 : 1,
          zIndex: 2,
          opacity: 1,
          borderColor: mapStyle === "standard" ? "black" : "white",
          position: !list ? "absolute" : "relative",
          top: position.top,
          left: position.left,
          width: list ? 220 : "90%",
          height: list ? 95 : 170,
          fontSize: list ? 12 : 15,
          marginTop: list ? 0 : 5,
          marginBottom: list ? 15 : 0,
        }}
      >
        {/* display date of cursor point */}
        <Text
          style={{
            ...styles.description,
            color: mapStyle === "standard" ? "black" : "white",
          }}
        >
          Date: {new Date(cursor.timestamp).toLocaleDateString()}
        </Text>
        {/* display time of cursor point */}
        {!list && (
          <Text
            style={
              isMobile
                ? {
                    ...styles.description,
                    color: mapStyle === "standard" ? "blue" : "cyan",
                    borderWidth: 1,
                  }
                : {
                    ...styles.description,
                    color: mapStyle === "standard" ? "black" : "white",
                  }
            }
          >
            Time: {new Date(cursor.timestamp).toLocaleTimeString()}
          </Text>
        )}

        {/* add up distances between points, display total distance*/}
        <Text
          style={{
            ...styles.description,
            color: mapStyle === "standard" ? "black" : "white",
          }}
        >
          Total Distance:{" "}
          {(
            routePoints.reduce((acc, point, index, array) => {
              if (index < array.length - 1) {
                acc += getDistance(point, array[index + 1]);
              }
              return acc;
            }, 0) * 0.000621371
          ).toFixed(2)}{" "}
          miles
        </Text>

        {/* display total time of journey */}
        <Text
          style={{
            ...styles.description,
            color: mapStyle === "standard" ? "black" : "white",
          }}
        >
          Total Time:{" "}
          {secondsToTimeString(
            (selectedJourney.endTime - selectedJourney.startTime) / 1000
          )}
        </Text>

        {/*add up distance to cursor, display distance travelled*/}
        {!list && (
          <Text
            style={{
              ...styles.description,
              color: mapStyle === "standard" ? "black" : "white",
            }}
          >
            Distance covered:{" "}
            {(
              routePoints
                .slice(0, index + 1)
                .reduce((acc, point, index, array) => {
                  if (index < array.length - 1) {
                    acc += getDistance(point, array[index + 1]);
                  }
                  return acc;
                }, 0) * 0.000621371
            ).toFixed(2)}{" "}
            miles
          </Text>
        )}

        {/*Calculate and display local speed */}
        {!list && (
          <Text
            style={{
              ...styles.description,
              color: mapStyle === "standard" ? "black" : "white",
            }}
          >
            Speed:{" "}
            {(
              (getDistance(cursor, routePoints[index + 1]) /
                ((routePoints[index + 1].timestamp - cursor.timestamp) /
                  1000)) *
              2.23694
            ).toFixed(2)}{" "}
            mph{" "}
          </Text>
        )}

        {/* calculate and display average journey speed**/}
        <Text
          style={{
            ...styles.description,
            color: mapStyle === "standard" ? "black" : "white",
          }}
        >
          Average trip speed:{" "}
          {(
            (routePoints.reduce((acc, point, index, array) => {
              if (index < array.length - 1) {
                acc += getDistance(point, array[index + 1]);
              }
              return acc;
            }, 0) /
              ((selectedJourney.endTime - selectedJourney.startTime) / 1000)) *
            2.23694
          ).toFixed(2)}{" "}
          mph{" "}
        </Text>
{/* display point interval */}
         <Text
          style={{
            ...styles.description,
            color: mapStyle === "standard" ? "black" : "white",
          }}
        >Waypoint Interval: {selectedJourney.interval/1000}s</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  info: {
    position: "absolute",
    height: 170,
    width: "90%",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: "5%",
    marginRight: "5%",
    opacity: 1,
    borderRadius: 10,
  },
  description: {
    // fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});
