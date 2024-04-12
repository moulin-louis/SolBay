import {useState, useEffect, useMemo} from "react";

export interface t_token {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  tags: string[];
  extensions: object,
}

export const useFetchTokens = () => {
  const [tokens, setTokens] = useState<t_token[]>([]); // Initialize state with cached data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const cachedTokens = useMemo(() => tokens, [tokens]);


  useEffect(() => {
    if (!cachedTokens.length) { // Check if tokens are already cached
      setIsLoading(true);
      fetch('https://token.jup.ag/all')
        .then(response => response.json())
        .then(data => {
          setTokens(data); // Update local state with the fetched data
        })
        .catch(e => {
          console.error("Failed to fetch tokens:", e);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [cachedTokens]);

  return {tokens: tokens, isLoading: isLoading};
};