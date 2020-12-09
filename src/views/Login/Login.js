import React, { useEffect, useState, useRef } from 'react';
import { MetaMaskButton, Button, Modal, Box, Heading, Card } from 'rimble-ui';
import MetaMaskOnboarding from '@metamask/onboarding';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Web3 from 'web3';

import './Login.css';
import DiscordChat from '../../components/DiscordChat/DiscordChat';
import Loader from '../../components/Loader/Loader';

const ONBOARD_TEXT = 'Click to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

const Login = () => {

  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [connector, setConnector] = useState({});
  const [walletConnectDetails, setWalletConnectDetails] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLogedIn] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [userBalance, setUserBalance] = useState();
  const onboarding = useRef();

  useEffect(() => async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }, [])

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }

  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setIsOpen(false);
    }
  }, [isLoggedIn]);

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

  useEffect(() => {
    if (Object.keys(walletConnectDetails).length === 0) {
      setIsLogedIn(false);
    }
  }, [walletConnectDetails])

  const handleMetamaskClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => {
          setIsLogedIn(true);
          setAccounts(newAccounts);
          window.web3.eth.getBalance(newAccounts[0])
            .then((balance) => {
              setUserBalance(balance / 1000000000000000000);
            });
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
    const getBalance = await window.web3.eth.getBalance(address);
    setWalletConnectDetails({
      ...walletConnectDetails,
      connected: true,
      chainId,
      accounts,
      address
    });
    setUserBalance(getBalance);
  };

  const closeModal = e => {
    e.preventDefault();
    setIsOpen(false);
  };

  const openModal = e => {
    e.preventDefault();
    setIsOpen(true);
  };


  const resetApp = () => {
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
      setIsLogedIn(true);
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
    <>
      <div>
        {!!userBalance && isLoggedIn && (<h3> Balance: {userBalance} </h3>)}
      </div>
      <div className="LoginContainerWrapper">
        <Button onClick={openModal} disabled={isLoggedIn}> {isLoggedIn ? 'Logged In' : 'Login'} </Button>
        <DiscordChat isIframeLoadingCompleted={() => setIsIframeLoading(false)} />
      </div>


      <Modal isOpen={isOpen}>
        <Card width={"420px"} p={0}>
          <Button.Text
            icononly
            icon={"Close"}
            color={"moon-gray"}
            position={"absolute"}
            top={0}
            right={0}
            mt={3}
            mr={3}
            onClick={closeModal}
          />

          <Box p={4} mb={3}>
            <Heading.h3>Connect to a wallet</Heading.h3>
          </Box>

          <div className="LoginButtonWrapper">
            <MetaMaskButton className="LoginButtonMargin" isDisabled={isDisabled} onClick={() => handleMetamaskClick()}>
              {buttonText}
            </MetaMaskButton>
            <Button className="LoginButtonMargin" onClick={() => walletConnectInit()}> Connect WalletConnect</Button>
          </div>
        </Card>
      </Modal>
    </>
  )
}

export default Login;
