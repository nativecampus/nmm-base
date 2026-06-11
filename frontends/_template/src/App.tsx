import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState<string>("loading...");

  useEffect(() => {
    fetch("/api/")
      .then((res) => setStatus(`API responded: ${res.status}`))
      .catch(() => setStatus("API unreachable — start the mock server with `npm run mock`"));
  }, []);

  return (
    <main>
      <h1>base-app frontend</h1>
      <p>{status}</p>
    </main>
  );
}
