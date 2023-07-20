import React, { useEffect, useRef } from 'react';

const useDidMountEffect = (effect, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) effect();
        else didMount.current = true;
    }, deps);
}

export default useDidMountEffect;