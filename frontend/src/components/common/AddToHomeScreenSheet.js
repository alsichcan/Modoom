import React from 'react';
import {Row, Col} from 'reactstrap';
import {appUrls} from "../../urls";
import {faUsers} from "@fortawesome/free-solid-svg-icons/faUsers";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons/faPencilAlt";
import BottomSheet from "./BottomSheet";
import {Menu, PlusSquare, Share} from "react-feather";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {useGA4React} from "ga-4-react";
import {setItemToStore} from "../../helpers/utils";

const AddToHomeScreenSheet = (props) => {
    const ga = useGA4React();
    return (
        <BottomSheet {...props}>
            <div className='pt-3 pb-3'>
                모둠을 홈 화면에 추가하면 모둠이 앱처럼 변해요!
                <div className='text-800 font-weight-medium my-2'>
                    <span className='font-weight-semi-bold'>아이폰</span>
                    <div className='my-2'>
                        1. 하단의 <Share size={20} className='text-primary pb-1'/> 버튼을 눌러주세요.<br/>
                    </div>
                    <div className='my-2'>
                        2. 홈 화면에 추가 <PlusSquare size={20} className='pb-1'/> 버튼을 눌러주세요.
                    </div>
                </div>
                <div className='text-800 font-weight-medium mt-3'>
                    <span className='font-weight-semi-bold'>안드로이드</span>
                    <div className='my-2'>
                        브라우저 메뉴(<Menu size={20} className='pb-1'/>)에서 "현재 페이지 추가" 또는 "홈 화면에 추가"를 선택해주세요.
                    </div>
                </div>
                <div className='text-right text-primary mt-2 cursor-pointer'
                     onClick={() => {
                         setItemToStore('modoomDismissedPWA', true);
                         ga.gtag('event', 'dismiss_pwa_popup_forever', {
                             'event_category': 'pwa',
                         });
                         props.setIsOpen(false);
                     }}>
                    다시 보지 않기
                </div>
            </div>
        </BottomSheet>
    );
};

export default AddToHomeScreenSheet;