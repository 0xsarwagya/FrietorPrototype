import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { clientID } from "../utils/config";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Wallet, ethers } from "ethers";

/**
 * A custom hook for handling Web3 authentication.
 * @returns An object containing Web3AuthNoModal instance, authentication status, loading state, private key, and wallet.
 */
const useWeb3Auth = () => {
  const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [privatekey, setPrivateKey] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [frietorProvider, setFrietorProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  /**
   * Check if the user is already authenticated.
   */
  useEffect(() => {
    if (web3Auth?.provider) {
      setLoggedIn(true);
      return;
    }
    setLoggedIn(false);
    return;
  }, [web3Auth]);

  /**
   * Check if the user is authenticated when the component mounts.
   */
  useEffect(() => {
    setLoading(true);
    if (web3Auth?.provider) {
      setLoggedIn(true);
      setLoading(false);
      return;
    }
    setLoggedIn(false);
    setLoading(false);
    return;
  }, []);

  /**
   * Initialize the Web3AuthNoModal instance with OpenloginAdapter.
   */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const web3auth = new Web3AuthNoModal({
          clientId: clientID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
          },
          web3AuthNetwork: "testnet",
          useCoreKitKey: false,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: "redirect",
            loginConfig: {
              jwt: {
                verifier: "esportzvio",
                typeOfLogin: "jwt",
                clientId: clientID,
              },
            },
          },
        });

        web3auth.configureAdapter(openloginAdapter);
        await web3auth.init();
        setWeb3Auth(web3auth);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        throw Error("Something bad happened while initializing Web3");
      }
    };

    init();
  }, []);

  /**
   * Get the user's private key if authenticated.
   */
  useEffect(() => {
    if (loggedIn) {
      if (web3Auth?.provider) {
        web3Auth.provider
          .request({
            method: "eth_private_key",
          })
          .then((pk) => {
            setPrivateKey(pk as string);
          })
          .catch(() => {
            setPrivateKey(null);
          });
      }
      return;
    }
    setPrivateKey(null);
  }, [loggedIn]);

  /**
   * Get the user's wallet from their private key.
   */
  useEffect(() => {
    if (privatekey) {
      if (web3Auth) {
        const frtprovider = new ethers.providers.Web3Provider(
          web3Auth.provider as any
        );
        const walletFRT = new ethers.Wallet(privatekey, frtprovider);
        setWallet(walletFRT);
        return;
      }
    }
    setWallet(null);
    return;
  }, [privatekey]);

  /**
   * Get the user's balance from their wallet.
   */
  useEffect(() => {
    if (!wallet) return;
    wallet
      .getBalance()
      .then((bal) => {
        let balanceInETH = ethers.utils.formatEther(bal);
        setBalance(balanceInETH);
      })
      .catch((e) => {
        setBalance(null);
        console.log(e);
      });
  }, [wallet]);

  useEffect(() => {
    if (web3Auth?.provider) {
      const frtProv = new ethers.providers.Web3Provider(
        web3Auth.provider as any
      );
      setFrietorProvider(frtProv);
      return;
    }
    setFrietorProvider(null);
    return;
  }, [web3Auth]);

  return {
    web3Auth,
    loggedIn,
    setLoggedIn,
    loading,
    setLoading,
    privatekey,
    wallet,
    balance,
    frietorProvider,
  };
};

export default useWeb3Auth;
