import { useState } from "react";
import {
  View,
  StatusBar,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../services/api";

const PLACEHOLDER_COLOR = "#94A3B8";

function formatarParaBR(dataIso) {
  if (!dataIso) return "";
  const partes = dataIso.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataIso;
}

function aplicarMascaraData(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  if (digitos.length <= 2) {
    return digitos;
  }
  if (digitos.length <= 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  }
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

function converterParaISO(dataBR) {
  if (!dataBR || !dataBR.trim()) return null;
  const partes = dataBR.trim().split("/");
  if (partes.length === 3 && partes[2].length === 4) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return dataBR.trim();
}

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
  const [dataVisita, setDataVisita] = useState(
    restaurante?.dataVisita ? formatarParaBR(restaurante.dataVisita) : ""
  );
  const [comentario, setComentario] = useState(restaurante?.comentario || "");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSave() {
    if (dataVisita.trim()) {
      const partes = dataVisita.trim().split("/");
      if (
        partes.length !== 3 ||
        partes[0].length !== 2 ||
        partes[1].length !== 2 ||
        partes[2].length !== 4
      ) {
        setErrors((prev) => ({
          ...prev,
          dataVisita: "Data deve estar no formato DD/MM/AAAA",
        }));
        return;
      }
    }

    const payload = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      economia: economia.trim() === "" ? null : Number(economia.replace(",", ".")),
      avaliacao: avaliacao.trim() === "" ? null : Number(avaliacao.replace(",", ".")),
      dataVisita: converterParaISO(dataVisita),
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
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StatusBar style={styles.statusBar} />

          <View style={styles.card}>
            <Text style={styles.title}>
              {mode === "edit" ? "Editar Restaurante" : "Novo Restaurante"}
            </Text>

            {errors.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            )}

            <Text style={styles.label}>Nome*</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={(text) => {
                setNome(text);
                setErrors((prev) => ({ ...prev, nome: null }));
              }}
              placeholder="Ex: Outback"
              placeholderTextColor={PLACEHOLDER_COLOR}
              maxLength={150}
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

            <Text style={styles.label}>Endereço*</Text>
            <TextInput
              style={styles.input}
              value={endereco}
              onChangeText={(text) => {
                setEndereco(text);
                setErrors((prev) => ({ ...prev, endereco: null }));
              }}
              placeholder="Ex: Av. Higienópolis, 1000"
              placeholderTextColor={PLACEHOLDER_COLOR}
              maxLength={200}
            />
            {errors.endereco && <Text style={styles.errorText}>{errors.endereco}</Text>}

            <Text style={styles.label}>Economia (R$)*</Text>
            <TextInput
              style={styles.input}
              value={economia}
              onChangeText={(text) => {
                setEconomia(text);
                setErrors((prev) => ({ ...prev, economia: null }));
              }}
              placeholder="Ex: 50.00"
              placeholderTextColor={PLACEHOLDER_COLOR}
              keyboardType="decimal-pad"
            />
            {errors.economia && <Text style={styles.errorText}>{errors.economia}</Text>}

            <Text style={styles.label}>Avaliação (0 a 5)*</Text>
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
                setDataVisita(aplicarMascaraData(text));
                setErrors((prev) => ({ ...prev, dataVisita: null }));
              }}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={PLACEHOLDER_COLOR}
              keyboardType="numeric"
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
              placeholder="Observações sobre o restaurante"
              placeholderTextColor={PLACEHOLDER_COLOR}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
            {errors.comentario && <Text style={styles.errorText}>{errors.comentario}</Text>}

            <Text style={styles.hint}>* Campos obrigatórios</Text>

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.saveButton, saving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.buttonText}>
                  {saving
                    ? "Salvando..."
                    : mode === "edit"
                    ? "Atualizar"
                    : "Cadastrar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFEE6",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 60,
  },
  statusBar: {
    barStyle: "light-content",
  },
  card: {
    backgroundColor: "#003575",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#FFF",
  },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#F87171",
  },
  errorBannerText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#FFF",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1E293B",
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  hint: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#DC3545",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: "#589F2E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
