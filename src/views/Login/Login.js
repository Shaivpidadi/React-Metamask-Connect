import React, { useEffect, useState, useRef } from 'react';
import { MetaMaskButton, Button } from 'rimble-ui';
import MetaMaskOnboarding from '@metamask/onboarding';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import './Login.css';

const ONBOARD_TEXT = 'Click to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

const Login = () => {

  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [connector, setConnector] = useState({});
  const [walletConnectDetails, setWalletConnectDetails] = useState({});
  const onboarding = useRef();


  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  const handleMetamaskClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => {
          console.log({ newAccounts })
          setAccounts(newAccounts)
        });
    } else {
      onboarding.current.startOnboarding();
    }
  }


  const onSessionUpdate = async (accounts, chainId) => {
    const address = accounts[0];
    setWalletConnectDetails({ chainId, accounts, address });
  };

  const onConnect = async (payload) => {
    const { chainId, accounts } = payload.params[0];
    const address = accounts[0];
    setWalletConnectDetails({
      ...walletConnectDetails,
      connected: true,
      chainId,
      accounts,
      address,
    });
  };

  const resetApp = async () => {
    setWalletConnectDetails({});
  };

  const onDisconnect = async () => {
    resetApp();
  };

  const walletConnectInit = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    setConnector(connector);

    // check if already connected
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    }

    // subscribe to events
    if (!connector) {
      return;
    }

    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);

      if (error) {
        throw error;
      }

      const { chainId, accounts } = payload.params[0];
      onSessionUpdate(accounts, chainId);
    });

    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);

      if (error) {
        throw error;
      }

      onConnect(payload);
    });

    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);

      if (error) {
        throw error;
      }

      onDisconnect();
    });

    if (connector.connected) {
      const { chainId, accounts } = connector;
      const address = accounts[0];
      setWalletConnectDetails({
        connected: true,
        chainId,
        accounts,
        address,
      });
      onSessionUpdate(accounts, chainId);
    }

    setWalletConnectDetails({ connector });

  };

  return (
    <div className="LoginContainerWrapper">
      <div className="LoginButtonWrapper">
        <MetaMaskButton className="LoginButtonMargin" isDisabled={isDisabled} onClick={() => handleMetamaskClick()}>
          {buttonText}
        </MetaMaskButton>
        <Button className="LoginButtonMargin" onClick={() => walletConnectInit()}> Connect WalletConnect</Button>
      </div>
    </div>
  )
}

export default Login;
