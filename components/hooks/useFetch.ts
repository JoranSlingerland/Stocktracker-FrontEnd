import { useState } from 'react';
import { useDeepCompareEffect } from 'ahooks';

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
  initialData?: Response;
}

interface UseFetchResult<Response> {
  data: Response | undefined;
  isLoading: boolean;
  isError: boolean;
  refetchData: (params?: { cacheOnly?: boolean }) => void;
  overwriteData: (data: Response) => void;
}

function useFetch<Body, Response>({
  body,
  fetchData,
  enabled = true,
  background = false,
  overwrite = false,
  initialData,
}: UseFetchOptions<Body, Response>) {
  // Constants
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [data, setData] = useState<Response | undefined>(initialData);
  const [cacheOnly, setCacheOnly] = useState(false);

  // Functions
  const refetchData = ({ cacheOnly = false }: { cacheOnly?: boolean } = {}) => {
    setRefetch(true);
    setCacheOnly(cacheOnly);
  };
  const overwriteData = (data: Response) => {
    setData(data);
  };
  const fetchDataAsync = async (abortController: AbortController) => {
    await fetchData({
      body,
      abortController,
      overwrite: overwrite || refetch,
    }).then((data) => {
      if (cacheOnly) return;

      setData(data.response);
      setIsError(data.error);
      setIsLoading(false);
      setRefetch(false);
    });
  };

  // Effects
  useDeepCompareEffect(() => {
    let abortController = new AbortController();

    if (enabled) {
      setIsError(false);
      setIsLoading(background || refetch ? false : true);
      fetchDataAsync(abortController);
    }

    return () => {
      abortController.abort();
    };
  }, [enabled, refetch, body]);

  return { data, isLoading, isError, refetchData, overwriteData };
}

export { useFetch };

export type { UseFetchResult, UseFetchOptions };
