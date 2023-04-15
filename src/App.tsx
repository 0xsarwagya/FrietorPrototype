import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./App.css";
// import RPC from "./evm.web3";
import RPC from "./evm.ethers";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { toast } from "react-hot-toast";

const clientId =
  "BAtZrSOiHvDDluhYMd_ITNwfC_VcbuPHBAAF0JyHdBnghzJlttg-o9bN5xWIqVI6sTljqiwxGeO2p56KQG55Fpw"; // get from https://dashboard.web3auth.io

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjCkRxvWFPm0O1x_X5jyTwdpERmKc7zpM",
  authDomain: "frietor-wallet.firebaseapp.com",
  databaseURL: "https://frietor-wallet-default-rtdb.firebaseio.com",
  projectId: "frietor-wallet",
  storageBucket: "frietor-wallet.appspot.com",
  messagingSenderId: "621102240407",
  appId: "1:621102240407:web:e7a933a945e2f48a25cfd2",
  measurementId: "G-TZ2BRV0VSY",
};

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      toast.loading("Initialising...", {
        id: "loading",
      });
      try {
        const web3auth = new Web3AuthNoModal({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
          },
          web3AuthNetwork: "aqua",
          useCoreKitKey: false,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: "redirect",
            loginConfig: {
              jwt: {
                verifier: "esportzvio",
                typeOfLogin: "jwt",
                clientId,
              },
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init().then(() => {
          toast.dismiss("loading");
        });
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        toast.dismiss("loading");
        toast.error("Something Bad Happened");
        console.error(error);
      }
    };

    init();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      toast.success("Logged In");
      console.log(res);
      return res;
    } catch (err) {
      toast.error("Something Bad Happened");
      console.error(err);
      throw err;
    }
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const loginRes = await signInWithGoogle();
    console.log("login details", loginRes);
    const idToken = await loginRes.user.getIdToken(true);
    console.log("idToken", idToken);

    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: idToken,
          verifierIdField: "sub",
          domain: `${window.location.protocol}//${window.location.host}`,
        },
      }
    );
    setProvider(web3authProvider);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signAndSendTransaction();
    uiConsole(result);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const logoutView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://frietor.com/" rel="noreferrer">
          Frietor
        </a>{" "}
        Social Login Example For Google
      </h1>

      <div className="grid">{provider ? loginView : logoutView}</div>
    </div>
  );
}

export default App;
