import { useEffect, useState } from 'react';

function useFetch<Body, Response>({
  body,
  fetchData,
  enabled = true,
  background = false,
  overwrite = false,
}: {
  body: Body;
  fetchData: (params: {
    body: Body;
    abortController: AbortController;
    overwrite?: boolean;
  }) => Promise<{ response: Response; error: boolean }>;
  enabled?: boolean;
  background?: boolean;
  overwrite?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
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

      await fetchData({
        body,
        abortController,
        overwrite: overwrite || refetch,
      }).then((data) => {
        setData(data.response);
        setIsError(data.error);
        setIsLoading(false);
        setRefetch(false);
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
