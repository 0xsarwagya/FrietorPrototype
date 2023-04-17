import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { clientID } from "../utils/config";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Wallet, ethers } from "ethers";
import { NetworkConfig, NetworkName, historyProvider } from "../utils/types";
import { networks } from "../utils/chain";
import { toast } from "react-hot-toast";

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
  const [provider, setProvider] = useState<NetworkConfig>(networks[0]);
  const [gasPrice, setGasPrice] = useState<ethers.BigNumber>(
    ethers.BigNumber.from("6000000")
  );
  const [refresh, setReresh] = useState<boolean>(false);
  const [historyProv, setHistoryProv] = useState<historyProvider>(
    provider.historyProvider
  );
  const [txHist, setTxHist] = useState<
    Array<ethers.providers.TransactionResponse>
  >([]);

  useEffect(() => {
    const bigint = ethers.BigNumber.from("6000000");
    setGasPrice(bigint);
  }, []);

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
            chainId: "0x89",
          },
          web3AuthNetwork: "aqua",
          useCoreKitKey: false,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: "sessionless_redirect",
            loginConfig: {
              jwt: {
                verifier: "esportzvio",
                typeOfLogin: "jwt",
                clientId: clientID,
              },
            },
          },
        });
        console.log(web3auth);
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

    const id = localStorage.getItem("network") as NetworkName;
    if (!id) {
      const providerData = networks[0];
      setProvider(providerData);
      setHistoryProv(providerData.historyProvider);
      init();
      return;
    }
    const providerData = networks.filter((net) => net.id === id)[0];
    setProvider(providerData);
    setHistoryProv(providerData.historyProvider);
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
        const walletFRT = new ethers.Wallet(privatekey, provider.provider);
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
    setLoading(true);
    provider.provider
      .getBalance(wallet.address)
      .then((bal) => {
        const getHist = async () => {
          try {
            const historyProvider = new ethers.providers.EtherscanProvider(
              historyProv
            );
            if (!wallet) return;
            const txHistory = await historyProvider.getHistory(wallet.address);

            setTxHist(txHistory.splice(0, 3));
            setLoading(false);
          } catch (error) {
            setLoading(false);
            toast.error("Error While Fetching History");
          }
        };

        getHist();
        let balanceInETH = ethers.utils.formatEther(bal);
        let formattedBal =
          balanceInETH.length > 4
            ? balanceInETH.split("").splice(0, 6).join("") + "..."
            : balanceInETH;
        setBalance(formattedBal);
      })
      .catch((e) => {
        setLoading(false);
        setBalance(null);
        console.log(e);
      });
  }, [wallet, provider, refresh]);

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

  useEffect(() => {
    if (!wallet) return;
    wallet.connect(provider.provider);
    localStorage.setItem("network", provider.id);
  }, [provider, refresh]);

  useEffect(() => {
    const getGas = async () => {
      try {
        const gasEst = await provider.provider.getGasPrice();
        setGasPrice(gasEst);
      } catch (error) {
        const bigint = ethers.BigNumber.from("6000000");
        setGasPrice(bigint);
      }
    };

    getGas();
  }, [provider]);

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
    provider,
    setProvider,
    gasPrice,
    setReresh,
    txHist,
  };
};

export default useWeb3Auth;
