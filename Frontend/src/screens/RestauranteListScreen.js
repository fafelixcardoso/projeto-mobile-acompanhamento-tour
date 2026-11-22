import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StatusBar,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../services/api";
import { mostrarAlerta, confirmar } from "../utils/alerts";
import RestauranteItem from "../components/RestauranteItem";

export default function RestauranteListScreen({ navigation }) {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function showSuccess(message) {
    setSuccessMessage(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  }

  async function carregarRestaurantes(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get("/restaurantes");
      console.log("Restaurantes carregados com sucesso:", response.data?.length);
      setRestaurantes(response.data);
    } catch (error) {
      console.log("Erro ao carregar restaurantes:", error?.message);
      mostrarAlerta("Erro", "Não foi possível carregar os restaurantes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarRestaurantes();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarRestaurantes(false);
  };

  function handleAdd() {
    navigation.navigate("RestauranteForm", {
      mode: "create",
      onSuccess: (msg) => showSuccess(msg),
    });
  }

  function handleEdit(restaurante) {
    navigation.navigate("RestauranteForm", {
      mode: "edit",
      restaurante,
      onSuccess: (msg) => showSuccess(msg),
    });
  }

  async function deletarRestaurante(restaurante) {
    try {
      await api.delete(`/restaurantes/${restaurante.id}`);
      setRestaurantes((prev) => prev.filter((r) => r.id !== restaurante.id));
      showSuccess("Restaurante excluído com sucesso!");
    } catch (error) {
      mostrarAlerta("Erro", "Não foi possível excluir o restaurante.");
    }
  }

  function handleDelete(restaurante) {
    confirmar(
      "Confirmar exclusão",
      `Deseja realmente excluir o restaurante "${restaurante.nome}"?`,
      "Excluir",
      () => deletarRestaurante(restaurante)
    );
  }

  function renderItem({ item }) {
    return (
      <RestauranteItem
        restaurante={item}
        onPress={() => handleEdit(item)}
        onDelete={() => handleDelete(item)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
      <View style={styles.container}>
        <StatusBar style={styles.statusBar} />
        <View style={styles.header}>
          <Text style={styles.title}>Restaurantes</Text>
          <Pressable style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Novo</Text>
          </Pressable>
        </View>

        {successMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color="#1A237E" style={styles.loading} />
        ) : (
          <FlatList
            data={restaurantes}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={
              restaurantes.length === 0 && styles.emptyListContainer
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum restaurante cadastrado.</Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
  },
  statusBar: {
    barStyle: "light-content",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  successBanner: {
    backgroundColor: "#D1FAE5",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  successBannerText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#1A237E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  loading: {
    marginTop: 32,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
  },
});
