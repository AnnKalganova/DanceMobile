import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
//import { PairListScreen } from "./src/screens/PairListScreen";
//import { PairInfoScreen } from "./src/screens/PairInfoScreen";
import { InputLinkScreen } from "./src/screens/InputLinkScreen";
import QrCodeScreen from "./src/screens/QrCodeScreen";
// import ExampleScreen from "./src/screens/ExampleScreen";

const navigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },

    QrCode: {
      screen: QrCodeScreen,
      // navigationOptions: {
      //   headerShown: false,
      // },
    },

    Link: InputLinkScreen,
    //  List: PairListScreen,
    //  Info: PairInfoScreen,

    // An example of adding new screen
    // Example: ExampleScreen,
  },
  {
    initialRouteName: "Home",
    // defaultNavigationOptions: {
    //   title: "Регистрация",
    // },
  }
);

export default createAppContainer(navigator);
