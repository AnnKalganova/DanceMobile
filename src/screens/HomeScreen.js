import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Image, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GLOBALS from "../../Globals";

const HomeScreen = ({ navigation }) => {
  const [showScanButton, setShowScanButton] = useState(true);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const willFocusHandler = navigation.addListener("willFocus", () => {
      if (global.baseURL != "") setShowScanButton(false);
      if (global.baseURL != userType) setUserType(global.baseURL);
    });

    return () => willFocusHandler.remove();
  }, []);

  return (
    <View style={styles.view}>
      <Image style={styles.image} source={require("../../assets/pair.png")} />

      {showScanButton && ScanButton(navigation)}

      {!showScanButton &&
        global.userType === "Registration" &&
        RegistrationButton(navigation)}

      {!showScanButton &&
        global.userType === "Referee" &&
        RefereeButton(navigation)}

      {!showScanButton && ScanLink(navigation)}
    </View>
  );
};

const ScanButton = (navigation) => {
  return (
    <Pressable
      style={styles.pressable_button}
      onPress={() => {
        navigation.navigate("QrCode");
      }}
    >
      <MaterialCommunityIcons name="qrcode-scan" style={styles.btn_icon} />
      <Text style={styles.btn_text}>Сканировать</Text>
    </Pressable>
  );
};

const ScanLink = (navigation) => {
  return (
    <Pressable
      style={styles.pressable_link}
      onPress={() => {
        navigation.navigate("QrCode");
      }}
    >
      <Text style={styles.lnk_text}>Новый QR Code</Text>
    </Pressable>
  );
};

const RegistrationButton = (navigation) => {
  return (
    <Pressable
      style={styles.pressable_button}
      onPress={() => {
        navigation.navigate("RegGroups");
      }}
    >
      <Text style={styles.btn_text}>Вернуться к регистрации</Text>
    </Pressable>
  );
};

const RefereeButton = (navigation) => {
  return (
    <Pressable
      style={styles.pressable_button}
      onPress={() => {
        navigation.navigate("Groups");
      }}
    >
      <Text style={styles.btn_text}>Вернуться к судейству</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: "white",
    height: "100%",
    paddingTop: "25%",
  },
  image: {
    alignSelf: "center",
  },

  pressable_link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 25,
    marginTop: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    borderColor: GLOBALS.COLOR.HEADERBLUE,
    borderWidth: 1,
  },
  lnk_icon: {
    fontSize: 35,
    color: GLOBALS.COLOR.HEADERBLUE,
    paddingRight: 15,
  },
  lnk_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: GLOBALS.COLOR.HEADERBLUE,
  },

  pressable_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 25,
    marginTop: 100,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: GLOBALS.COLOR.HEADERBLUE,
  },
  btn_icon: {
    fontSize: 35,
    color: "white",
    paddingRight: 15,
  },
  btn_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default HomeScreen;
