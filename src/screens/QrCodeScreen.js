import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const QrCodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [rescan, setRescan] = useState(false);
  const [loading, setLoading] = useState(false);

  // UseEffect works on the screen load
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // UseEffect works on QR Code scanned
  useEffect(() => {
    if (!scanned) return;
    if (global.baseURL == "") return;

    GetUserInfo(global.baseURL);
  }, [scanned]);

  // Retrieve
  const GetUserInfo = async (baseUrl) => {
    try {
      setLoading(true);

      // TODO: need to process screen close (navigate back) to stop fetch
      const controller = new AbortController();
      const signal = controller.signal;

      let response = await fetch(baseUrl, { signal });
      if (response.status != 200) {
        alert("ОШИБКА (2): Не верный формат QR кода. Попробуйте еще раз.");
        setRescan(true);
        return;
      }

      let json = await response.json();
      global.userInfo = json;

      if (baseUrl.includes("Registration")) {
        global.userType = "Registration";
      } else if (global.baseURL.includes("Referee")) {
        global.userType = "Referee";
      }

      navigation.replace("Link");
    } catch (error) {
      console.log(`Catch: ${error}`);
      setRescan(true);
    } finally {
      setLoading(false);
    }
  };

  // Triggered on QR code scanned
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setRescan(false);

    global.baseURL = data;

    // Test URL
    // global.baseURL = "http://192.168.1.6:41837/api/Registration/asdfasfasfsaf";

    // Validate scanned QR code ()
    if (
      !global.baseURL.includes("Registration") &&
      !global.baseURL.includes("Referee")
    ) {
      alert("ОШИБКА (1): Не верный формат QR кода. Попробуйте еще раз.");
      global.baseURL = "";
      setRescan(true);
      return;
    }
  };

  if (hasPermission === null) {
    return <Text>Запрашиваем доступ к камере</Text>;
  }
  if (hasPermission === false) {
    return <Text>Нет доступа к камере</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && rescan && (
        <Pressable
          style={styles.pressable_button}
          onPress={() => {
            setScanned(false);
          }}
        >
          <Text style={styles.btn_text}>Cканировать QR код еще раз</Text>
        </Pressable>
      )}
      {loading && <Text style={styles.btn_text}>Загрузка...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },

  pressable_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 100,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    borderColor: "#428BCA",
    borderWidth: 1,
  },
  btn_text: {
    fontSize: 16,
    color: "#428BCA",
  },
});

export default QrCodeScreen;
