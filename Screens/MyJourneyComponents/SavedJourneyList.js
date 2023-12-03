import {View,Text,FlatList,Pressable,Button,StyleSheet} from 'react-native';
import { deleteJourney } from '../../utils/dbApi';


export const SavedJourneyList = ({setCursor,setSelectedJourney,journeyList,setJourneyList}) => {

    ///////////mini components///////////////////////////
    const MyItemSeparator = () => {
        return (
          <View
            style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10 }}
          />
        );
      };
    
      const myListEmpty = () => {
        return (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.item}>No journey data found</Text>
          </View>
        );
      };
      const Footer = () => (
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "bold",
            textDecorationLine: "underline",
          }}
        >
          End List
        </Text>
      )
      const Header = () => (
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 30,
              textAlign: "center",
              marginTop: 20,
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            All Journeys
          </Text>
          <Text
            style={{
              fontSize: 15,
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "bold",
            }}
          >
            tap timestamp to view journey on map
          </Text>
        </View>
      )
 ////////////////////////////////////////////////////


    return(
        <View style={styles.container}>
      <FlatList
        data={journeyList}//array of objects
        renderItem={({ item }) => {
          const date = new Date(item.startTime);

          return (
            <Pressable
              onPress={() => {
                setCursor({
                  latitude: item.startPoint.latitude,
                  longitude: item.startPoint.longitude,
                  timestamp: item.points[1].timestamp,
                });
                setSelectedJourney(item);
              }}
            >
              <View style={styles.listView}>
                <Text
                  style={styles.listItem}
                >{`${date.toLocaleDateString()},${date.toLocaleTimeString()}`}</Text>

                <View style={styles.deleteButton}>
                  <Button
                    color={"red"}
                    title="Delete"
                    onPress={() => {
                      deleteJourney(item.startTime);
                      setJourneyList(
                        journeyList.filter(
                          (journey) => journey.startTime !== item.startTime
                        )
                      );
                    }}
                  />
                </View>
              </View>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.startTime}
        ItemSeparatorComponent={MyItemSeparator}
        ListEmptyComponent={myListEmpty}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
      />
      {/*-------------end flatList-----------------*/}

     
    </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1, //100% of screen, space between items
        borderWidth: 1,
        marginTop: 5,
        fontSize: 20,
        borderColor: "black",
      },
      
  listView: { borderWidth:1,borderColor:"green",flexDirection: "row", justifyContent: "space-between" },

  listItem: {
    borderWidth:1,
    borderColor:"red",
    padding: 20,
    marginTop: 5,
    fontSize: 15,
  },
  deleteButton: {
    width: 200,
    height: 40,
    fontSize: 10,
    textAlign: "center",

    alignSelf: "center",
    color: "blue",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },

    });