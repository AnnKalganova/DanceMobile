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
import { Feather } from "@expo/vector-icons";
import GLOBALS from "../../Globals";

const RegGroupsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [canComplete, setCanComplete] = useState(false);

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
          setCanComplete(checkGroupsCompletion(result));
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

  const checkGroupsCompletion = (result) => {
    let allCompleted = true;

    let i = 0;
    for (i = 0; i < result.length; i++) {
      if (result[i].completedState == false) {
        allCompleted = false;
        break;
      }
    }

    return allCompleted;
  };

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
        <Feather
          name="check"
          style={[
            styles.groupCompleteIcon,
            {
              color: group.completedState ? "green" : "white",
            },
          ]}
        />
      </View>
    </Pressable>
  );

  const renderItem = ({ item }) => <Item group={item} />;

  handleRefresh = () => {
    getGroups();
  };

  const onCompletePress = () => {
    if (!canComplete) {
      // Alert.alert("", "Не всем парам присвоены номера");
      Alert.alert(
        "",
        "Для завершение регистрации необходимо всем парам присвоить номера"
      );
      return;
    }

    Alert.alert("Внимание!", "Вы действительно хотите завершить регистрацию?", [
      {
        text: "Да",
        onPress: () => {
          completeRegistration();
        },
      },
      {
        text: "Нет",
      },
    ]);
  };

  const completeRegistration = () => {
    const requestOptions = {
      method: "GET",
    };

    fetch(global.baseURL + "/complete", requestOptions)
      .then(
        (result) => {
          if (result.status == 200) {
            global.baseURL = "";
            global.userType = "";
            global.userInfo = null;
            navigation.goBack();
          } else {
            Alert.alert("Ошибка!", "Код ошибки: " + result.status, [
              {
                text: "OK",
              },
            ]);
          }
        },
        (error) => {
          console.log(
            "Fetch ERROR:",
            "Response Body -> " + JSON.stringify(error)
          );
        }
      )
      .catch((e) => console.log(e));
  };

  const completeButton = () => {
    return (
      <Pressable
        // style={styles.completeButton}
        style={[
          styles.completeButton,
          {
            backgroundColor: canComplete
              ? GLOBALS.COLOR.HEADERBLUE
              : GLOBALS.COLOR.DISABLED,
          },
        ]}
        // disabled={!canComplete}
        onPress={() => {
          onCompletePress();
        }}
      >
        <Text style={styles.completeText}>Завершить регистрацию</Text>
      </Pressable>
    );
  };

  const noGroups = () => {
    return (
      <Text style={styles.noGroupsText}>
        В данный момент нет групп для проведения регистрации
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.userName}>
          {global.userInfo.lastName} {global.userInfo.firstName}
        </Text>
        <Text style={styles.userRole}>(Организатор)</Text>
      </View>

      <View style={styles.bottomView}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {data.length > 0 ? completeButton() : noGroups()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBALS.COLOR.LIGHTGREY,
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
  groupTitle: {
    fontSize: 20,
    color: GLOBALS.COLOR.BLUE,
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

export default RegGroupsScreen;
