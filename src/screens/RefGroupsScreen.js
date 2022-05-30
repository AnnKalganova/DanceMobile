import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import GLOBALS from "../../Globals";

const RefGroupsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const willFocusHandler = navigation.addListener("willFocus", () => {
      getGroups();
    });

    getGroups();

    return () => willFocusHandler.remove();
  }, []);

  const getGroups = () => {
    console.log("GetGroups - start");
    setRefreshing(true);
    fetch(global.baseURL + "/groups/")
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result);
          console.log("GetGroups - fetched");
        },
        (error) => {
          console.log("Fetch error: ", error);
        }
      )
      .catch((e) => {
        console.log("Fetch catch: ", e);
      })
      .finally(() => {
        setRefreshing(false);
      });
    console.log("GetGroups - end");
  };

  const onGroupPress = (group) => {
    let alertTitle = group.isAccessGranted == true ? "Судейство" : "";

    switch (group.state) {
      case 0:
        Alert.alert(alertTitle, "Продолжается регистрация в группу");
        return;
      case 1:
        Alert.alert(alertTitle, "Группа готовится к соревнованию");
        return;
      case 2:
        if (group.isAccessGranted == false) {
          Alert.alert(
            alertTitle,
            "Группа соревнуется. Вы не были назначены судьей на данную гуппу"
          );
          return;
        }
        break;
      case 3:
        Alert.alert(alertTitle, "Соревнование для данной группы завершены");
        return;
    }

    navigation.navigate("RefPairs", {
      group: group,
    });
  };

  const Item = ({ group }) => (
    <Pressable
      style={styles.container}
      onPress={() => {
        onGroupPress(group);
      }}
    >
      <View
        style={
          group.state == 3
            ? styles.item3
            : group.state == 2
            ? styles.item2
            : group.state == 1
            ? styles.item1
            : styles.item
        }
      >
        <Text
          style={
            group.state == 3
              ? styles.groupTitle3
              : group.state == 2
              ? styles.groupTitle2
              : group.state == 1
              ? styles.groupTitle1
              : styles.groupTitle
          }
          numberOfLines={1}
        >
          {group.name}
        </Text>
        {(() => {
          if (group.isAccessGranted == true) {
            return (
              <FontAwesome
                name="star"
                style={group.state == 3 ? styles.refIcon3 : styles.refIcon}
              />
            );
          }
        })()}
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
        <Text style={styles.userRole}>(Судья)</Text>
      </View>

      <View style={styles.bottomView}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBALS.COLOR.LIGHTGREY,
  },

  refIcon: {
    color: "#609dd2",
    fontSize: 24,
  },

  refIcon1: {
    color: "#609dd2",
    fontSize: 24,
  },

  refIcon2: {
    color: "#609dd2",
    fontSize: 24,
  },

  refIcon3: {
    color: GLOBALS.COLOR.LABEL,
    fontSize: 24,
  },

  item: {
    paddingVertical: 15,
    marginHorizontal: 16,
    flexDirection: "row",

    paddingLeft: 12,
    paddingRight: 5,
    marginVertical: 10,

    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#AAA",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    elevation: 2,
  },

  item1: {
    paddingVertical: 15,
    marginHorizontal: 16,
    flexDirection: "row",

    paddingLeft: 12,
    paddingRight: 5,
    marginVertical: 10,

    backgroundColor: "#FBF9C1",
    borderRadius: 12,
    shadowColor: "#AAA",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    elevation: 2,
  },

  item2: {
    paddingVertical: 15,
    marginHorizontal: 16,
    flexDirection: "row",

    paddingLeft: 12,
    paddingRight: 8,
    marginVertical: 10,

    backgroundColor: "#C3FBC1",
    borderRadius: 12,
    shadowColor: "#AAA",

    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    elevation: 2,
  },

  item3: {
    paddingVertical: 15,
    marginHorizontal: 16,
    flexDirection: "row",

    paddingLeft: 12,
    paddingRight: 5,
    marginVertical: 10,

    backgroundColor: "#EEE",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDCDCD",
  },

  groupTitle: {
    fontSize: 20,
    color: GLOBALS.COLOR.BLUE,
    flex: 1,
  },

  groupTitle1: {
    fontSize: 20,
    color: GLOBALS.COLOR.BLUE,
    flex: 1,
  },

  groupTitle2: {
    fontSize: 20,
    color: GLOBALS.COLOR.BLUE,
    flex: 1,
  },

  groupTitle3: {
    fontSize: 20,
    color: GLOBALS.COLOR.LABEL,
    flex: 1,
  },

  topView: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: GLOBALS.COLOR.LIGHTGREY,
  },

  bottomView: {
    flex: 1,
    backgroundColor: GLOBALS.COLOR.LIGHTGREY,
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

export default RefGroupsScreen;
