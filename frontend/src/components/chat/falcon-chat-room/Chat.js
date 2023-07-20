import React, { useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';
import ChatProvider from './ChatProvider';
import ChatSidebar from './sidebar/ChatSidebar';
import ChatContent from './content/ChatContent';
import Flex from "../../common/Flex";

const Chat = () => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  return (
    <ChatProvider>
      <ChatContent/>
    </ChatProvider>
  );
};

export default Chat;
