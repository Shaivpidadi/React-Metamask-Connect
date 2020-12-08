import React, { useEffect, useState } from 'react';
import { MetaMaskButton, Button } from 'rimble-ui';
import MetaMaskOnboarding from '@metamask/onboarding';

import './Login.css';

const ONBOARD_TEXT = 'Click to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

const Login = () => {

  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();


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

  return (
    <div className="LoginContainerWrapper">
      <div className="LoginButtonWrapper">
        <MetaMaskButton className="LoginButtonMargin" isDisabled={isDisabled} onClick={() => handleMetamaskClick()}>
          {buttonText}
        </MetaMaskButton>
        <Button className="LoginButtonMargin" onClick={() => alert('WalletConnect Clicked')}> Connect WalletConnect</Button>
      </div>
    </div>
  )
}

export default Login;
