export {t_token};

declare global {
  interface t_token {
    address: string;
    chainId: number;
    decimals: number;
    name: string;
    symbol: string;
    logoURI: string;
    tags: string[];
    extensions: object;
  }
}
