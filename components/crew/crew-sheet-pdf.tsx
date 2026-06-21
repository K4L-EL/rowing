import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 4, color: "#0d9488" },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 20 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 4, color: "#292524" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  label: { color: "#78716c", fontSize: 10 },
  value: { fontSize: 10, color: "#292524" },
  table: { marginTop: 8 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e7e5e4", paddingBottom: 4, marginBottom: 4 },
  tableRow: { flexDirection: "row", paddingVertical: 2 },
  colPosition: { width: "40%" },
  colName: { width: "60%" },
  cellHeader: { fontSize: 9, fontWeight: "bold", color: "#78716c" },
  cell: { fontSize: 10, color: "#292524" },
  note: { fontSize: 10, color: "#78716c", marginTop: 8, fontStyle: "italic" },
});

export type CrewSheetPdfData = {
  name: string;
  date: string;
  session: string;
  type: string;
  squad?: string;
  boatType?: string;
  positions?: Record<string, string>[];
  blades?: string[];
  note?: string;
};

function parsePositions(positions: unknown): Record<string, string>[] {
  if (Array.isArray(positions)) return positions;
  if (typeof positions === "string") {
    try {
      return JSON.parse(positions);
    } catch {
      return [];
    }
  }
  return [];
}

export function CrewSheetPdf({ document }: { document: CrewSheetPdfData }) {
  const posList = parsePositions(document.positions);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>RowSafe — Crew Sheet</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session details</Text>
          <View style={styles.row}><Text style={styles.label}>Name</Text><Text style={styles.value}>{document.name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Date</Text><Text style={styles.value}>{document.date}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Session</Text><Text style={styles.value}>{document.session}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Type</Text><Text style={styles.value}>{document.type}</Text></View>
          {document.squad && <View style={styles.row}><Text style={styles.label}>Squad</Text><Text style={styles.value}>{document.squad}</Text></View>}
          {document.boatType && <View style={styles.row}><Text style={styles.label}>Boat</Text><Text style={styles.value}>{document.boatType}</Text></View>}
        </View>

        {posList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crew positions</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.cellHeader, styles.colPosition]}>Position</Text>
                <Text style={[styles.cellHeader, styles.colName]}>Name</Text>
              </View>
              {posList.map((pos, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.colPosition]}>{pos.position ?? i + 1}</Text>
                  <Text style={[styles.cell, styles.colName]}>{pos.name ?? ""}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {document.blades && document.blades.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blades</Text>
            <Text style={styles.value}>{document.blades.join(", ")}</Text>
          </View>
        )}

        {document.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.note}>{document.note}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
