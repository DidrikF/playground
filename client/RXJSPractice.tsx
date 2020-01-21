import React, { RefObject } from 'react';

import { interval, fromEvent, of } from 'rxjs';
import {sample, takeUntil, concatAll, map, throttleTime, pluck, mapTo, expand, take, delay} from 'rxjs/operators';

export default class RXJSPractice extends React.Component<any, any> {
    subscription: any;
    containerRef: RefObject<HTMLDivElement>;

    constructor(props) {
        super(props); 
        this.state = {
            values: []
        }
        this.containerRef = React.createRef<HTMLDivElement>();
    } 

    unsubscribe() {
        this.subscription.unsubscribe();
    }

    componentDidMount() {
        /** Stream of incrementing values, once per second */
        const source = interval(1000);
        const example = source.pipe(sample(interval(1000)));
        this.subscription = example.subscribe(val => {
            this.setState((state) => ({
                values: [...state.values, val]
            }));
        });


        /** Click Stream with throttling */
        const clickObservable = fromEvent(window, 'click')
            .pipe(
                throttleTime(5000),
                pluck('clientX')
            );
        const clickSubscription = clickObservable.subscribe((e: MouseEvent) => {
            console.log('click position: ', e);
        })

        /** expand() example */
        const clicks = fromEvent(document, 'click');
        const powersOfTwo = clicks
            .pipe(
                mapTo(1),
                expand(x => of(2 * x).pipe(delay(100))),
                take(10),
            );
        powersOfTwo.subscribe(x => console.log(x));


        /** Drag Element In Container */
        const moveMe = document.getElementById('move-me');
        const moveMeContainer = document.getElementById('move-me-container');
        const mouseDowns = fromEvent(moveMe, 'mousedown');
        const mouseUps = fromEvent(moveMeContainer, 'mouseup');
        const mouseMoves = fromEvent(moveMeContainer, 'mousemove')
    
        const moveMeMouseDrags = mouseDowns.pipe(
            map((mouseDownEvent: MouseEvent) => {
                console.log(mouseDownEvent);
                const offsetX = mouseDownEvent.offsetX;
                const offsetY = mouseDownEvent.offsetY; // how to use these?
                return mouseMoves.pipe(
                    takeUntil(mouseUps),
                    map((moveEvent: DragEvent) => {
                        moveEvent['xpos'] = moveEvent.pageX - offsetX;
                        moveEvent['ypos'] = moveEvent.pageY - offsetY;
                        return moveEvent;
                    })
                );
            }),
            // takeUntil here ?
            concatAll()
        )
    
        moveMeMouseDrags.subscribe((moveEvent: any) => {
            moveMe.style.left = moveEvent.xpos + 'px';
            moveMe.style.top = moveEvent.ypos + 'px';
        });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }
    
    render() {
       return (
           <div ref={this.containerRef}>
               <div 
                    id='move-me-container'
                    style={{
                        width: "500px",
                        height: "500px",
                        border: "1px solid gray",
                        position: "relative",
                    }}
                >
                    <span id="move-me" style={{border: "1px solid blue", cursor: "pointer", position: "fixed"}}>Move me</span>
                    <span id="enemy" style={{border: "1px solid blue", cursor: "pointer", position: "fixed"}}>Enemy</span>
                </div>
               <ul>
                   { this.state.values.map(val => (
                       <li key={val}>{val}</li>
                   ))}
               </ul>
           </div>
       ) 
    }
}