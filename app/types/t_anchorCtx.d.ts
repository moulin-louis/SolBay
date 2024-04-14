export {t_anchorCtx};

declare global {
  type t_anchorCtx = {
    wallet: Ref<AnchorWallet | any>;
    connection: Connection;
    provider: ComputedRef<AnchorProvider>;
    program: ComputedRef<Program>;
  };
}
