export default function RiskCard({ label, risks }) {
  return (
    <section style={{ border: '1px solid #ddd', padding: 8, marginBottom: 16 }}>
      <h2>{label} 주요 리스크</h2>
      <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
        {risks.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </section>
  )
}
