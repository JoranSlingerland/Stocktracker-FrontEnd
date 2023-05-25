import { useEffect, useState } from 'react';

interface UseFetchOptions<Body, Response> {
  body: Body;
  fetchData: (params: {
    body: Body;
    abortController: AbortController;
    overwrite?: boolean;
  }) => Promise<{ response: Response; error: boolean }>;
  enabled?: boolean;
  background?: boolean;
  overwrite?: boolean;
}

function useFetch<Body, Response>({
  body,
  fetchData,
  enabled = true,
  background = false,
  overwrite = false,
}: UseFetchOptions<Body, Response>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [data, setData] = useState<Response>();

  const refetchData = () => {
    setRefetch(true);
  };
  const fetchDataAsync = async (abortController: AbortController) => {
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

  useEffect(() => {
    let abortController = new AbortController();

    if (enabled) {
      setIsError(false);
      setIsLoading(background || refetch ? false : true);
      fetchDataAsync(abortController);
    }

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, refetch]);

  return { data, isLoading, isError, refetchData };
}

export default useFetch;
