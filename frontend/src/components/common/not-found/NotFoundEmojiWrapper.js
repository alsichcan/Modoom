import React, {Fragment} from 'react';
import Lottie from "react-lottie";
import animationData from "../../../assets/lottie/emoji_yellow.json";
import NotFoundEmoji from "./NotFoundEmoji";

const NotFoundEmojiWrapper = ({title, body}) => {
    return (
        <Fragment>
            <div className='pt-3 pb-2'>
                <NotFoundEmoji/>
            </div>
            <p className='fs-1 font-weight-medium text-900 text-center mb-2'>
                {title}
            </p>
            <p className='text-800 text-center mb-4'>
                {body}
            </p>
        </Fragment>
    );
};

export default NotFoundEmojiWrapper;