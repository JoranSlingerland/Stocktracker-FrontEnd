import { useEffect, useState } from 'react';

function useFetch<Body, Response>({
  body,
  overWrite,
  fetchData,
  enabled = true,
  background = false,
}: {
  body: Body;
  overWrite?: boolean;
  fetchData: ({
    body,
    abortController,
    overWrite,
  }: {
    body: Body;
    abortController: AbortController;
    overWrite?: boolean;
  }) => Promise<{ response: Response; error: boolean }>;
  enabled?: boolean;
  background?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [data, setData] = useState<Response>();

  const refetchData = () => {
    setRefetch(true);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchDataAsync = async () => {
      setIsError(false);
      if (!background || !refetch) {
        setIsLoading(true);
      }
      setRefetch(false);

      await fetchData({ body, abortController, overWrite }).then((data) => {
        setData(data.response);
        setIsError(data.error);
        setIsLoading(false);
      });
    };

    if (enabled) {
      fetchDataAsync();
    }

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, refetch]);

  return { data, isLoading, isError, refetchData };
}

export default useFetch;
