import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StatusBar,
  Text,
  TextInput,
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

  const [termo, setTermo] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("nome");
  const [direcao, setDirecao] = useState("ASC");

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

      const params = {};
      if (termo.trim()) params.termo = termo.trim();
      if (ordenarPor) params.ordenarPor = ordenarPor;
      if (direcao) params.direcao = direcao;

      const response = await api.get("/restaurantes", { params });
      setRestaurantes(response.data);
    } catch (error) {
      mostrarAlerta("Erro", "Não foi possível carregar os restaurantes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarRestaurantes();
    }, [termo, ordenarPor, direcao])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarRestaurantes(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [termo, ordenarPor, direcao]);

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

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar restaurante por nome..."
          placeholderTextColor="#9CA3AF"
          value={termo}
          onChangeText={setTermo}
        />

        <View style={styles.sortContainer}>
          <View style={styles.sortChips}>
            <Pressable
              style={[styles.chip, ordenarPor === "nome" && styles.chipActive]}
              onPress={() => setOrdenarPor("nome")}
            >
              <Text style={[styles.chipText, ordenarPor === "nome" && styles.chipTextActive]}>
                Nome
              </Text>
            </Pressable>

            <Pressable
              style={[styles.chip, ordenarPor === "avaliacao" && styles.chipActive]}
              onPress={() => setOrdenarPor("avaliacao")}
            >
              <Text style={[styles.chipText, ordenarPor === "avaliacao" && styles.chipTextActive]}>
                Nota
              </Text>
            </Pressable>

            <Pressable
              style={[styles.chip, ordenarPor === "economia" && styles.chipActive]}
              onPress={() => setOrdenarPor("economia")}
            >
              <Text style={[styles.chipText, ordenarPor === "economia" && styles.chipTextActive]}>
                Economia
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.directionButton}
            onPress={() => setDirecao((prev) => (prev === "ASC" ? "DESC" : "ASC"))}
          >
            <Text style={styles.directionButtonText}>
              {direcao === "ASC" ? "↑ Crescente" : "↓ Decrescente"}
            </Text>
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
              <Text style={styles.emptyText}>Nenhum restaurante encontrado.</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
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
  searchInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    fontSize: 14,
    marginBottom: 10,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sortChips: {
    flexDirection: "row",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: "#1A237E",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  chipTextActive: {
    color: "#FFF",
  },
  directionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  directionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  successBanner: {
    backgroundColor: "#D1FAE5",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  successBannerText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "500",
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
    marginTop: 20,
  },
});
