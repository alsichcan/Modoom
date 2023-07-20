import React, {useContext, useEffect, useState} from 'react';
import Reel from "./Reel";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';
import axios from 'axios';
import {axiosGet} from "../../../actions/axios";
import urls from "../../../urls";
import {AuthContext, NotificationContext} from "../../../context/Context";

const isPending = (modoom, myNickName) => {
    return !!modoom.enrollments.find(enrollment => !enrollment.accepted && enrollment.profile.nickname === myNickName);
};

const ReelSection = () => {
    const {authState} = useContext(AuthContext);
    const [myModooms, setMyModooms] = useState([]);
    const {notiData} = useContext(NotificationContext);

    useEffect(() => {
        const source = axios.CancelToken.source();
        axiosGet(source, urls({nickname: authState.user.nickname}).modooms, {query: 'home'}).then(data => {
            if (data) {
                setMyModooms(data?.results);
            }
        });
    }, []);

    return (
        <div className='container my-2 my-sm-3'>
            <Swiper
                slidesPerView={2.5}
                spaceBetween={10}
                slidesPerGroup={2}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                breakpoints={{
                    576: {
                        slidesPerView: 3.5,
                        slidesPerGroup: 3
                    },
                    768: {
                        slidesPerView: 4.5,
                        slidesPerGroup: 4
                    },
                    992: {
                        slidesPerView: 5.5,
                        slidesPerGroup: 5
                    },
                    1200: {
                        slidesPerView: 5,
                        slidesPerGroup: 4
                    }
                }}
            >
                {myModooms.map((modoom, index) => {
                    const isFirst = index === 0;
                    const isLast = index === myModooms.length - 1;
                    const unreadCount = notiData.modoom_chat.find(cr=>cr.chat_room === modoom.id)?.unread_count || 0;
                    return <SwiperSlide key={modoom.id}>
                        <Reel modoom={modoom} isFirst={isFirst} isLast={isLast} isPending={isPending(modoom, authState.user.nickname)} unreadCount={unreadCount}/>
                    </SwiperSlide>
                })}
            </Swiper>
        </div>
    );
};

export default ReelSection;