import React from 'react';
import {users} from "../../data/users/profiles";
import ProfileCard from "./ProfileCard";
import {modooms} from "../../data/modoom/modooms";
import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper.scss';

const ProfileCardsSection = () => {
    return (
        <div className='container px-0 mt-sm-2 mb-2 my-2 my-sm-3'>
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
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {users.map((user, index) => {
                    const isFirst = index === 0;
                    const isLast = index === modooms.length - 1;
                    return <SwiperSlide>
                        <ProfileCard {...user} isFirst={isFirst} isLast={isLast}/>
                    </SwiperSlide>;
                })}
            </Swiper>

        </div>
    );
};

export default ProfileCardsSection;