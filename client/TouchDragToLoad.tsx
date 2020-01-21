import React from 'react';
import { map, takeUntil, tap, exhaustMap } from 'rxjs/operators';
import { Observable, concat, fromEvent } from 'rxjs';
import { RefObject } from 'react';


export default class TouchDragToLoadFeed extends React.Component<any, any> {
    containerRef: RefObject<HTMLDivElement>;
    touchStart$: any;
    touchEnd$: any;
    touchMove$: any;
    touchDrag$: any;
    moveHome$: any;
    _pos: any;
    apiKey: string;

    constructor(props) {
        super(props);
        this.apiKey = 'ca482b905b5040ab86691ee604964869';
        this.containerRef = React.createRef();
    }

    getNews(q: string): Promise<any> {
        const url = `https://newsapi.org/v2/everything?q=${q}&from=2020-01-12&sortBy=popularity&apiKey=${this.apiKey}`;

        const req = new Request(url);

        return fetch(req)
            .then(response => response.json());
    }

    componentDidMount() {
        // create observabels:
        if (!this.containerRef.current) return;
        this.touchStart$ = fromEvent(this.containerRef.current, 'touchstart');
        this.touchEnd$ = fromEvent(this.containerRef.current, 'touchend');
        this.touchMove$ = fromEvent(this.containerRef.current, 'touchmove'); 
        // this.moveHome$ = // some animation


        // Make new observable
        /*
        this.touchDrag$ = this.touchStart$.pipe(
            exhaustMap((start: TouchEvent) => concat(
                this.touchMove$.pipe(
                    map((move: TouchEvent) => move.touches[0].pageY - start.touches[0].pageY),
                    takeUntil(this.touchEnd$),
                    tap(p => this._pos = p),
                ),
                this.moveHome$,
            ),
            tap(y => {
                if (y > window.innerHeight / 2) this.refresh.emit();
            })
        ));
        
        // Subscribe to observable
        const touchDragSubscription = this.touchDrag$.subscribe();
        */
                    
    }

    componentWillUnmount() {
        // unsubscribe from observable

    }

    render() {
        return (
            <div className="feed__container" ref={this.containerRef}>
                
            </div>
        )
    }
}

