import React from 'react';
import { fromEvent } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';


export default class Animations extends React.Component<any, any> {


    componentDidMount() {
        const docElm = document.documentElement;
        const cardElm: HTMLDivElement = document.querySelector('#card');
        const titleElm = document.querySelector('#title');

        const { clientWidth, clientHeight } = docElm;

        // Stream of all mousemove events
        const mouseMove$ = fromEvent(docElm, 'mousemove');
        const mouseDown$ = fromEvent(docElm, 'mousedown');
        const mouseUp$ = fromEvent(docElm, 'mouseup');
        
        const mouseDrag$ = mouseDown$.pipe(
            switchMap(() => mouseMove$.pipe(
                // map(() => console.log("switchmap")),
                takeUntil(mouseUp$)
            )),
            map((event: MouseEvent) => ({
                x: event.clientX,
                y: event.clientY
            }))
        );

        // Apply values to styles
        mouseDrag$.subscribe(pos => {
            const rotX = (pos.y / clientHeight * -50) + 25;
            const rotY = (pos.x / clientWidth * 50) - 25;
            
            cardElm.style.cssText = `
                transform: rotateX(${rotX}deg) rotateY(${rotY}deg);
            `;
        });
    }

    render() {
        return (
            <div id="card">
                <div id="title"></div>
            </div>
        )
    }
}
