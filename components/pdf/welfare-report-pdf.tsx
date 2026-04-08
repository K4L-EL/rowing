import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { WelfarePayload } from "@/lib/validations/welfare";
import { HELPFUL_RESOURCES } from "@/lib/constants/helpful-resources";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  h1: { fontSize: 18, marginBottom: 12, color: "#0369a1" },
  h2: { fontSize: 12, marginTop: 10, marginBottom: 6, color: "#0c4a6e" },
  row: { marginBottom: 4 },
  label: { fontWeight: "bold" },
  section: { marginBottom: 12 },
  listItem: { marginBottom: 3, paddingLeft: 8 },
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text>
        <Text style={styles.label}>{label}: </Text>
        {value}
      </Text>
    </View>
  );
}

export function WelfareReportPdfDocument({
  payload,
  referenceId,
}: {
  payload: WelfarePayload;
  referenceId: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Welfare report</Text>
        <Text style={styles.row}>Reference: {referenceId}</Text>
        <View style={styles.section}>
          <Text style={styles.h2}>Basic details</Text>
          <Row label="Reporter anonymous" value={payload.anonymousReporter ? "Yes" : "No"} />
          {!payload.anonymousReporter && payload.reporterName ? (
            <Row label="Reporter name" value={payload.reporterName} />
          ) : null}
          <Row label="Reporter email" value={payload.reporterEmail} />
          <Row label="Subject name" value={payload.subjectName} />
          <Row label="Subject age" value={payload.subjectAge} />
          <Row label="Subject role" value={payload.subjectRole} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Nature of concern</Text>
          <Row label="Type" value={payload.concernType} />
          <Row label="Description" value={payload.factualDescription} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Time and location</Text>
          <Row label="When" value={payload.whenDescription} />
          <Row label="Where" value={payload.whereDescription} />
          <Row label="Ongoing" value={payload.ongoingOrOneOff} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Impact / risk</Text>
          <Row label="Impact" value={payload.impactDescription} />
          <Row label="Immediate risk" value={payload.immediateRisk ? "Yes" : "No"} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Consent</Text>
          <Row label="Consent to share" value={payload.consentToShare ? "Yes" : "No"} />
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Helpful contacts & resources</Text>
        {HELPFUL_RESOURCES.map((r, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.label}>{r.title}</Text>
            {r.phone ? <Text> {r.phone}</Text> : null}
            {r.description ? <Text>{r.description}</Text> : null}
            {r.url ? <Text>{r.url}</Text> : null}
          </View>
        ))}
      </Page>
    </Document>
  );
}
