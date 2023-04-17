import useWeb3Auth from "./hooks/useWeb3Auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import Loading from "./components/Modals/Loading";
import { toast } from "react-hot-toast";
import { networks } from "./utils/chain";
import React, { useState } from "react";
import { NetworkName } from "./utils/types";
import { ethers } from "ethers";
import Header from "./components/Header";

const App = () => {
  const [address, setAddress] = useState<string>("");
  const [value, setValue] = useState<number | null>(null);
  const {
    web3Auth,
    loggedIn,
    setLoggedIn,
    loading,
    wallet,
    balance,
    setLoading,
    provider,
    setProvider,
    setReresh,
    txHist,
  } = useWeb3Auth();

  /**
   * Attempts to sign in with Google using FirebaseAuthentication, and then connects to a web3 wallet
   * using OpenLogin's connectTo method.
   * @returns {Promise<void>}
   */
  const linkWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      // Sign in with Google using FirebaseAuthentication
      await FirebaseAuthentication.signInWithGoogle();
      // Retrieve an ID token from FirebaseAuthentication
      const { token } = await FirebaseAuthentication.getIdToken({
        forceRefresh: true,
      });

      // If web3Auth is not available, return without doing anything else.
      if (!web3Auth) {
        return;
      }

      // Connect to a web3 wallet using the WALLET_ADAPTERS.OPENLOGIN adapter
      const web3authProvider: SafeEventEmitterProvider | null =
        await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "jwt",
          extraLoginOptions: {
            id_token: token,
            verifierIdField: "sub",
            domain: `${window.location.protocol}//${window.location.host}`,
          },
        });

      // Set the logged-in state to true and the loading state to false if web3authProvider is returned.
      if (web3authProvider) {
        setLoggedIn(true);
        setLoading(false);
        return;
      } else {
        // Set the logged-in state to false and the loading state to false if web3authProvider is not returned.
        setLoggedIn(false);
        setLoading(false);
        return;
      }
    } catch (error) {
      // If there's an error during the process, set the loading state to false and show an error message using toast.error.
      setLoading(false);
      toast.error("Something Bad Happened");
    }
  };

  /**
   * Attempts to sign in with Facebook using FirebaseAuthentication, and then connects to a web3 wallet
   * using OpenLogin's connectTo method.
   * @returns {Promise<void>}
   */
  const linkWithFb = async (): Promise<void> => {
    setLoading(true);
    try {
      // Sign in with Facebook using FirebaseAuthentication
      await FirebaseAuthentication.signInWithFacebook();
      // Retrieve an ID token from FirebaseAuthentication
      const { token } = await FirebaseAuthentication.getIdToken({
        forceRefresh: true,
      });

      // If web3Auth is not available, return without doing anything else.
      if (!web3Auth) {
        return;
      }

      // Connect to a web3 wallet using the WALLET_ADAPTERS.OPENLOGIN adapter
      const web3authProvider: SafeEventEmitterProvider | null =
        await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "jwt",
          extraLoginOptions: {
            id_token: token,
            verifierIdField: "sub",
            domain: `${window.location.protocol}//${window.location.host}`,
          },
        });

      // Set the logged-in state to true and the loading state to false if web3authProvider is returned.
      if (web3authProvider) {
        setLoggedIn(true);
        setLoading(false);
        return;
      } else {
        // Set the logged-in state to false and the loading state to false if web3authProvider is not returned.
        setLoggedIn(false);
        setLoading(false);
        return;
      }
    } catch (error) {
      // If there's an error during the process, set the loading state to false and show an error message using toast.error.
      setLoading(false);
      toast.error("Something Bad Happened");
    }
  };

  /**
   * Attempts to sign in with Twitter using FirebaseAuthentication, and then connects to a web3 wallet
   * using OpenLogin's connectTo method.
   * @returns {Promise<void>}
   */
  const linkWithTwitter = async (): Promise<void> => {
    setLoading(true);
    try {
      // Sign in with Twitter using FirebaseAuthentication
      await FirebaseAuthentication.signInWithTwitter();
      // Retrieve an ID token from FirebaseAuthentication
      const { token } = await FirebaseAuthentication.getIdToken({
        forceRefresh: true,
      });

      // If web3Auth is not available, return without doing anything else.
      if (!web3Auth) {
        return;
      }

      // Connect to a web3 wallet using the WALLET_ADAPTERS.OPENLOGIN adapter
      const web3authProvider: SafeEventEmitterProvider | null =
        await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "jwt",
          extraLoginOptions: {
            id_token: token,
            verifierIdField: "sub",
            domain: `${window.location.protocol}//${window.location.host}`,
          },
        });

      // Set the logged-in state to true and the loading state to false if web3authProvider is returned.
      if (web3authProvider) {
        setLoggedIn(true);
        setLoading(false);
        return;
      } else {
        // Set the logged-in state to false and the loading state to false if web3authProvider is not returned.
        setLoggedIn(false);
        setLoading(false);
        return;
      }
    } catch (error) {
      // If there's an error during the process, set the loading state to false and show an error message using toast.error.
      setLoading(false);
      toast.error("Something Bad Happened");
    }
  };

  /**
   * Logs the user out by first logging them out of their web3 wallet, and then signing them out of FirebaseAuthentication.
   * @returns {void}
   */
  const handleLogout = (): void => {
    // Display a loading toast message while the user is being signed out.
    toast.loading("Signing You Out!", {
      id: "loading",
    });
    web3Auth
      ?.logout()
      .then(async () => {
        // Sign the user out of FirebaseAuthentication if they're successfully logged out of their web3 wallet.
        await FirebaseAuthentication.signOut();
        // Set the logged-in state to false, dismiss the loading toast message, and display a success message.
        setLoggedIn(false);
        toast.dismiss("loading");
        toast.success("Logged Out Successfully");
      })
      .catch(() => {
        // If there's an error while logging the user out of their web3 wallet, dismiss the loading toast message and display an error message.
        toast.dismiss("loading");
        toast.error("Logging out failed!");
        // Set the logged-in state to true so that the user remains logged in.
        setLoggedIn(true);
      });
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(wallet?.address || "")
      .then(() => {
        toast.success("Copied Address To Clipboard");
      })
      .catch((e) => {
        toast.error("Couldn't Copy Address");
      });
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = networks.filter(
      (net) => net.id === (e.target.value as NetworkName)
    )[0];

    setProvider(newNetwork);
  };

  const handleSend = async () => {
    if (!ethers.utils.isAddress(address)) {
      toast.error(`Please Enter A Valid Address`);
      return;
    } else if (value == null) {
      toast.error(`Please Enter An Amount`);
      return;
    } else {
      try {
        if (!wallet) return;
        toast.loading("Getting Ready To Send Transaction", {
          id: "loading1",
        });
        const toAddress = address;
        const txValue = ethers.utils.parseEther(value.toString());
        const gasData = await wallet.provider.getFeeData();
        const gasLimit = 250000;
        const nonce = await wallet.getTransactionCount();
        toast.dismiss("loading1");

        if (
          !gasData.maxFeePerGas ||
          !gasData.gasPrice ||
          !gasData.maxPriorityFeePerGas
        ) {
          toast.error("Error In Transaction");
          return;
        }

        const transaction = {
          to: toAddress,
          value: ethers.utils.parseEther(value.toString()),
          maxFeePerGas: ethers.BigNumber.from(31000000000),
          gasLimit: 6000000,
          maxPriorityFeePerGas: ethers.BigNumber.from(31000000000),
          nonce,
        };

        const tx = await wallet.sendTransaction(transaction);
        document.getElementById("sendBtn")?.click();
        toast.loading("Transaction Sent! Waiting For Confirmation", {
          id: "loading",
        });
        setTimeout(() => {
          toast.dismiss("loading");
        }, 2000);
        await tx.wait();
        toast.dismiss("loading");
        toast.success("Transaction Sent");
        setReresh(true);
      } catch (error) {
        toast.error("Error In Transaction");
        console.error(error);
        document.getElementById("sendBtn")?.click();
      }
    }
  };

  const handleBuy = () => {
    toast.loading(`You will be redirected to our partner webpage`, {
      id: "redirect",
    });
    setTimeout(() => {
      window.location.href = `https://global-stg.transak.com/?apiKey=7c92bc83-1448-4f08-af42-1f228547c33c&walletAddress=${wallet?.address}&fiatCurrency=inr&redirectURL=${window.location.protocol}//${window.location.host}&defaultCryptoCurrency=${provider.native_token}`;
      toast.dismiss("redirect");
    }, 2000);
  };

  const handleSwap = () => {
    window.location.href = "https://dex.frietor.com/";
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : loggedIn ? (
        // LoggedIn View
        <>
          <Header web3auth={web3Auth} handleLogout={handleLogout} />
          <body>
            <input type="checkbox" className="modal-toggle " id="sendTx" />
            <div className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Send Transaction</h3>
                <div className="py-4">
                  {/* Adddress */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">
                        Who do you want to send?
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="0xaddress69"
                      onChange={(e) => setAddress(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>
                  {/* Value */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">
                        How much amount do you want to send?
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder={`0 ${provider.native_token}`}
                      onChange={(e) => setValue(e.target.valueAsNumber)}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
                <div className="modal-action">
                  <label htmlFor="sendTx" className="btn btn-error">
                    Cancel
                  </label>
                  <button onClick={handleSend} className="btn btn-success">
                    Send Transaction
                  </button>
                </div>
              </div>
            </div>
          </body>
          <div>
            {/* Main Loggedin View */}
            {/* Balance */}
            <div className="mockup-window border bg-base-300">
              <div className="px-4 py-16 bg-base-200">
                <center>
                  {/* Network Switch */}
                  <select
                    value={provider.id}
                    onChange={(e) => handleNetworkChange(e)}
                    className="select select-bordered select-xs w-auto"
                  >
                    {networks.map((net) => (
                      <option key={net.name} value={net.id}>
                        {" "}
                        {net.name}{" "}
                      </option>
                    ))}
                  </select>
                  <div></div>
                  {/* Address */}
                  <button
                    onClick={handleCopy}
                    className="btn btn-ghost tooltip tooltip-info tooltip-sm text-xs"
                    data-tip="Copy"
                  >
                    {wallet?.address.split("").splice(0, 12).join("")}...
                  </button>
                  <br />
                  {/* Balance */}
                  <button className="btn gap-2 bg-transparent text-xl">
                    {balance}
                    <img
                      src={provider.logo_url}
                      alt="icon"
                      className="w-6 h-6"
                    />
                  </button>
                  <br />
                  {/* Action Buttons */}
                  <div className="btn-group mt-5">
                    {/* Send */}
                    <label
                      id="sendBtn"
                      className="btn btn-secondary gap-2"
                      htmlFor="sendTx"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                      </svg>
                      Send
                    </label>
                    {/* Buy */}
                    <button
                      className="btn btn-secondary gap-2"
                      onClick={handleBuy}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Buy
                    </button>
                    {/* Swap */}
                    <button
                      className="btn btn-secondary gap-2"
                      onClick={handleSwap}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Swap
                    </button>
                  </div>
                </center>
              </div>
            </div>
            {/* Show Tx */}
            <div className="overflow-x-auto mt-2">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>Hash</th>
                    <th>Block Number</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {txHist.map((tx) => {
                    return (
                      <tr>
                        <td> {txHist.indexOf(tx) + 1} </td>
                        <td>
                          <a
                            target="_blank"
                            href={`${provider.blockScanner}tx/${tx.hash}`}
                          >
                            {tx.hash.split("").splice(0, 5).join("")}...
                          </a>
                        </td>
                        <td>{tx.blockNumber}</td>
                        <td>{tx.value.toString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <a
              href={`${provider.blockScanner}address/${wallet?.address}`}
              target="_blank"
              className="btn btn-block btn-primary mt-5"
            >
              View All Transactions
            </a>
          </div>
        </>
      ) : (
        // Loggedout view
        <div>
          <div className="mockup-window border bg-base-300">
            <div className="px-4 py-16 bg-base-200">
              <center>
                {/* Google Login */}
                <button
                  onClick={linkWithGoogle}
                  type="button"
                  className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
                >
                  <svg
                    className="w-4 h-4 mr-2 -ml-1"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Sign in with Google
                </button>
                <br />
                {/* Facebook Login */}
                <button
                  onClick={linkWithFb}
                  type="button"
                  className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                >
                  <svg
                    className="w-4 h-4 mr-2 -ml-1"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="facebook-f"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path
                      fill="currentColor"
                      d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
                    ></path>
                  </svg>
                  Sign in with Facebook
                </button>
                <br />
                {/* Twitter Login */}
                <button
                  onClick={linkWithTwitter}
                  type="button"
                  className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2"
                >
                  <svg
                    className="w-4 h-4 mr-2 -ml-1"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="twitter"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
                    ></path>
                  </svg>
                  Sign in with Twitter
                </button>
              </center>
            </div>
          </div>
          <center>
            <div className="stats shadow-xl bg-primary text-white mt-5">
              <div className="stat">
                <div className="stat-title text-white">
                  Self Custodial Wallet By
                </div>
                <div className="stat-value">Frietor</div>
              </div>
            </div>
          </center>
        </div>
      )}
    </div>
  );
};

export default App;
