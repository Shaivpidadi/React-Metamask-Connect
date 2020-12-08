import React, { useEffect, useState } from 'react';
import { MetaMaskButton, Button } from 'rimble-ui';

import './Login.css';
import { isMetaMaskInstalled as checkMetamask } from '../../utils';

const Login = () => {

  const [isMetaMaskInstalled, updateIsMetamaskInstalled] = useState(false);

  useEffect(() => {
    if (checkMetamask())
      updateIsMetamaskInstalled(true);
    else
      updateIsMetamaskInstalled(false);
  });

  return (
    <div className="LoginContainerWrapper">
      <div className="LoginButtonWrapper">
        <MetaMaskButton className="LoginButtonMargin" onClick={() => alert('Metamask Clicked')}>
          {isMetaMaskInstalled ? 'Connect with MetaMask' : 'Install Metamask'}
        </MetaMaskButton>
        <Button className="LoginButtonMargin" onClick={() => alert('WalletConnect Clicked')}> Connect WalletConnect</Button>
      </div>
    </div>
  )
}

export default Login;
