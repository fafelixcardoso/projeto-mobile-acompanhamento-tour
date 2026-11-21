import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RestauranteFormScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Formulário de Restaurante</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
