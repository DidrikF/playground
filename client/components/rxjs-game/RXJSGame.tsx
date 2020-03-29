import React, { RefObject } from 'react';
import { Observable, fromEvent, of, BehaviorSubject, Subscription } from 'rxjs';
import { map, buffer, expand, filter, share, withLatestFrom, tap, bufferCount } from 'rxjs/operators';

import { KeyUtil } from './keys.util';

interface IFrameData {
    frameStartTime: number;
    deltaTime: number;
  }

const boundaries = {
    left: 0,
    top: 0,
    bottom: 300,
    right: 400,
}

const bounceRateChanges = {
    left: 1,
    top: 1,
    bottom: 1,
    right: 1,
    controlled: 1.3,
}
const baseObjectVelocity = {
    x: 70,
    y: 70,
    maxX: 250,
    maxY: 250
};

const clampTo30Fps = (frameData: IFrameData) => {
    if (frameData.deltaTime > (1 / 30)) {
        frameData.deltaTime = 1 / 30;
    }
    return frameData;
}

const clampTo60Fps = (frameData: IFrameData) => {
    if (frameData.deltaTime > (1 / 60)) {
        frameData.deltaTime = 1 / 60;
    }
    return frameData;
}

const runBoundaryCheck = (obj: any, boundaries: { top: number, right: number, bottom: number, left: number }, controlled): string => {
    let boundaryHit = '';
    if (obj.x + obj.width > boundaries.right) {
        boundaryHit = 'right';
        //obj.velocity.x *= - bounceRateChanges.right;
        obj.x = boundaries.right - obj.width;
    } else if (obj.x < boundaries.left) {
        //obj.velocity.x *= -bounceRateChanges.left;
        boundaryHit = 'left';
        obj.x = boundaries.left;
    }
    if ((controlled.x < obj.x + obj.width) && (controlled.x + controlled.width > obj.x) && (controlled.y <= obj.y + obj.height)) {
        boundaryHit = 'controlled';
        obj.y = controlled.y - obj.height;
        console.log("hit controlled and y is: ", typeof obj.y);
    } else if (obj.y + obj.height >= boundaries.bottom) {
        //obj.velocity.y *= -bounceRateChanges.bottom;
        boundaryHit = 'bottom';
        obj.y = boundaries.bottom - obj.height;
    } else if (obj.y < boundaries.top) {
        //obj.velocity.y *= -bounceRateChanges.top;
        boundaryHit = 'top';
        obj.y = boundaries.top;
    }
    return boundaryHit;
};
const clampMag = (value: number, min: number, max: number) => {
    let val = Math.abs(value);
    let sign = value < 0 ? -1 : 1;
    if (min <= val && val <= max) {
        return value;
    }
    if (min > val) {
        return sign * min;
    }
    if (max < val) {
        return sign * max;
    }
};


const updateGameState = (deltaTime: number, state: any, inputState: any, component: any): any => {
    //console.log("Input State: ", inputState);
    if (state['objects'] === undefined) {
        state['objects'] = [
            {
                // Transformation Props
                x: 10, y: 10, width: 10, height: 10,
                // State Props
                isPaused: false, toggleColor: '#FF0000', color: '#000000',
                // Movement Props
                velocity: baseObjectVelocity,
                controlled: false 
            },
            {
                // Transformation Props
                x: 200 - 50/2, y: 290, width: 50, height: 2,
                // State Props
                isPaused: false, toggleColor: '#00FF00', color: '#0000FF',
                // Movement Props
                velocity: { x: -baseObjectVelocity.x, y: 2 * baseObjectVelocity.y },
                controlled: true,
            }
        ];
    } else {

        state['objects'].forEach((obj) => {
            // Process Inputs
            if (inputState['spacebar']) {
                obj.isPaused = !obj.isPaused;
                let newColor = obj.toggleColor;
                obj.toggleColor = obj.color;
                obj.color = newColor;
            }

            // Process GameLoop Updates
            if (!obj.isPaused) {

                if (obj.controlled) {
                    if (inputState['right_arrow']) {
                        obj.x = obj.x += 10
                        obj.x = obj.x + obj.width < boundaries.right ? obj.x : boundaries.right - obj.width;
                    } else if (inputState['left_arrow']) {
                        obj.x = obj.x -= 10
                        obj.x = obj.x > boundaries.left ? obj.x : boundaries.left;
                    }
                } else {
                    // Apply Velocity Movements
                    obj.x = obj.x += obj.velocity.x * deltaTime; // px/s * s = px
                    obj.y = obj.y += obj.velocity.y * deltaTime;
    
                    // Check if we exceeded our boundaries
                    const didHit = runBoundaryCheck(obj, boundaries, state['objects'].find(obj => obj.controlled === true));
                    // Handle boundary adjustments
                    if (didHit) {
                        if (didHit === 'right' || didHit === 'left') {
                            obj.velocity.x *= -bounceRateChanges[didHit];
                        } else if (didHit === 'top' || didHit === 'controlled') {
                            obj.velocity.y *= -bounceRateChanges[didHit];
                            component.setState((state) => ({
                                points: state.points + 1,
                            }))
                        } else if (didHit === 'bottom') {
                            component.setState({
                                gameOver: true
                            }); 
                        }
                    }
                }
            }

            // Clamp Velocities in case our boundary bounces have gotten
            //  us going tooooo fast.
            obj.velocity.x = clampMag(obj.velocity.x, 0, baseObjectVelocity.maxX);
            obj.velocity.y = clampMag(obj.velocity.y, 0, baseObjectVelocity.maxY);
        });
    }

    return state;
}


const render = (state: any, gameArea: HTMLCanvasElement) => {
    const ctx: CanvasRenderingContext2D = gameArea.getContext('2d');
    ctx.clearRect(0, 0, gameArea.clientWidth, gameArea.clientHeight);

    state['objects'].forEach((obj) => {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    })
}


const calculateStep: (prevFrame: IFrameData) => any = (prevFrame: IFrameData) => { // any = Observable<IFrameData>
    return Observable.create((observer) => {
        requestAnimationFrame((frameStartTime) => {
            const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
            observer.next({
                frameStartTime,
                deltaTime
            });
        });
    })
    .pipe(
        map(clampTo60Fps)
    );
}



export default class RXJSGame extends React.Component<any, any> {
    gameAreaRef: RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();
    fpsRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    gameArea: HTMLCanvasElement;
    fps: any;
    frames$: any;
    keysDown$: any;
    keysDownPerFrame$: any;
    gameState$: any;
    gameSubscription: any;
    frameRateSubscription: any;


    constructor(props) {
        super(props);
        this.state = {
            points: 0,
            gameOver: false,
        }
    }


    startGame = () => {
        this.setState({
            points: 0
        });
        
        this.gameSubscription = this.frames$
            .pipe(
                withLatestFrom(this.keysDownPerFrame$, this.gameState$),
                map(([deltaTime, keysDown, gameState]) => updateGameState(deltaTime, gameState, keysDown, this)),
                // tap((gameState) => console.log("game state: ", gameState)),
                tap((gameState) => this.gameState$.next(gameState)) // here we update the value which will be used by withLatestFrom()
            )
            .subscribe((gameState) => {
                render(gameState, this.gameArea);
            });

        // Average every 10 Frames to calculate our FPS
        this.frameRateSubscription = this.frames$
            .pipe(
                bufferCount(10),
                map((frames: number[]) => {
                    const total = frames
                        .reduce((acc, curr) => {
                            acc += curr;
                            return acc;
                        }, 0);

                    return 1 / (total / frames.length);
                })
            ).subscribe((avg) => {
                this.fps.innerHTML = Math.round(avg) + '';
            });
    };

    restartGame = () => {
        if (this.gameSubscription) {
            this.gameSubscription.unsubscribe();
            this.frames$
            this.setState({
                points: 0
            });
            this.startGame();
        }
    }   

    stopGame = () => {
        if (this.frameRateSubscription) {
            this.frameRateSubscription.unsubscribe();
        }
        if (this.gameSubscription) {
            this.gameSubscription.unsubscribe();
        }
    }


    componentDidMount() {
        this.gameArea = this.gameAreaRef.current;
        this.fps = this.fpsRef.current; 

        this.frames$ = of(undefined)
        .pipe(
            expand((val) => calculateStep(val)), // used to recursivly call calculateStep, passing the previous value to the next calculation
            // Expand emits the first value provided to it, and in this
            //  case we just want to ignore the undefined input frame
            filter(frame => frame !== undefined),
            map((frame: IFrameData) => frame.deltaTime),
            share()
        );

        this.keysDown$ = fromEvent(document, 'keydown')
            .pipe(
                map((event: KeyboardEvent) => {
                    const name = KeyUtil.codeToKey('' + event.keyCode);
                    if (name !== '') {
                        let keyMap = {};
                        keyMap[name] = event.code;
                        return keyMap;
                    } else {
                        return undefined;
                    }
                })
            );

        this.keysDownPerFrame$ = this.keysDown$
            .pipe(
                buffer(this.frames$),
                map((frames: Array<any>) => {
                    return frames.reduce((acc, curr) => {
                        return Object.assign(acc, curr)
                    }, {});
                })
            );

        this.gameState$ = new BehaviorSubject({}); // whenever one subscribes the current value is emitted (only has one value at any given time)

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div id="game">
                <canvas ref={this.gameAreaRef} style={{border: "1px solid #00FFFF"}} width="400px" height="300px">

                </canvas>
                <div ref={this.fpsRef}>
                </div>
                <p>Points: {this.state.points}</p>
                <p>{this.state.gameOver ? 'GAME OVER LOOSER!' : ''}</p>
                <button onClick={this.startGame}>Start Game</button>
                <button onClick={this.restartGame}>Restart Game</button>
                <button onClick={this.stopGame}>Stop Game</button>
            </div>
        )
    }
}


