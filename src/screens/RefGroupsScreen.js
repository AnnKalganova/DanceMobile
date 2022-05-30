import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import GLOBALS from "../../Globals";

import { AntDesign } from "@expo/vector-icons"; //user
import { Entypo } from "@expo/vector-icons"; //star, trofy
import { EvilIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const RefGroupsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [canComplete, setCanComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
          setIsLoaded(true);
          setData(result);
          console.log("GetGroups - fetched");
        },
        (error) => {
          setIsLoaded(true);
          setData(error);
          console.log("GetGroups - fetched - error");
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
          Alert.alert(alertTitle, "Группа соревнуется");
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

    // return;

    // if (group.state == ) {
    //   // Alert.alert("", "Не всем парам присвоены номера");
    //   Alert.alert(
    //     "",
    //     "Для завершение регистрации необходимо всем парам присвоить номера"
    //   );
    //   return;
    // }
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
              : // : group.state == 2
                // ? styles.groupTitle2
                // : group.state == 1
                // ? styles.groupTitle1
                styles.groupTitle
          }
          numberOfLines={1}
        >
          {group.name}
        </Text>
        {(() => {
          if (group.isAccessGranted == true) {
            return (
              // <FontAwesome
              //   name="balance-scale"
              //   style={group.state == 3 ? styles.refIcon3 : styles.refIcon}
              // />
              // <AntDesign
              //   name="star"
              //   style={group.state == 3 ? styles.refIcon3 : styles.refIcon}
              // />

              <FontAwesome
                name="star"
                style={group.state == 3 ? styles.refIcon3 : styles.refIcon}
              />
            );
          }

          return;
          /* <Feather
          name="check"
          style={[
            styles.groupCompleteIcon,
            {
              color: group.completedState ? "green" : "white",
            },
          ]}
        /> */

          return (
            /* <AntDesign name="user" style={styles.refIcon} /> */
            /* <Entypo name="star" style={styles.refIcon} /> */
            /* <Entypo name="star-outlined" style={styles.refIcon} /> */

            // <Entypo
            //   name="trophy"
            //   style={group.state == 3 ? styles.refIcon3 : styles.refIcon}
            // />

            <FontAwesome
              name="balance-scale"
              style={group.state == 3 ? styles.refIcon3 : styles.refIcon}
            />

            /* <EvilIcons name="chart" style={styles.refIcon} /> */
            /* <Feather name="award" style={styles.refIcon} /> */

            /* <FontAwesome name="user" style={styles.refIcon} /> */
            /* <FontAwesome name="trophy" style={styles.refIcon} /> */
            /* <FontAwesome name="balance-scale" style={styles.refIcon} />
        <FontAwesome5 name="award" style={styles.refIcon} />
        <FontAwesome5 name="medal" style={styles.refIcon} />
        <FontAwesome5 name="user" style={styles.refIcon} />
        <FontAwesome5 name="user-alt" style={styles.refIcon} /> */
          );
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

  noGroupsText: {
    alignSelf: "center",
    position: "absolute",
    textAlign: "center",
    marginTop: 150,
    marginHorizontal: 20,
    color: GLOBALS.COLOR.LABEL,
  },

  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginVertical: 20,
    marginHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
  },
  completeText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
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
    borderWidth: 1,
  },

  groupTitle3: {
    fontSize: 20,
    color: GLOBALS.COLOR.LABEL,
    flex: 1,
  },

  groupCompleteIcon: {
    fontSize: 26,
    fontWeight: "700",
    alignSelf: "center",
    alignContent: "center",
    paddingHorizontal: 4,
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
