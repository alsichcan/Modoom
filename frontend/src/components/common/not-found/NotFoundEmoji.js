import React from 'react';
import {Row, Col} from 'reactstrap';
import animationData from "../../../assets/lottie/emoji_yellow.json";
import Lottie from "react-lottie";

const NotFoundEmoji = ({size}) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <Lottie options={defaultOptions} width={size || 150} height={size || 150}/>
    );
};

export default NotFoundEmoji;