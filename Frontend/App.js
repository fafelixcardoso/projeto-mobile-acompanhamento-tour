import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";

import RestauranteListScreen from "./src/screens/RestauranteListScreen";
import RestauranteFormScreen from "./src/screens/RestauranteFormScreen";

const Stack = createNativeStackNavigator();

function LogoTitle() {
  return (
    <Image
      source={require("./assets/tour-logo.png")}
      style={{ width: 130, height: 32, resizeMode: "contain" }}
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RestauranteList"
        screenOptions={{
          headerStyle: { backgroundColor: "#003575" },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="RestauranteList"
          component={RestauranteListScreen}
          options={{
            headerTitle: () => <LogoTitle />,
          }}
        />
        <Stack.Screen
          name="RestauranteForm"
          component={RestauranteFormScreen}
          options={{
            title: "Restaurante",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
