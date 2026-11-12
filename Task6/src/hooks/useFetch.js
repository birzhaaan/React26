import { useState, useEffect } from "react";

export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setStatus("loading");
    setError(null);

    fetcher()
      .then((result) => {
        if (!ignore) {
          setData(result);
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setStatus("error");
        }
      });

    return () => {
      ignore = true;
    };
  }, deps);

  return { data, status, error };
}