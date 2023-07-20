import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {Row, Col} from 'reactstrap';
import Message from "../Message";
import {users} from "../../../../data/users/profiles";
import MessageInputContainer from "../MessageInputContainer";
import urls, {appUrls, webSocketUrls} from "../../../../urls";
import {AuthContext, ChatContext} from "../../../../context/Context";
import {axiosGet} from "../../../../actions/axios";
import axios from "axios";
import {useInView} from "react-intersection-observer";
import {Info} from "react-feather";
import {useHistory} from 'react-router-dom';

const ChatRoom = ({messagesAPI, webSocketAPI}) => {
    const {authState} = useContext(AuthContext);
    const {activeRoom} = useContext(ChatContext);
    const [prevUrl, setPrevUrl] = useState(null);
    const [message, setMessage] = useState('');
    const [messagesLoading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null)
    const scrollAreaRef = useRef(null)
    const ws = useRef();
    const [ref, inView] = useInView();
    const history = useHistory();

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
        }
    }

    // 채팅방 입장 시 최근 20개 메시지를 받아온다.
    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosGet(null, messagesAPI).then(data => {
            setLoading(false);
            if (data) {
                if (data.success === false) {
                    history.push(appUrls().error404)
                    return
                }
                setMessages(data?.results);
                setPrevUrl(data.next);
            }
            scrollToBottom();
        });
        return () => {
            source.cancel();
        };
    }, [activeRoom]);

    useEffect(() => {
        ws.current = new WebSocket(webSocketAPI, ['Token', authState.token]);
        ws.current.onmessage = function (e) {
            const data = JSON.parse(e.data);
            setMessages(messages => [...messages, data]);
            scrollToBottom();
        };

        return () => {
            ws.current.close()
        };
    }, [activeRoom]);

    // 무한 스크롤링 구현
    useEffect(() => {
        const source = axios.CancelToken.source();
        if (inView && prevUrl) {
            const lastScrollHeight = scrollAreaRef.current.scrollHeight;
            axiosGet(source, prevUrl).then(data => {
                if (data) {
                    setMessages(messages => [...data?.results, ...messages]);
                    setPrevUrl(data.next);
                }
                window.scrollTo({top: scrollAreaRef.current.scrollHeight - lastScrollHeight})
            });
        }
        return () => {
            source.cancel()
        };
    }, [inView]);

    const onSend = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage === '') {
            return;
        }
        ws.current.send(JSON.stringify({message: trimmedMessage}));
        setMessage('');
    };

    return (
        <div ref={scrollAreaRef}>
            <div className='py-1' ref={ref}/>
            {messages?.map((message, index) => {
                return <Message key={message.id} message={message}
                                isLast={messages.length - 1 === index}/>
            })}
            {!messagesLoading && !!!messages.length && <div className='mb-4'>
                <div className='text-center'>
                    <div className='fs-9 py-1'>
                        👋
                    </div>
                    <div className='fs--1'>
                        대화 내역이 존재하지 않습니다.<br/>
                        먼저 인사해보세요 :)<br/><br/>
                    </div>
                </div>
            </div>}
            <div ref={messagesEndRef}/>
            <MessageInputContainer onSend={onSend} message={message} setMessage={setMessage}/>
        </div>
    );
};

export default ChatRoom;