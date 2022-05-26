import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  FlatList,
  StatusBar,
  SafeAreaView,
  Pressable,
} from "react-native";

import GLOBALS from "../../Globals";

const RegGroupsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const willFocusHandler = navigation.addListener("willFocus", () => {
      getGroups();
    });

    getGroups();

    return () => willFocusHandler.remove();
  }, []);

  getGroups = () => {
    console.log("GetGroups - start");
    setRefreshing(true);
    fetch(global.baseURL + "/groups/")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
          console.log("GetGroups - fetched");
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
    console.log("GetGroups - end");
  };

  // onItemPress = (item) => {
  //   navigation.navigate("RegPairs", item);
  // };

  const Item = ({ group }) => (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate("RegPairs", {
          group: group,
        });
      }}
    >
      <View style={styles.item}>
        <Text style={styles.groupTitle} numberOfLines={1}>
          {group.name}
        </Text>
      </View>
    </Pressable>
  );

  const renderItem = ({ item }) => <Item group={item} />;

  handleRefresh = () => {
    getGroups();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.userName}>
          {global.userInfo.lastName} {global.userInfo.firstName}
        </Text>
        <Text style={styles.userRole}>
          {global.userType == "Registration" ? "(Организатор)" : undefined}
          {global.userType == "Referee" ? "(Судья)" : undefined}
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  item: {
    paddingVertical: 15,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: GLOBALS.COLOR.DARKGREY,
  },
  groupTitle: {
    fontSize: 20,
    color: GLOBALS.COLOR.BLUE,
  },

  topView: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: GLOBALS.COLOR.GREY,
  },

  userName: {
    fontSize: 25,
    color: GLOBALS.COLOR.BLUE,
    textAlign: "center",
  },

  userRole: {
    fontSize: 15,
    color: GLOBALS.COLOR.BLUE,
    textAlign: "center",
  },
});

export default RegGroupsScreen;
