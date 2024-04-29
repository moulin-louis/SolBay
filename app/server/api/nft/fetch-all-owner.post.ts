export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  checkMissingParams(body, ['ownerAddress']);
  const config = useRuntimeConfig();
  const res = await fetch(`https://devnet.helius-rpc.com/?api-key=${config.HELIUS_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: body.ownerAddress,
        page: 1,
        limit: 1000,
      },
    }),
  });
  const {result} = await res.json();
  return result.items.filter((item: unknown) => {
    //filter out any compressed NFT
    return item.compression.compressed === false;
  });
});
