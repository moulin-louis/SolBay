import './App.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import {FC, useEffect, useMemo} from 'react'
import {Routes, Route, Link} from "react-router-dom";
import {Box, Flex, Link as ChakraLink, ChakraProvider} from '@chakra-ui/react';
import {ConnectionProvider, useConnection, useWallet, WalletProvider} from '@solana/wallet-adapter-react';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import {clusterApiUrl} from '@solana/web3.js';
import {Home} from "../Home/Home.tsx";
import {BrowseAuction} from "../BrowseAuction/BrowseAuction.tsx";
import {CreateAuction} from "../CreateAuction/CreateAuction.tsx";
import {Profile} from "../Profile/Profile.tsx";
import solbayLogo from '../assets/solbay_logo.png'
import {getProvider, setProvider} from "@coral-xyz/anchor";
import {AnchorProvider, Wallet as WalletAnchor} from "@coral-xyz/anchor";

function Navigate() {
  const wallet_ctx = useWallet();
  const connectionContextState = useConnection();
  const anchor_provider = useMemo(() => {
    if (!wallet_ctx.publicKey) return;
    const anchorWallet: WalletAnchor = {
      publicKey: wallet_ctx.publicKey,
      signTransaction: wallet_ctx.signTransaction,
      signAllTransactions: wallet_ctx.signAllTransactions,
    };
    return new AnchorProvider(connectionContextState.connection, anchorWallet, {});
  }, [connectionContextState.connection, wallet_ctx.publicKey, wallet_ctx.signAllTransactions, wallet_ctx.signTransaction]);
  useEffect(() => {
    setProvider(anchor_provider as AnchorProvider); //change global anchor provider
  }, [anchor_provider]);
  if (anchor_provider === undefined) {
    return <>Loading</>;
  }
  return (
    <>
      <Link to="/">
        <img src={solbayLogo}
             style={{height: '30px', position: 'absolute', top: '0', left: '0', zIndex: '1', marginTop: '14px'}}
             alt="SolBayLogo"></img>
      </Link>
      <Flex bg='rgb(10, 6, 44)' color="white" justifyContent="space-around" p={4}
            style={{position: 'absolute', top: '0', left: '0', width: '91%', height: '60px'}}>
        <Box>
          <Link to="/" as={ChakraLink} style={{marginRight: '15px'}}>Home</Link>
          <Link to="/browse_auction" as={ChakraLink} style={{marginRight: '15px'}}>Browse Auction</Link>
          <Link to="/create_auction" as={ChakraLink}>Create Auction</Link>
          <Link to="/profile" as={ChakraLink} style={{marginRight: '15px', marginLeft: '15px'}}>Profile</Link>
        </Box>
      </Flex>
      <Routes>
        <Route path="*" element={<Home/>}/> // This is the default route, it will redirect to "/home
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/browse_auction" element={<BrowseAuction/>}/>
        <Route path="/create_auction" element={<CreateAuction/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </>
  );
}

export const Wallet: FC = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint: string = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: 'rgb(10, 6, 44)',
            height: '60px',
            width: '10%',
            color: 'white',
            padding: '10px 0',
            lineHeight: '30px'
          }}>
            <div style={{
              backgroundColor: '#9945FF',
              color: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              fontSize: '16px',
              padding: '5px 10px',
              borderRadius: '8px'
            }}>
              <WalletMultiButton/>
            </div>
          </div>
          <Navigate/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

  );
};

function App() {
  return (
    <>
      <ChakraProvider>
        <Wallet/>
      </ChakraProvider>
    </>
  )
}

export default App;