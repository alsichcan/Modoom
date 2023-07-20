import React, { useContext } from 'react';
import { Nav } from 'reactstrap';
import ChatThread from './ChatThread';
import ChatContactsSearch from './ChatContactsSearch';
import AppContext, { ChatContext } from '../../../../context/Context';
import { isIterableArray } from '../../../../helpers/utils';

const ChatSidebar = () => {
  const { isRTL } = useContext(AppContext);
  const { threads } = useContext(ChatContext);

  return (
    <div className="chat-sidebar rounded-left">
      <div className="contacts-list bg-white">
        <Nav className="border-0">
            {isIterableArray(threads) && threads.map(thread => <ChatThread thread={thread} key={thread.id} />)}
          </Nav>
      </div>
      <ChatContactsSearch />
    </div>
  );
};

export default ChatSidebar;
