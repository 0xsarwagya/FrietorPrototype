import useWeb3Auth from "./hooks/useWeb3Auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import Loading from "./components/Modals/Loading";
import { toast } from "react-hot-toast";

const App = () => {
  const {
    web3Auth,
    loggedIn,
    setLoggedIn,
    loading,
    wallet,
    balance,
    setLoading,
  } = useWeb3Auth();

  const linkWithGoogle = async () => {
    setLoading(true);
    try {
      await FirebaseAuthentication.signInWithGoogle();
      const { token } = await FirebaseAuthentication.getIdToken({
        forceRefresh: true,
      });

      if (!web3Auth) {
        return;
      }

      const web3authProvider: SafeEventEmitterProvider | null =
        await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider: "jwt",
          extraLoginOptions: {
            id_token: token,
            verifierIdField: "sub",
            domain: `${window.location.protocol}//${window.location.host}`,
          },
        });

      if (web3authProvider) {
        setLoggedIn(true);
        setLoading(false);
        return;
      } else {
        setLoggedIn(false);
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something Bad Happened");
    }
  };

  const linkWithFb = async () => {
    setLoading(true);
    await FirebaseAuthentication.signInWithFacebook();
    const { token } = await FirebaseAuthentication.getIdToken({
      forceRefresh: true,
    });

    if (!web3Auth) {
      return;
    }

    const web3authProvider: SafeEventEmitterProvider | null =
      await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: token,
          verifierIdField: "sub",
          domain: `${window.location.protocol}//${window.location.host}`,
        },
      });

    if (web3authProvider) {
      setLoggedIn(true);
      setLoading(false);
      return;
    } else {
      setLoggedIn(false);
      setLoading(false);
      return;
    }
  };

  const handleTx = () => {
    const to = prompt("Enter Recipent Address");
    const value = prompt("Enter Sending Amount");

    if (!to || !value) {
      return;
    }

    wallet
      ?.sendTransaction({
        to,
        value,
        gasPrice: "0x9184e72a000",
      })
      .then(() => {
        toast.success(`Transaction Complete`);
      })
      .catch((e) => {
        toast.error(`Something bad happened`);
      });
  };

  const handleLogout = () => {
    web3Auth
      ?.logout()
      .then(() => {
        FirebaseAuthentication.signOut();
        setLoggedIn(false);
      })
      .catch(() => {
        alert("Something Bad Happened");
      });
  };

  const handleSigning = () => {
    const message = prompt("What Message Do Want To Sign?");
    if (!message) {
      return;
    }
    wallet
      ?.signMessage(message)
      .then((signed) => {
        toast.success(`Successfully Signed Message ${signed}`);
      })
      .catch((e) => {
        toast.error(`Something bad happened`);
      });
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : loggedIn ? (
        <div>
          <center>
            <p> {wallet?.address} </p>
            <b className="mb-5"> {balance ? balance : "Error"} </b>
            <br />
            <button className="btn btn-primary mb-2" onClick={handleSigning}>
              Sign Message
            </button>
            <br />
            <button className="btn btn-primary mb-2" onClick={handleTx}>
              Send Tx
            </button>
            <br />
            <button className="btn btn-primary mb-2" onClick={handleLogout}>
              Logout
            </button>
          </center>
        </div>
      ) : (
        <div>
          <center>
            <button className="btn btn-primary" onClick={linkWithGoogle}>
              Login With Google
            </button>
            <br />
            <br />
            <button className="btn btn-primary" onClick={linkWithFb}>
              Login With Facebook
            </button>
          </center>
        </div>
      )}
    </div>
  );
};

export default App;
