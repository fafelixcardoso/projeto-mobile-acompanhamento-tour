import { View, Text, StyleSheet, Pressable } from "react-native";

export default function RestauranteItem({ restaurante, onPress, onDelete }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemNome}>{restaurante.nome}</Text>

        <View style={styles.buttonsContainer}>
          <Pressable onPress={onPress} style={styles.editButton}>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Excluir</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.itemEndereco}>{restaurante.endereco}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.itemInfo}>
          Nota: <Text style={styles.infoDestaque}>{restaurante.avaliacao} / 5</Text>
        </Text>
        <Text style={styles.itemInfo}>
          Economia: <Text style={styles.infoDestaque}>R$ {restaurante.economia != null ? Number(restaurante.economia).toFixed(2) : "0.00"}</Text>
        </Text>
      </View>

      {restaurante.dataVisita ? (
        <Text style={styles.itemData}>Visita em: {restaurante.dataVisita}</Text>
      ) : null}

      {restaurante.comentario ? (
        <Text style={styles.itemComentario}>"{restaurante.comentario}"</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemEndereco: {
    color: "#4B5563",
    marginTop: 4,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    backgroundColor: "#F9FAFB",
    padding: 6,
    borderRadius: 6,
  },
  itemInfo: {
    fontSize: 13,
    color: "#4B5563",
  },
  infoDestaque: {
    fontWeight: "600",
    color: "#111827",
  },
  itemData: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 6,
  },
  itemComentario: {
    color: "#374151",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 6,
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EFF6FF",
    borderRadius: 4,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FEF2F2",
    borderRadius: 4,
  },
  editText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 13,
  },
  deleteText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
  },
});
