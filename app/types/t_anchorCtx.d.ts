export {t_anchorCtx};

declare global {
  interface t_anchorCtx {
    wallet: Ref<AnchorWallet | any>;
    connection: Connection;
    provider: ComputedRef<AnchorProvider>;
    program: ComputedRef<Program>;
  }
}