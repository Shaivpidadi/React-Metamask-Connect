import React from 'react';
import { MetaMaskButton, Button } from 'rimble-ui';

import './Login.css';

const Login = () => (
  <div className="LoginContainerWrapper">
    <div className="LoginButtonWrapper">
      <MetaMaskButton className="LoginButtonMargin" onClick={() => alert('Metamask Clicked')}>Connect with MetaMask</MetaMaskButton>
      <Button className="LoginButtonMargin" onClick={() => alert('WalletConnect Clicked')}> Connect WalletConnect</Button>
    </div>
  </div>
)

export default Login;
