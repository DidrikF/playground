
import React, {FC, useEffect, useLayoutEffect, useRef} from 'react';
import * as d3 from 'd3';


const phoneWidth = 400;
const phoneHeight = 600;
const margin = 10;
const screenWidth = phoneWidth - 2*margin;
const screenHeight = phoneHeight - 2*margin; 
const navigationHeight = 60;
const tabWidth = 76
const navXOrigin = -screenWidth;

export type PhoneProps = {
    
}

const spring = (x: number): number => {
    return  -0.5 * Math.pow(2.71828, -6*x) * (-2 * Math.pow(2.71828, 6*x) + Math.sin(12 * x) + 2 * Math.cos(12 * x));
}

const animate = (
    el: SVGSVGElement, 
    from: number, 
    to: number, 
    duration: number, 
    timingFunc: (x: number) => number
) => {
    let elapsedTime = 0;
    let prevTime;
    const animationFunc = (newTime) => {
        if (!prevTime) prevTime = newTime;
        const diff = newTime - prevTime;
        prevTime = newTime;
        elapsedTime += diff;
        const progress = elapsedTime/duration;
        let nextX = from + (to-from) * timingFunc(progress);

        el.style.transform = `translateX(${nextX}px)`
        if (progress < 1) {
            window.requestAnimationFrame(animationFunc)
        }
    };

    window.requestAnimationFrame(animationFunc);
}


export const Phone: FC<PhoneProps> = ({}) => {

    const outlineRef = useRef<SVGSVGElement>(null);
    const filterRef = useRef<SVGSVGElement>(null);


    const drawNavOutline = (ctx) => {
        ctx.moveTo(0, 0);
        ctx.lineTo(screenWidth, 0);
        ctx.bezierCurveTo(screenWidth+tabWidth/4, 0, screenWidth, 50, screenWidth+tabWidth/2, 50);
        ctx.bezierCurveTo(screenWidth+tabWidth, 50, screenWidth+tabWidth*3/4, 0, screenWidth+tabWidth, 0);
        ctx.lineTo(2*screenWidth+tabWidth, 0);
        ctx.lineTo(2*screenWidth+tabWidth, 60);
        ctx.lineTo(0, 60);
        ctx.lineTo(0, 0);
        ctx.closePath();
        return ctx;
    }

    const animateToTab = (tabNr: number) => {
        const tabXPos = navXOrigin + tabWidth * tabNr;
        const rect = outlineRef.current.getBoundingClientRect();
        const currXPos = rect.x;
        animate(outlineRef.current, currXPos, tabXPos, 500, spring)
        // animate(filterRef.current, currXPos, tabXPos, 500, spring)
    }

    const goToTab = (tabNr: number) => {
        const tabXPos = navXOrigin + tabWidth * tabNr;
        outlineRef.current.style.transform = `translateX(${tabXPos}px)`;
        filterRef.current.style.transform = `translateX(${tabXPos}px)`;
    }


    const outlinePathCtx = d3.path();
    const filterPathCtx = d3.path();

    useEffect(() => {
        const outlineContainer = d3.select('.phone__nav-overlay')
            .attr('width', 2*screenWidth+tabWidth)
            .attr('height', navigationHeight)

        const filterContainer = d3.select('.phone__nav-filter')
            .attr('width', 2*screenWidth+tabWidth)
            .attr('height', navigationHeight)

        // filterContainer.append('filter')
        // svg filter... 

        const outline = outlineContainer.append('path')
            .attr('d', drawNavOutline(outlinePathCtx).toString())
            .attr('fill', 'white');
        /*
        const filter = filterContainer.append('path')
            .attr('d', drawNavOutline(filterPathCtx).toString())
            .attr('class', 'phone__nav-filter')
        */    
    }, [])

    useLayoutEffect(() => {
        goToTab(0);
    }, [])

    return (
        <div className='phone__container'>
            <div className='phone__screen'>

                <div className='phone__nav'>
                    <svg className='phone__nav-overlay' ref={outlineRef}></svg>
                    <svg className='phone__nav-filter' ref={filterRef}></svg>

                    
                    <div className='phone__nav-gird-item' onClick={() => animateToTab(0)}>
                        <i className='material-icons nav-icon'>
                            brightness_high
                        </i>
                    </div>
                    <div className='phone__nav-gird-item' onClick={() => animateToTab(1)}>
                        <i className='material-icons nav-icon'>
                            brightness_high
                        </i>
                    </div>
                    <div className='phone__nav-gird-item' onClick={() => animateToTab(2)}>
                        <i className='material-icons nav-icon'>
                            brightness_high
                        </i>
                    </div>
                    <div className='phone__nav-gird-item' onClick={() => animateToTab(3)}>
                        <i className='material-icons nav-icon'>
                            brightness_high
                        </i>
                    </div>
                    <div className='phone__nav-gird-item' onClick={() => animateToTab(4)}>
                        <i className='material-icons nav-icon'>
                            brightness_high
                        </i>
                    </div>
                </div>
            </div>
        </div>
    )
}
