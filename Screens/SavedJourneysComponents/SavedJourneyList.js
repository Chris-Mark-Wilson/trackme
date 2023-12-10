import { View, Text, FlatList, Pressable, Button, StyleSheet } from 'react-native';
import { deleteJourney } from '../../utils/dbApi';
import Checkbox from 'expo-checkbox';
import { InfoBox } from './InfoBox';
import { useState,useEffect } from 'react';


export const SavedJourneyList = ({ setCursor, setSelectedJourney, journeyList, setJourneyList }) => {
  //array holding checkbox values

  const [selected, setSelected] = useState(new Array(journeyList.length).fill(false));
  //flag for whether any checkboxes are selected
 const [journeysSelected, setJourneysSelected] = useState(false);
 
 useEffect(() => {
  //show or hide delete button
  if (selected.find((item) => item === true)) {
    setJourneysSelected(true)
  } else {
    setJourneysSelected(false)
  }
 }, [selected])

  ///////////mini components///////////////////////////
  const MyItemSeparator = () => {
    return (
      <View
        style={{ height: 5, backgroundColor: "grey", marginHorizontal: 10 }}
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
        fontWeight: "light",
        
      }}
    >
    {journeyList.length?`${journeyList.length} journey${journeyList.length!=1?"s":""} found`:"such empty..."}
    </Text>
  )
  const Header = () => (
    <View style={{ alignItems: "center",flexDirection:"row", justifyContent:"space-between",paddingLeft:80,paddingRight:20}}>
      {journeyList.length?<><Text
        style={{
          fontSize: 20,
          textAlign: "center",
          fontWeight: "bold",
         
        }}
      >
        Details
      </Text>
      <Text style={{
          fontSize: 20,
          textAlign: "center",
          fontWeight: "bold",
        
        }}>Select</Text></>:<Text> </Text>}

    </View>
  )
  ////////////////////////////////////////////////////
const deleteSelected =  () => {
  const deleteArray=[...journeyList.map((item,index)=>selected[index]?item.startTime:null)]
 
  deleteJourney(deleteArray)
  .then((result)=>{
   alert(`${deleteArray.length} journey${deleteArray.length>1?"s":""} deleted`)
    setSelected([])
    setJourneyList(result)
  })
  .catch(err=>alert(err))
}

  return (
    <>
    <View style={styles.container}>
      <FlatList
        data={journeyList}//array of objects
        renderItem={({ item, index }) => {
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
              
                <InfoBox routePoints={item.points} index={0} mapStyle={"standard"} cursor={{latitude: item.startPoint.latitude,longitude: item.startPoint.longitude,timestamp: item.points[1].timestamp}}

                 isMobile={false} selectedJourney={item} list={true} position={{top:5,left:0}}/>
                <View style={styles.checkbox}>
                  <Checkbox  value={selected[index]} onValueChange={(newValue) => {
                    setSelected((array) => {
                      const newArray = [...array];
                      newArray[index] = newValue;
                      return newArray;
                    });
                  
                  }
                  } />
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
    {journeysSelected&&journeyList.length&&
    <View style={styles.deleteButton}>
    <Button color={"red"} title="Delete Selected" onPress={() =>     
     deleteSelected()
    } />
  </View>}
  </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1, //100% of screen, space between items

    marginTop: 5,
    fontSize: 20,
   
  },

  listView: { borderWidth: 1, borderColor: "black", flexDirection: "row", justifyContent: "space-between",marginHorizontal:10 },

  listInfo: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
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
  checkbox:{
    alignSelf: "center",
 
    padding: 20,
    marginTop: 5,
    fontSize: 15,
  }

});