import React, { RefObject } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import * as axios from 'axios';

import { interval, fromEvent, of } from 'rxjs';
import {sample, takeUntil, concatAll, map, throttleTime, pluck, mapTo, expand, take, delay, switchMap, tap, reduce, pairwise} from 'rxjs/operators';
import { scaleLinear } from 'd3';
import scale, { scaleTime } from 'd3-scale';


export interface PriceData {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    date: Date;
}

export interface Margin {
    top: number;
    bottom: number; 
    left: number; 
    right: number;
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
    margin: Margin;
}

export interface CandleStickChartProps {
    data: PriceData[] | string;
    config?: CandleStickChartConfig;
}

export interface CandleStickChartState {
    data: PriceData[];
}


function addEventListenerToStopMouseScroll() {
    document.addEventListener('wheel', this.stopMouseScroll, {passive: false}); // Might not be sufficient in all browsers.
}

function addEventListenerToStartMouseScroll() {
    document.removeEventListener('wheel', this.stopMouseScroll);
}

function stopMouseScroll(event: MouseWheelEvent) {
    event.preventDefault();
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
    chartWidth: number;
    chartHeight: number;
    chart: d3.Selection<SVGSVGElement, Date, HTMLElement, Date>;

    startDate: Date;
    endDate: Date;

    selectedData: PriceData[];

    static defaultProps: Partial<CandleStickChartProps> = {
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
            margin: {
                top: 20,
                bottom: 60,
                left: 60,
                right: 20,
            },
        }
    }


    constructor(props) {
        super(props); 

        const margin = props.config.margin;
        // Should this be the width and height of an inner group element, where all shapes are drawn?
        // Are there groups in canvas? 
        this.chartWidth = document.body.clientWidth - margin.left - margin.right;
        this.chartHeight = document.body.clientHeight - margin.top - margin.bottom;

        this.chartContainerRef = React.createRef<HTMLDivElement>();
        this.chartRef = React.createRef<SVGSVGElement>();
    } 

    resizeChart = () => {

    }

    handeZoom = (zoomAmount: any) => {

    }

    handleDrag = (dragDistances: any) => {

    }


    updateChart() {
        // NOTE: unique ID can be a combination of ticker and date
        const startTime = this.startDate.getTime();
        const endTime = this.endDate.getTime();

        this.selectedData = this.state.data.filter((priceData) => {
            const time = priceData.date.getTime();
            return (time >= startTime && time <= endTime);
        });

        const data = this.state.data;
        const data0 = data[0];
        const date0 = data0.date;

        const width = document.body.clientWidth;
        const height = width * 9/16;
        const margin = {top: 40, right: 40, bottom: 40, left: 40};

        const x = d3.scaleBand()
            .domain(d3.timeDay // WTF, god damn
                .range(date0, date0)
                .filter(d => d.getDay() !== 0 && d.getDay() !== 6))

        const xAxis = g => g
            .attr('transform', `translate(${margin.left}, ${height - margin.bottom}`)
            .call(d3.axisBottom(x))


        this.chart = d3.select('#chart-svg');

        this.chart.append('g').call(xAxis);
        this.chart.append('g').call(yAxis);

        this.draw()
    }

    draw() {

    }

    setData() {
        if (typeof this.props.data === 'string') {
            fetch('/apple-price-data.json')
                .then(response => {
                    return response.json();
                }).then(priceData => {
                    const parsedPriceData = priceData.map((el) => {
                        const newEl = {};
                        newEl['date'] = new Date(el.date);
                        newEl['open'] = parseFloat(el.open);
                        newEl['high']= parseFloat(el.high);
                        newEl['low'] =parseFloat(el.low);
                        newEl['close'] = parseFloat(el.close);
                        newEl['volume'] = parseInt(el.volume, 10);
                        return newEl as PriceData;
                    })
                    
                    this.setState({
                        data: parsedPriceData
                    }, this.updateChart);    
                });
        } else {
            this.setState({
                data: this.props.data
            }, this.updateChart);
        }
    }

    componentDidMount() {
        this.setData();
    }

    componentWillUnmount() {
        this.chartContainerRef.current.removeEventListener('mouseenter', addEventListenerToStopMouseScroll);
        this.chartContainerRef.current.removeEventListener('mouseleave', addEventListenerToStartMouseScroll);
        window.removeEventListener('wheel', stopMouseScroll);
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
                <div id='canvas-container'>
                    <svg id='chart-svg'></svg>
                    <canvas id="chart-canvas"></canvas>
                </div>
            </>
       );
    }
}



