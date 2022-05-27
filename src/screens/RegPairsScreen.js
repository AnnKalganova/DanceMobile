import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
} from "react-native";
import GLOBALS from "../../Globals";

const RegPairsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const group = navigation.getParam("group");

  useEffect(() => {
    const willFocusHandler = navigation.addListener("willFocus", () => {
      getPairs();
    });

    getPairs();

    return () => willFocusHandler.remove();
  }, []);

  const getPairs = () => {
    console.log("getPairs - start");
    setRefreshing(true);
    fetch(global.baseURL + "/pairs/" + group.id)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
          console.log("getPairs - fetched");
        },
        (error) => {
          setIsLoaded(true);
          setData(error);
        }
      )
      .catch((e) => {
        setIsLoaded(true);
        setError(e);
        console.log(e);
      })
      .finally(() => {
        setRefreshing(false);
      });
    console.log("getPairs - end");
  };

  const Item = ({ pair }) => (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate("RegEditPair", {
          pair: pair,
        });
      }}
    >
      <View style={styles.item}>
        <View style={styles.numberPlace}>
          <Text
            style={
              pair.number == null ? styles.pairNoNumber : styles.pairNumber
            }
          >
            {pair.number == null ? "?" : pair.number}
          </Text>
        </View>
        <View style={styles.partnersPlace}>
          <Text style={styles.partner1}>
            {pair.partner1LastName + " " + pair.partner1FirstName}
          </Text>
          <Text style={styles.partner2}>
            {pair.partner2LastName + " " + pair.partner2FirstName}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({ item }) => <Item pair={item} />;

  handleRefresh = () => {
    getPairs();
  };

  const onAddPairPress = () => {
    let newPair = {
      id: null,
      groupId: group.id,
      partner1FirstName: "",
      partner1LastName: "",
      partner2FirstName: "",
      partner2LastName: "",
      number: null,
    };

    navigation.navigate("RegEditPair", {
      pair: newPair,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <Pressable
        style={styles.addButton}
        onPress={() => {
          onAddPairPress();
        }}
      >
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  addButton: {
    alignSelf: "flex-end",
    backgroundColor: GLOBALS.COLOR.HEADERBLUE,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    elevation: 3,
    margin: 30,
  },

  addText: {
    fontSize: 48,
    color: "white",
    lineHeight: 48,
  },

  item: {
    paddingVertical: 10,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: GLOBALS.COLOR.DARKGREY,
    flexDirection: "row",
  },

  numberPlace: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  partnersPlace: {
    flex: 5,
    flexDirection: "column",
  },

  pairNoNumber: {
    fontSize: 40,
    fontWeight: "500",
    color: "#bbb",
  },

  pairNumber: {
    fontSize: 40,
    fontWeight: "500",
  },

  partner1: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },

  partner2: {
    fontSize: 18,
    flex: 1,
  },
});

export default RegPairsScreen;
