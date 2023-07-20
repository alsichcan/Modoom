import React from 'react';
import {Row, Col} from 'reactstrap';
import {FixedSizeList} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import FeedCard from "../feeds/FeedCard";
import ReelSection from "./reels/ReelSection";

const FeedsList = ({
                       hasNextPage,
                       isNextPageLoading,
                       items,
                       loadNextPage,
                       initialScrollOffset,
                       setScrollOffset

                   }) => {
    const itemCount = hasNextPage ? items.length + 1 : items.length;
    const loadMoreItems = isNextPageLoading ? () => {
    } : loadNextPage;
    const isItemLoaded = index => !hasNextPage || index < items.length;

    const Item = ({index, style}) => {
        let content;
        if (!isItemLoaded(index)) {
            content = "Loading...";
        } else {
            const feed = items[index];
            content = <FeedCard key={feed.id} feed={feed} useLink/>;
        }
        if (index === 0) {
            content = <ReelSection/>
        }
        return <div style={style}>{content}</div>;
    };

    return (
        <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
        >
            {({onItemsRendered, ref}) => (
                <FixedSizeList
                    itemCount={itemCount}
                    height={500}
                    itemSize={300}
                    initialScrollOffset={initialScrollOffset}
                    onScroll={({scrollOffset}) => {
                        setScrollOffset(scrollOffset)
                    }}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                >
                    {Item}
                </FixedSizeList>
            )}
        </InfiniteLoader>
    );
};

export default FeedsList;