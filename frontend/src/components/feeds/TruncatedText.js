import React, {useState} from 'react';
import Truncate from 'react-truncate';
import classNames from 'classnames';

const TruncatedText = ({children, lines, className, preserveNewline, readMoreText, useReadMore = true}) => {
    const [truncated, setTruncated] = useState(false);
    const [readMore, setReadMore] = useState(false);
    return (
        <div
            onClick={() => useReadMore && setReadMore(true)}
            className={classNames(className, {
                'cursor-pointer': useReadMore && truncated && !readMore
            })}
            style={{lineHeight: 1.5}}>
            <Truncate
                lines={readMore ? 0 : lines}
                ellipsis={`...${readMoreText || ''}`}
                onTruncate={isTruncated => {
                    isTruncated !== truncated && setTruncated(isTruncated);
                }}>
                {preserveNewline ? children.split('\n').map((line, i, arr) => {
                    const span_line = <span key={i}>{line}</span>;
                    if (i === arr.length - 1) {
                        return span_line;
                    } else {
                        return [span_line, <br key={i + 'br'}/>];
                    }
                }) : children}
            </Truncate>
        </div>
    );
};

export default TruncatedText;