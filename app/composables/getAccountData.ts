export const getAccountData = async (program: Program, pubKey: PublicKey) => {
  return await program.account.auction.fetch(pubKey);
};
