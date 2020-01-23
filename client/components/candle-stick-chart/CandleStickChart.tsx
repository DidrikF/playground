import React, { RefObject } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

import { interval, fromEvent, of } from 'rxjs';
import {sample, takeUntil, concatAll, map, throttleTime, pluck, mapTo, expand, take, delay, switchMap, tap, reduce, pairwise} from 'rxjs/operators';


export interface PriceData {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    date: Date;
}

export interface CandleStickChartConfig {
    priceBadgeColor: string;
    candleBodyColorUp: string;
    candleBodyColorDown: string;
    candleBodyColorMissing: string;
    candleStemColorUp: string;
    candleStemColorDown: string;
    chartGridColor: string;
    chartGridColorHighlight: string;
    chartAxisColor: string;
    
}

export interface CandleStickChartProps {
    data: PriceData[];
    config?: CandleStickChartConfig;
}

export interface CandleStickChartState {

}


export default class CandleStickChart extends React.Component<CandleStickChartProps, CandleStickChartState> {
    timeObservable: any;
    dataSubscription: any;
    dragObservable: any;
    dragSubscription: any;
    scrollObservable: any;
    scrollSubscription: any;

    chartContainerRef: RefObject<HTMLDivElement>;
    chartRef: RefObject<SVGSVGElement>;
    chartWidth: number | string;
    chartHeight: number | string;
    chart: d3.Selection<SVGSVGElement, Date, HTMLElement, Date>;

    startDate: Date;
    endDate: Date;

    selectedData: PriceData[];

    static defaultProps = {
        config: {
            priceBadgeColor: '#56AFDB',
            candleBodyColorUp: '#8CC176',
            candleBodyColorDown: '#B82C0C',
            candleBodyColorMissing: '303030',
            candleStemColorUp: '303030',
            candleStemColorDown: '303030',
            chartGridColor: '909090',
            chartGridColorHighlight: '292929',
            chartAxisColor: '292929',
        }
    }


    constructor(props) {
        super(props); 
        this.state = {
            
        }
        this.chartWidth = document.body.clientWidth;
        this.chartHeight = document.body.clientHeight;

        this.startDate = new Date('2015-01-01');
        this.endDate = new Date('2015-12-31');

        this.chartContainerRef = React.createRef<HTMLDivElement>();
        this.chartRef = React.createRef<SVGSVGElement>();
    } 

    resizeChart = () => {
        this.chartWidth = document.body.clientWidth;
        this.chartHeight = document.body.clientHeight;
        this.chart.attr('width', this.chartWidth).attr('height', this.chartHeight);
        
        this.updateChart();
    }


    handeZoom = (zoomAmount: any) => {
        if (zoomAmount > 0) {
            this.startDate = moment(this.startDate).subtract(1, 'months').toDate();
            this.endDate = moment(this.endDate).add(1, 'months').toDate();
        } else if (zoomAmount <= 0) {
            this.startDate = moment(this.startDate).add(1, 'months').toDate();
            this.endDate = moment(this.endDate).subtract(1, 'months').toDate();
        }
        this.updateChart();
    }

    handleDrag = (dragDistances: any) => {
        // how to make this smooth?


        this.updateChart();
    }

    updateChart = () => {
        

        
    }


    addEventListenerToStopMouseScroll = () => {
        document.addEventListener('wheel', this.stopMouseScroll, {passive: false});
    }

    addEventListenerToStartMouseScroll = () => {
        document.removeEventListener('wheel', this.stopMouseScroll);
    }

    stopMouseScroll(event: MouseWheelEvent) {
        event.preventDefault();
    }

    componentDidMount() {
        this.chart = d3.select('#chart');
        this.resizeChart();

        this.timeObservable = interval(1000);
        this.dataSubscription = this.timeObservable.subscribe(this.updateChart)
        
        const mouseDown$ = fromEvent(this.chartContainerRef.current, 'mousedown');
        const mouseUp$ = fromEvent(this.chartContainerRef.current, 'mouseup');
        const mouseDrag$ = fromEvent(this.chartContainerRef.current, 'mousemove');

        this.dragObservable = mouseDown$.pipe(
            map((event: MouseEvent) => ({
                xStart: event.clientX,
                yStart: event.clientY
            })),
            switchMap((startCoordinates: any) => {
                return mouseDrag$.pipe(
                    takeUntil(mouseUp$),
                    pairwise(),
                    map(([lastDragEvent, currDragEvent]) => {
                        return {
                            xDiff: (currDragEvent as MouseEvent).clientX - (lastDragEvent as MouseEvent).clientX,
                            yDiff: (currDragEvent as MouseEvent).clientY - (lastDragEvent as MouseEvent).clientY
                        }
                    })
                );
            })
        )
        this.dragSubscription = this.dragObservable.subscribe(this.handleDrag);
        
        const mouseEnter$ = fromEvent(this.chartContainerRef.current, 'mouseenter');
        const mouseLeave$ = fromEvent(this.chartContainerRef.current, 'mouseleave')
        const mousewheel$ = fromEvent(window.document, 'wheel');

        this.chartContainerRef.current.addEventListener('mouseenter', this.addEventListenerToStopMouseScroll);
        this.chartContainerRef.current.addEventListener('mouseleave', this.addEventListenerToStartMouseScroll);

        this.scrollObservable = mouseEnter$.pipe(
            switchMap(() => mousewheel$.pipe(
                takeUntil(mouseLeave$),
                map((event: MouseWheelEvent) => {
                    return Math.sign(event.deltaY);
                })
            ))

        )
        this.scrollSubscription = this.scrollObservable.subscribe(this.handeZoom);
    }

    componentWillUnmount() {
        this.chartContainerRef.current.removeEventListener('mouseenter', this.addEventListenerToStopMouseScroll);
        this.chartContainerRef.current.removeEventListener('mouseleave', this.addEventListenerToStartMouseScroll);
        window.removeEventListener('wheel', this.stopMouseScroll);

        this.unsubscribe();
    }

    unsubscribe = () => {
        this.dataSubscription.unsubscribe();
        this.dragSubscription.unsubscribe();
        this.scrollSubscription.unsubscribe();
    }
    
    render() {
       return (
            <>
                <div ref={this.chartContainerRef} id="chart-container">
                    <svg id='chart' ref={this.chartRef}></svg>
                </div>
                <div style={{height: "500px"}}>

                </div>
            </>
       ) 
    }
}