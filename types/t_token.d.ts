export {t_token};

declare global {
  interface t_token {
    address: string | undefined; //on chain address of the token
    chainId: number; //chain id of the token
    decimals: number; //decimals, lowest unit of the token
    name: string; //full name of the token
    symbol: string; //ticker
    logoURI: string; //url to the logo of the token
    tags: string[]; //array of tag
    extensions: object; // extension of the token
  }
}
