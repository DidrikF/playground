

    resizeChart = () => {
        const { margin } = this.props.config;
        this.chartWidth = document.body.clientWidth - margin.left - margin.right;
        this.chartHeight = document.body.clientHeight - margin.top - margin.bottom;
        
        this.chart
            .attr('width', this.chartWidth)
            .attr('height', this.chartHeight);

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



// Variable declarations and setup
const margin = this.props.config.margin;
const data = this.selectedData.slice(0, 40);
d3.namespaces['custom'] = "https://d3js.org/namespace/custom";

// Scales
const minPrice = 0 // data.reduce((lowest, curr) => curr.low < lowest ? curr.low : lowest, Infinity)
const maxPrice = data.reduce((highest, curr) => curr.high > highest ? curr.high : highest, -Infinity)
const minDate = new Date(data.reduce((lowest, curr) => curr.date.getTime() < lowest ? curr.date.getTime() : lowest, Infinity)) 
const maxDate = new Date(data.reduce((highest, curr) => curr.date.getTime() > highest ? curr.date.getTime() : highest, -Infinity))
console.log("extreme prices: ", minPrice, maxPrice)
console.log("dates: ", minDate, maxDate)

const yScale = scaleLinear()
    .domain([minPrice, maxPrice])
    .range([margin.top, margin.top + this.chartHeight])

const xScale = scaleTime()
    .domain([minDate, maxDate])
    .range([margin.left, margin.left + this.chartWidth])




const dataBucket = d3.select('body').append('custom:databucket')
    .attr('width', this.chartWidth)
    .attr('height', this.chartHeight)
    .attr('fillStyle', 'gray')
console.log("databucket: ", dataBucket)

const boundData = dataBucket.selectAll('rect').data(data)

boundData
    .enter()
    .append('custom:rect')
    .attr('x', (d) => xScale(d.date))
    .attr('y', (d, i) => {
        const yTop = d.open > d.close ? d.open : d.close;
        return yScale(yTop)
    })
    .attr('height', (d) => {
        const height = Math.abs(d.open - d.close)
        // console.log("data in height calc: ", d,height, yScale(height))
        return yScale(height)
    })
    .attr('width', 10)
    .attr('fillStyle', (d) => {
        if (d.close >= d.open) {
            return this.props.config.candleStemColorUp;
        } else {
            return this.props.config.candleBodyColorDown;
        }
    })

draw(dataBucket)

function draw(selection) {
    selection.each(function () {
        const root = this,
            canvas = root.parentNode.appendChild(document.createElement('canvas')),
            context = canvas.getContext('2d')

        // console.log("Root: ", root, root.parentNode, context)

        canvas.style.position = 'absolute';
        canvas.style.background = dataBucket.attr('fillStyle')
        canvas.style.top = '20px' // root.offsetTop + "px"
        canvas.style.left = '20px' // root.offsetLeft + 'px';
        canvas.width = parseInt(root.getAttribute('width'), 10) - 40;
        canvas.height = parseInt(root.getAttribute('height'), 10) - 40;
        
        /*
        d3.timer(redraw);

        function redraw() {
            canvas.width = root.getAttribute('width');
            canvas.height = root.getAttribute('height');
            for (let child = root.firstChild; child; child = child.nextSibling) {
                draw(child);
            }
        }
        */
        console.log("root.firstChild", root.firstChild)
        for (let child = root.firstChild; child; child = child.nextSibling) {
            // console.log("child: ", child)
            // console.log("child.nextSibling: ", child.nextSibling)
            drawElement(child);
        }

        function drawElement(element) {
            switch (element.tagName) {
                case 'circle': {
                    context.strokeStyle = element.getAttribute('strokeStyle');
                    context.beginPath();
                    context.rect(element.getAttribute('x'), element.getAttribute('y'), element.getAttribute('radius'), 0, 2 * Math.PI);
                    context.stroke();
                    break;
                } case 'rect': {
                    // console.log('draw rect is called')
                    context.fillStyle = element.getAttribute('fillStyle')
                    // console.log("context in drawElement: ", context)
                    context.beginPath();
                    context.fillRect(element.getAttribute('x'), element.getAttribute('y'), element.getAttribute('width'), element.getAttribute('height'));
                    context.stroke();
                    context.closePath()
                    break;
                }
            }
        }
    })
}

/*    
const canvasContainer = d3.select("#canvas-container");

const chart = canvasContainer.append("canvas")
    .attr("width", 700)
    .attr("height", 400);

const context = chart.node().getContext('2d');

const detachedContainer = document.createElement('custom');

d3.select("body").append("custom:sketch")
    .attr("width", width)
    .attr("height", height)
    .call(custom);

const dataContainer = d3.select(detachedContainer);

const dataBinding = dataContainer.selectAll('custom.rect')
    .data(data, (d: any) => d)

dataBinding
    .attr('size', 15)
    .attr('fillStyle', 'green')

dataBinding.enter()
    .append('rect')
    .attr('x', xScale as any)
    .attr('y', yScale)
    .attr('size', 8)
    .attr('fillStyle', 'red')

dataBinding.exit()
    .attr('size', 5)
    .attr('fillStyle', 'lightgray')

console.log(dataBinding)

// Draw canvas
// clear canvas
context.fillStyle = "#fff";
context.rect(0, 0, parseInt(chart.attr("width"), 10), parseInt(chart.attr("height"), 10));
context.fill();

const elements = dataContainer.selectAll('custom.rect')
elements.each(function(d) {
    const node = d3.select(this);
    context.beginPath();
    context.fillStyle = node.attr('fillStyle');
    context.rect(
        parseInt(node.attr('x'), 10), 
        parseInt(node.attr('y'), 10), 
        parseInt(node.attr('size'), 10), 
        parseInt(node.attr('size'), 10)
    )
    context.closePath();
})
*/



/*

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
*/



