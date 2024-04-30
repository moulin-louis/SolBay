export {
  t_nft,
  t_authority,
  t_compressionInfo,
  t_file,
  t_link,
  t_attributes,
  t_metadata,
  t_content,
  t_creator,
  t_ownership,
  t_royalty,
  t_supply,
  t_tokenInfo,
};

declare global {
  interface t_authority {
    address: string;
    scopes: string[];
  }

  interface t_compressionInfo {
    compressed: boolean;
  }

  interface t_file {
    uri: string;
    mime: string;
    cdn_uri: string;
  }

  interface t_link {
    animation_url: string;
    external_url: string;
    image: string;
  }

  interface t_attributes {
    trait_type: string;
    value: unknown;
  }

  interface t_metadata {
    attributes: t_attributes[];
    description: string;
    name: string;
    symbol: string;
    token_standard: string;
  }

  interface t_content {
    $schema: string;
    files: t_file[];
    json_uri: string;
    links: t_link;
    metadata: t_metadata;
  }

  interface t_creator {
    address: string;
    share: number;
    verified: boolean;
  }

  interface t_ownership {
    delegate: unknown;
    delegated: boolean;
    frozen: false;
    owner: string;
    ownership_model: string;
  }

  interface t_royalty {
    basis_points: number;
    locked: boolean;
    percent: number;
    primary_sale_happened: boolean;
    royalty_model: string;
    target: unknown;
  }

  interface t_supply {
    edition_nonce: number;
    print_current_supply: number;
    print_max_supply: number;
  }

  interface t_tokenInfo {
    associated_token_address: string;
    decimals: number;
    supply: number;
    token_program: string;
  }

  interface t_nft {
    authorities: t_authority[]; //array of authority
    burnt: boolean;
    compression: t_compressionInfo;
    content: t_content;
    creators: t_creator[];
    grouping: unknown[];
    id: string;
    interface: string;
    ownership: t_ownership;
    royalty: t_royalty;
    supply: t_supply;
    token_info: t_tokenInfo;
  }
}
