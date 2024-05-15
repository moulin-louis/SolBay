import * as anchor from "@coral-xyz/anchor";
import { Program, BN, AnchorProvider } from "@coral-xyz/anchor";
import { Auction } from "../target/types/auction";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("auction", () => {
  // Configure the client to use the local cluster.
  const provider: AnchorProvider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program: Program<Auction> = anchor.workspace
    .Auction as Program<Auction>;
  const tmpAccount: Keypair = new Keypair();
  const [userAuctionPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("auction"), tmpAccount.publicKey.toBuffer()],
    program.programId,
  );
  provider.connection
    .requestAirdrop(tmpAccount.publicKey, 10e9)
    .then(() => console.log(""));

  it("Create Auction", async () => {
    // Add your test here.
    await program.methods
      .initialize({
        name: "NB",
        minPrice: new BN(150),
        idAuction: 42,
      })
      .accounts({
        user: tmpAccount.publicKey,
        newAuction: userAuctionPDA,
      })
      .signers([tmpAccount])
      .rpc({
        skipPreflight: true,
      });
  });
  it("First bidding", async () => {
    const bide_info = {
      price: new BN(100),
      bidder: tmpAccount.publicKey,
    };
    await program.methods
      .bide(bide_info)
      .accounts({
        user: tmpAccount.publicKey,
        auction: userAuctionPDA,
      })
      .signers([tmpAccount])
      .rpc();
  });
  it("Too low bidding", async () => {
    const bide_info = {
      price: new BN(50),
      bidder: tmpAccount.publicKey,
    };
    try {
      await program.methods
        .bide(bide_info)
        .accounts({
          user: tmpAccount.publicKey,
          auction: userAuctionPDA,
        })
        .signers([tmpAccount])
        .rpc();
    } catch (e) {
      //suppose to throw an error
    }
  });
  it("Second bidding", async () => {
    const tmpAccount = Keypair.generate();
    const bide_info = {
      price: new BN(150),
      bidder: tmpAccount.publicKey,
    };
    await program.methods
      .bide(bide_info)
      .accounts({
        user: tmpAccount.publicKey,
        auction: userAuctionPDA,
      })
      .signers([tmpAccount])
      .rpc();
  });
  it("third bidding", async () => {
    const bide_info = {
      price: new BN(300),
      bidder: tmpAccount.publicKey,
    };
    await program.methods
      .bide(bide_info)
      .accounts({
        user: tmpAccount.publicKey,
        auction: userAuctionPDA,
      })
      .signers([tmpAccount])
      .rpc();
  });
  it("ending the auction", async () => {
    await program.methods
      .endAuction()
      .accounts({
        auction: userAuctionPDA,
      })
      .rpc();
  });
  it("Closing Account", async () => {
    await program.methods
      .closeAccount()
      .accounts({
        auctionAccount: userAuctionPDA,
        receiver: tmpAccount.publicKey,
      })
      .signers([tmpAccount])
      .rpc();
  });
});
