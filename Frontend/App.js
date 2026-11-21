import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RestauranteListScreen from "./src/screens/RestauranteListScreen";
import RestauranteFormScreen from "./src/screens/RestauranteFormScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RestauranteList"
        screenOptions={{
          headerStyle: { backgroundColor: "#1A237E" },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen
          name="RestauranteList"
          component={RestauranteListScreen}
          options={{ title: "Acompanhamento Tour" }}
        />
        <Stack.Screen
          name="RestauranteForm"
          component={RestauranteFormScreen}
          options={{ title: "Restaurante" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
