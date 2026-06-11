import { useEffect, useState } from "react";
import { NmmProvider, Card, StatusPill } from "nmm-ui";

type Kind = "in-progress" | "completed" | "cancelled";

export default function App() {
  const [status, setStatus] = useState<string>("loading...");
  const [kind, setKind] = useState<Kind>("in-progress");

  useEffect(() => {
    fetch("/api/")
      .then((res) => {
        setStatus(`API responded: ${res.status}`);
        setKind("completed");
      })
      .catch((err) => {
        const detail = err instanceof Error ? err.message : "unknown error";
        setStatus(`API request failed: ${detail}. If the API isn't running yet, start the mock with \`npm run mock\`.`);
        setKind("cancelled");
      });
  }, []);

  return (
    <NmmProvider>
      <Card pad={24}>
        <h1>base-app frontend</h1>
        <StatusPill status={kind} />
        <p>{status}</p>
      </Card>
    </NmmProvider>
  );
}
