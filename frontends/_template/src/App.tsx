import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState<string>("loading...");

  useEffect(() => {
    fetch("/api/")
      .then((res) => setStatus(`API responded: ${res.status}`))
      .catch((err) => {
        const detail = err instanceof Error ? err.message : "unknown error";
        setStatus(`API request failed: ${detail}. If the API isn't running yet, start the mock with \`npm run mock\`.`);
      });
  }, []);

  return (
    <main>
      <h1>base-app frontend</h1>
      <p>{status}</p>
    </main>
  );
}
