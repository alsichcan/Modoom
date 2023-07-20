import React from 'react';
import FeedCard from "../../feeds/FeedCard";
import ProfileVerticalListItem from "../explore-keyword/ProfileVerticalListItem";
import CardSection from "../../common/CardSection";
import {KeywordListItem} from "../explore-keyword/ExploreKeyword";

const SearchResults = ({data, query}) => {
    if (!!!data) {
        return null;
    }
    return (
        data.map(item => {
            switch (query) {
                case 'modooms':
                    return <FeedCard feed={item} truncateLines useLink/>
                case 'keywords':
                    return <div className='container my-3'>
                        <KeywordListItem keyword={item}/>
                    </div>;
                case 'profiles':
                    return <CardSection>
                        <ProfileVerticalListItem profile={item} isLast={true}/>
                    </CardSection>
                default:
                    return null;
            }
        })
    );
};

export default SearchResults;