import React, { useRef, FC, useMemo, useEffect, useState } from 'react';

import Game from './Game';
import HUD from './HUD';

import './sass/rpg-game.sass';

type AppProps = {

};


const RPGGame: FC<AppProps> = () => {

    const [game, setGame] = useState<Game>(null);
    const containerRef = useRef(null);


    useEffect(() => {
        const game = new Game(containerRef.current);
        setGame(game);
    }, [containerRef])


    return (
        <>
            <div className='game__container' ref={containerRef}>


            </div>
            <HUD />
        </>
    )
}

export default RPGGame;

