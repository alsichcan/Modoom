import React, { useState, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Input, Label, Form, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext, { ChatContext } from '../../../../context/Context';
import classNames from 'classnames';
import { getGrays } from '../../../../helpers/utils';

const formatDate = date => {
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  const now = date
    .toLocaleString('en-US', options)
    .split(',')
    .map(item => item.trim());

  return {
    day: now[0],
    hour: now[3],
    date: now[1] + ', ' + now[2]
  };
};

const MessageTextArea = ({ thread }) => {
  const { isDark, isRTL } = useContext(AppContext);
  const { messages, messagesDispatch, threadsDispatch, textAreaInitialHeight, setTextAreaInitialHeight } = useContext(
    ChatContext
  );
  const [message, setMessage] = useState('');

  const isMountedRef = useRef(null);


  useEffect(() => {
    //TextBox and message body height controlling
    isMountedRef.current = true;
    let textAreaPreviousHeight = textAreaInitialHeight;
    const autoExpand = function(field) {
      // Reset field height
      field.style.height = '2rem';

      // Calculate the height
      const textAreaCurrentHeight = field.scrollHeight;

      if (textAreaCurrentHeight <= 160 && document.querySelector('.card-chat-pane')) {
        if (textAreaPreviousHeight !== textAreaCurrentHeight && isMountedRef.current) {
          document.querySelector('.card-chat-pane').style.height = `calc(100% - ${textAreaCurrentHeight}px)`;
          setTextAreaInitialHeight((textAreaPreviousHeight = textAreaCurrentHeight));
        }
      }

      field.style.height = textAreaCurrentHeight + 'px';
    };
    if (document.querySelector('.textarea')) {
      document.addEventListener(
        'input',
        function(event) {
          if (event.target.className === 'textarea');
          autoExpand(event.target);
        },
        false
      );
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [textAreaInitialHeight, setTextAreaInitialHeight]);


  const handleSubmit = e => {
    e.preventDefault();
    const date = new Date();

    let newMessage = {
      senderUserId: 3,
      message: `${message.replace(/(?:\r\n|\r|\n)/g, '<br>')}`,
      status: 'delivered',
      time: formatDate(date)
    };

    const { content } = messages.find(({ id }) => id === thread.messagesId);
    if (message) {
      messagesDispatch({
        type: 'EDIT',
        payload: { id: thread.messagesId, content: [...content, newMessage] },
        id: thread.messagesId
      });

      threadsDispatch({
        type: 'EDIT',
        payload: thread,
        id: thread.id,
        isUpdatedStart: true
      });
    }

    setMessage('');

    document.querySelector('.textarea').style.height = '2rem';
    document.querySelector('.card-chat-pane').style.height = `calc(100% - 2rem)`;
  };

  return (
    <Form className="chat-editor-area bg-white" onSubmit={handleSubmit}>
      <Input className="d-none" type="file" id="chat-file-upload" />
      <Label for="chat-file-upload" className="mb-0 p-1 chat-file-upload cursor-pointer">
        <FontAwesomeIcon icon="paperclip" />
      </Label>

      <Input
        className="border-0 outline-none shadow-none resize-none textarea bg-white"
        type="textarea"
        placeholder="Type your message"
        bsSize="sm"
        value={message}
        onChange={({ target }) => setMessage(target.value)}
        style={{
          height: '2rem',
          maxHeight: '10rem',
          paddingRight: isRTL ? '0.75rem' : '7rem',
          paddingLeft: isRTL ? '7rem' : '0.75rem'
        }}
      />
      <Button
        color="transparent"
        size="sm"
        className={classNames(`btn-send outline-none ml-1`, {
          'text-primary': message.length > 0
        })}
        type="submit"
      >
        Send
      </Button>
    </Form>
  );
};

MessageTextArea.propTypes = {
  thread: PropTypes.object.isRequired
};

export default MessageTextArea;
