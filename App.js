import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "./src/screens/HomeScreen";
import QrCodeScreen from "./src/screens/QrCodeScreen";

import RegGroupsScreen from "./src/screens/RegGroupsScreen";
import RegPairsScreen from "./src/screens/RegPairsScreen";
import RegEditPairScreen from "./src/screens/RegEditPairScreen";

import RefGroupsScreen from "./src/screens/RefGroupsScreen";
import RefPairsScreen from "./src/screens/RefPairsScreen";

import GLOBALS from "./Globals";

// import ExampleScreen from "./src/screens/ExampleScreen";

// Holds Base URL and User Type that will be used on other screens
// Should be filled in on QrCodeScreen
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
        title: "Оценка пар",
      },
    },

    RegEditPair: {
      screen: RegEditPairScreen,
      navigationOptions: {
        title: "Редактирование пары",
      },
    },

    RefGroups: {
      screen: RefGroupsScreen,
      navigationOptions: {
        title: "Расписание турнира",
      },
    },

    RefPairs: {
      screen: RefPairsScreen,
      navigationOptions: {
        title: "Судейство",
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

        shadowColor: "#AAA",
        shadowOffset: {
          width: 2,
          height: 4,
        },
        shadowRadius: 5,
        shadowOpacity: 0.8,
        elevation: 2,
      },
      headerTintColor: "white",
    },
  }
);

export default createAppContainer(navigator);
