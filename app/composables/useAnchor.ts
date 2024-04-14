import {ComputedRef} from "vue";
import {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Connection, clusterApiUrl, PublicKey} from '@solana/web3.js'
import idl from '~/idl/auction.json'
import {useWallet} from "solana-wallets-vue";

export const useAnchor = (): t_anchorCtx => {
  const config = useRuntimeConfig();
  console.log("program = id =", config.public.PROGRAM_ID);
  const programID: PublicKey = new PublicKey(config.public.PROGRAM_ID);
  const wallet: WalletStore = useWallet();
  const connection: Connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const provider: ComputedRef<AnchorProvider> = computed(() => new AnchorProvider(connection, wallet.value, {
    preflightCommitment: 'processed',
    commitment: "confirmed"
  }));
  const program = computed(() => new Program(idl as any, programID, provider.value));
  return {
    wallet,
    connection,
    provider,
    program,
  }
}