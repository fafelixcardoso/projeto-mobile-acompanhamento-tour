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
          Nota: <Text style={styles.infoNota}>{restaurante.avaliacao} / 5</Text>
        </Text>
        <Text style={styles.itemInfo}>
          Economia:{" "}
          <Text style={styles.infoEconomia}>
            R$ {restaurante.economia != null ? Number(restaurante.economia).toFixed(2) : "0.00"}
          </Text>
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
    borderColor: "#E2E8F0",
    borderLeftWidth: 4,
    borderLeftColor: "#003575",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNome: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#003575",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemEndereco: {
    color: "#64748B",
    marginTop: 4,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 6,
  },
  itemInfo: {
    fontSize: 13,
    color: "#475569",
  },
  infoNota: {
    fontWeight: "bold",
    color: "#003575",
  },
  infoEconomia: {
    fontWeight: "bold",
    color: "#589F2E",
  },
  itemData: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 6,
  },
  itemComentario: {
    color: "#334155",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 6,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#0060AD",
    borderRadius: 4,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#DC3545",
    borderRadius: 4,
  },
  editText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});
