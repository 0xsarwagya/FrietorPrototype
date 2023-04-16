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

  const handleLogout = () => {
    toast.loading("Signing You Out!", {
      id: "loading",
    });
    web3Auth
      ?.logout()
      .then(async () => {
        await FirebaseAuthentication.signOut();
        setLoggedIn(false);
        toast.dismiss('loading')
        toast.success("Logged Out Successfully");
      })
      .catch(() => {
        toast.dismiss('loading')
        toast.error("Logging out failed!");
        setLoggedIn(true);
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
            <button className="btn btn-primary" onClick={linkWithFb}>
              Login With Facebook
            </button>
            <br />
            <button className="btn btn-primary" onClick={linkWithTwitter}>
              Login With Twitter
            </button>
          </center>
        </div>
      )}
    </div>
  );
};

export default App;
