import React, {Fragment, useContext, useLayoutEffect} from 'react';
import {Col, Row} from 'reactstrap';
import Avatar from "../common/Avatar";
import CardSection from "../common/CardSection";
import {themeColors} from "../../helpers/utils";
import {User, Users} from "react-feather";
import AppContext, {AuthContext, ProfileContext} from "../../context/Context";
import {defaultAppBarState, defaultModalState} from "../../Main";
import CardSectionWithTitle from "../common/CardSectionWithTitle";
import MyProfileButtons from "./MyProfileButtons";
import OtherProfileButtons from "./OtherProfileButtons";
import FeedCard from "../feeds/FeedCard";
import ModoomNotFound from "../common/not-found/ModoomNotFound";
import TruncatedText from "../feeds/TruncatedText";
import {Link} from "react-router-dom";
import urls, {appUrls} from "../../urls";
import {useHistory} from 'react-router-dom';
import {axiosDelete} from "../../actions/axios";
import {toast} from "react-toastify";
import {logout} from "../../actions/auth";
import {LOGOUT_SUCCESS} from "../../actions/types";

const DetailStat = ({title, description, icon, to}) => {
    return (
        <Row noGutters className='text-900'>
            {/*<Col className='col-auto pr-2 d-flex align-items-center'>*/}
            {/*    {icon}*/}
            {/*</Col>*/}
            <Col className='my-auto'>
                {to ? <Link className='fs--1 text-900' to={to}>
                        {title}
                    </Link>
                    : <span className='fs--1 text-900'>
                        {title}
                    </span>}
                <div className='text-600 fs--2'>{description}</div>
            </Col>
        </Row>
    )
}

const line_options = {
    color: themeColors.danger,
    easing: 'easeInOut',
    svgStyle: {
        'stroke-linecap': 'round',
        display: 'block',
        width: '100%',
        height: '0.5rem'
    },
    text: {
        style: {
            // Text color.
            // Default: same as stroke color (options.color)
            color: themeColors.danger,
            position: 'absolute',
            right: '24px',
            top: '16px',
            fontWeight: 700,
            padding: 0,
            margin: 0,
            transform: null
        },
        autoStyleContainer: false
    },
    step: (state, line) => {
        line.setText(Math.round(line.value() * 100) + '점');
    }
};

const Profile = () => {
    const {setAppBarState} = useContext(AppContext);
    const {authState} = useContext(AuthContext);
    const {nickname, profile, setProfile, modooms, loading} = useContext(ProfileContext);
    const history = useHistory();

    useLayoutEffect(() => {
        setAppBarState({...defaultAppBarState, useLogo: false, title: '프로필', useBackButton: false, useSearch: true});
        window.scrollTo({top: 0});
    }, []);

    return (
        <Fragment>
            <CardSection>
                <Row>
                    <Col className={'col-auto'}>
                        <Avatar
                            src={profile?.image}
                            name={profile?.first_name || ' '}
                            rounded="circle"
                            className='align-middle'
                            size='3xl'
                            mediaClass='bg-primary'
                            style={{width: '4rem', height: '4rem'}}
                        />
                    </Col>
                    <Col className='my-auto pl-0'>
                        <div>
                            <div className='fs-1 text-900 font-weight-semi-bold'>
                                {profile?.full_name || ''}
                            </div>
                            <div className='fs--1 font-weight-medium'>
                                @{profile?.nickname || ''}
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className='mt-3 d-flex'>
                    <DetailStat title={<span>함께한 모둠원 <strong>{profile?.n_modoomees}명</strong></span>}
                                description=''
                                to={appUrls({nickname}).profileModoomees}
                                icon={<Users size={20}/>}/>
                    <div className='mx-2'>
                        ·
                    </div>
                    <DetailStat title={<span>친구 <strong>{profile?.n_friends}명</strong></span>} description=''
                                to={appUrls({nickname}).profileFriends}
                                icon={<User size={20}/>}/>
                </div>
                {/*<div className='mt-2'>*/}
                {/*    {profile?.keywords?.map((keyword, index) =>*/}
                {/*        <KeywordBadge keyword={keyword} key={keyword.id} useLink/>*/}
                {/*    )}*/}
                {/*</div>*/}
                <Row className='mt-1 mb-2'>
                    <Col>
                        <div className='fs--1 text-800'>
                            {profile?.bio && <TruncatedText preserveNewline useReadMore={false}
                                                            lines={0}>{profile.bio}</TruncatedText>}
                        </div>
                    </Col>
                </Row>
                {authState.user.nickname === nickname
                    ? <MyProfileButtons nickname={nickname}/>
                    : <OtherProfileButtons nickname={nickname}/>}
            </CardSection>
            {/*<CardSection hasPadding={false}>*/}
            {/*    <div className='p-3'>*/}
            {/*        /!*<div className='d-flex justify-content-between align-items-baseline'>*!/*/}
            {/*        /!*    <div className='fs--1 text-800 font-weight-semi-bold'>*!/*/}
            {/*        /!*        평판 점수*!/*/}
            {/*        /!*    </div>*!/*/}
            {/*        /!*</div>*!/*/}
            {/*        /!*<Line progress={profile?.fame_score / 100} options={line_options}*!/*/}
            {/*        /!*      container_class='bg-300 overflow-hidden mt-2'*!/*/}
            {/*        /!*      container_style={{borderRadius: '1rem'}}/>*!/*/}

            {/*    </div>*/}
            {/*    <hr className='my-0 border-300'/>*/}
            {/*    <div className='p-3'>*/}
            {/*        <div className='fs--1 text-800 font-weight-semi-bold'>*/}
            {/*            모둠원들의 롤링페이퍼 <FontAwesomeIcon icon={faChevronRight} transform='shrink-4'/>*/}
            {/*        </div>*/}
            {/*        <div className='mt-2 text-700'>*/}
            {/*            <Smile size={17}/>*/}
            {/*            <div className='ml-2 d-inline-block bg-200 border-radius-1 px-3 py-1 fs--1'>*/}
            {/*                밝은 에너지를 갖고 있어요.*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className='mt-2 text-700'>*/}
            {/*            <Smile size={17}/>*/}
            {/*            <div className='ml-2 d-inline-block bg-200 border-radius-1 px-3 py-1 fs--1'>*/}
            {/*                친구하고 싶어요!*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</CardSection>*/}

            <CardSectionWithTitle className=''
                                  title={`참여한 모둠 ${Number.isInteger(profile?.n_modooms) ? `(${profile?.n_modooms}개)` : ''}`}>
                {modooms?.map((modoom, index) => {
                    const isLast = modooms.length - 1 === index;
                    return <Fragment key={modoom.id}>
                        <FeedCard feed={modoom} itemOnly hideProfile useLink truncateLines={2}/>
                        {isLast || <hr className='border-300 my-3'/>}
                    </Fragment>
                })}
                {loading || !!modooms?.length || <ModoomNotFound/>}
            </CardSectionWithTitle>

            {/*<CardSectionWithTitle className=''*/}
            {/*                      title={`작성한 게시글 ${Number.isInteger(profile?.n_posts) ? `(${profile?.n_posts}개)` : ''}`}>*/}
            {/*    {posts?.map((post, index) => {*/}
            {/*        const isLast = posts.length - 1 === index;*/}
            {/*        return <Fragment key={post.pk}>*/}
            {/*            <FeedCard feed={post} showDetail hideProfile/>*/}
            {/*            {isLast || <hr className='border-300 my-3'/>}*/}
            {/*        </Fragment>*/}
            {/*    })}*/}
            {/*</CardSectionWithTitle>*/}
        </Fragment>
    );
};

export default Profile;