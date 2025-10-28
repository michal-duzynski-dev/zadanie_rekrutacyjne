import { useEffect, useState } from "react";
import "./App.css";
import { dataService } from "./services/data.service";
import type { DataItem } from "./types/data.types";

function App() {
  const [data, setData] = useState<DataItem>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let userIdFromCookie = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("userId="))
    ?.split("=")[1];

  if (!userIdFromCookie) {
    const newUserId = Math.floor(Math.random() * 100000).toString();
    document.cookie = `userId=${newUserId}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    userIdFromCookie = newUserId;
  }

  const getDataForUserId = async (userId: string) => {
    try {
      setError(null);
      const data = await dataService.getData(userId);
      setData(data);
      if (data.isProcessing) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    getDataForUserId(userIdFromCookie);
  }, []);

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && !loading && <div>{error}</div>}
      {!error && !loading && <div>{data?.data}</div>}
    </>
  );
}

export default App;
