import React from 'react';
import Iframe from 'react-iframe'

const DiscordChat = ({ isIframeLoadingCompleted }) => {
  return (
    <Iframe url="https://titanembeds.com/embed/786136478026825758"
      width="600px"
      height="400px"
      display="initial"
      position="relative"
      frameBorder="0"
      loading='lazy'
      onLoad={isIframeLoadingCompleted} />
  )
}

export default DiscordChat;
