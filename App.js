import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
//import { PairListScreen } from "./src/screens/PairListScreen";
//import { PairInfoScreen } from "./src/screens/PairInfoScreen";

import QrCodeScreen from "./src/screens/QrCodeScreen";
import RegGroupsScreen from "./src/screens/RegGroupsScreen";
import RegPairsScreen from "./src/screens/RegPairsScreen";
import RegEditPairScreen from "./src/screens/RegEditPairScreen";

// import ExampleScreen from "./src/screens/ExampleScreen";

// Holds Base URL and User Type that will be used on other screens
// Should be filled in on QrCodeScreen

import GLOBALS from "./Globals";

global.baseURL = "";
global.userType = "";
global.userInfo = null;

const navigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
        title: "Главная",
      },
    },

    QrCode: {
      screen: QrCodeScreen,
      navigationOptions: {
        title: "Сканирование",
      },
    },

    RegGroups: {
      screen: RegGroupsScreen,
      navigationOptions: {
        title: "Список групп",
      },
    },

    RegPairs: {
      screen: RegPairsScreen,
      navigationOptions: {
        title: "Список пар",
        // title: ({ route }) => ({"asdfadf";}),
      },
    },

    RegEditPair: {
      screen: RegEditPairScreen,
      navigationOptions: {
        title: "Редактирование пары",
      },
    },

    // An example of adding new screen
    // Example: ExampleScreen,
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: GLOBALS.COLOR.HEADERBLUE,
      },
      headerTintColor: "white",
    },
  }
);

export default createAppContainer(navigator);
