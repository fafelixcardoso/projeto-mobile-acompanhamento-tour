import { useState } from "react";
import {
  View,
  StatusBar,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../services/api";

const PLACEHOLDER_COLOR = "#9CA3AF";

export default function RestauranteFormScreen({ route, navigation }) {
  const { mode, restaurante, onSuccess } = route.params || {};

  const [nome, setNome] = useState(restaurante?.nome || "");
  const [endereco, setEndereco] = useState(restaurante?.endereco || "");
  const [economia, setEconomia] = useState(
    restaurante?.economia != null ? String(restaurante.economia) : ""
  );
  const [avaliacao, setAvaliacao] = useState(
    restaurante?.avaliacao != null ? String(restaurante.avaliacao) : ""
  );
  const [dataVisita, setDataVisita] = useState(restaurante?.dataVisita || "");
  const [comentario, setComentario] = useState(restaurante?.comentario || "");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSave() {
    const payload = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      economia: economia.trim() === "" ? null : Number(economia.replace(",", ".")),
      avaliacao: avaliacao.trim() === "" ? null : Number(avaliacao.replace(",", ".")),
      dataVisita: dataVisita.trim() === "" ? null : dataVisita.trim(),
      comentario: comentario.trim() === "" ? null : comentario.trim(),
    };

    try {
      setSaving(true);

      if (mode === "edit" && restaurante?.id) {
        await api.put(`/restaurantes/${restaurante.id}`, payload);
        onSuccess?.("Restaurante atualizado com sucesso!");
      } else {
        await api.post("/restaurantes", payload);
        onSuccess?.("Restaurante cadastrado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Não foi possível salvar o restaurante." });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StatusBar style={styles.statusBar} />
        <Text style={styles.title}>
          {mode === "edit" ? "Editar Restaurante" : "Novo Restaurante"}
        </Text>

        {errors.general && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errors.general}</Text>
          </View>
        )}

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setErrors((prev) => ({ ...prev, nome: null }));
          }}
          placeholder="Nome do restaurante"
          placeholderTextColor={PLACEHOLDER_COLOR}
          maxLength={150}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          value={endereco}
          onChangeText={(text) => {
            setEndereco(text);
            setErrors((prev) => ({ ...prev, endereco: null }));
          }}
          placeholder="Endereço do restaurante"
          placeholderTextColor={PLACEHOLDER_COLOR}
          maxLength={200}
        />
        {errors.endereco && <Text style={styles.errorText}>{errors.endereco}</Text>}

        <Text style={styles.label}>Economia (R$)</Text>
        <TextInput
          style={styles.input}
          value={economia}
          onChangeText={(text) => {
            setEconomia(text);
            setErrors((prev) => ({ ...prev, economia: null }));
          }}
          placeholder="Ex: 25.50"
          placeholderTextColor={PLACEHOLDER_COLOR}
          keyboardType="decimal-pad"
        />
        {errors.economia && <Text style={styles.errorText}>{errors.economia}</Text>}

        <Text style={styles.label}>Avaliação (0 a 5)</Text>
        <TextInput
          style={styles.input}
          value={avaliacao}
          onChangeText={(text) => {
            setAvaliacao(text);
            setErrors((prev) => ({ ...prev, avaliacao: null }));
          }}
          placeholder="Ex: 4.8"
          placeholderTextColor={PLACEHOLDER_COLOR}
          keyboardType="decimal-pad"
        />
        {errors.avaliacao && <Text style={styles.errorText}>{errors.avaliacao}</Text>}

        <Text style={styles.label}>Data da Visita</Text>
        <TextInput
          style={styles.input}
          value={dataVisita}
          onChangeText={(text) => {
            setDataVisita(text);
            setErrors((prev) => ({ ...prev, dataVisita: null }));
          }}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={PLACEHOLDER_COLOR}
          maxLength={10}
        />
        {errors.dataVisita && <Text style={styles.errorText}>{errors.dataVisita}</Text>}

        <Text style={styles.label}>Comentário</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={comentario}
          onChangeText={(text) => {
            setComentario(text);
            setErrors((prev) => ({ ...prev, comentario: null }));
          }}
          placeholder="Comentário sobre a visita (opcional)"
          placeholderTextColor={PLACEHOLDER_COLOR}
          multiline
          numberOfLines={3}
          maxLength={500}
        />
        {errors.comentario && <Text style={styles.errorText}>{errors.comentario}</Text>}

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Salvando..." : "Salvar"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  statusBar: {
    barStyle: "light-content",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
    color: "#111827",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorBannerText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "500",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#374151",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    fontSize: 15,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#1A237E",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
