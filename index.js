window.draw = function (str, id) {
  const data = JSON.parse(str)
  //console.log(data)
  let W = parseInt(d3.select(id).style('width'))
  console.log(W)
  let H = 400
  let margin = {
    top: 30,
    left: 60,
    right: 300,
    bottom: 30
  }
  
  var zoom = d3.zoom().scaleExtent([1,2])
  //.translateExtent([[0, 0], [W, H]])
  .extent([[W, H-700], [W, H]])
  //.constrain([0,0],[W,H])
  .on("zoom", function () {
    svg.attr("transform", d3.event.transform)
  })
  
  let maxBinsW = 60
  let rightW = 200-50
  let svg = d3.select('#app').append('svg').attr('width', W).attr('height', H).call(responsivefy).call(zoom)
  .on("mousedown.zoom", null)
  .on("touchstart.zoom", null)
  .on("touchstart.end",null)
  .on("touchmove.zoom", null)
  .on("touchend.end", null)
  .on("touchcancel.end",null)
  .append('g')

// svg.call(zoom)

  //zoom
  //svg.call(zoom)
var zooms = svg.append('g')
//var buttong = zooms.append('g')

zooms.append("rect")
.classed("zoom-in", true)
.attr("id","button")
.attr("width","30")
.attr("height","25")
.attr('x',W-100-30)
.attr('y',H-360-8)
.style('fill',"#ccc")
.style("opacity","0.5")
.style("stroke-width","1")
.style('stroke',"black")
.on("click", function() {
  zoom.scaleBy(svg, 1.5);
})
;

zooms.append("text")
 .classed("zoom-in", true)
 .text("+")
 .attr('x',W-100+7-30)
 .attr('y',H-340-8)
 .style('font-size','25px')
 .style('pointer-events',"none")
 .style("font-family","sans-serif")
 .style("fill","#ccc")
 .on("click", function() {
   zoom.scaleBy(svg, 1.5);
 });

 zooms.append("rect")
 .classed("zoom-out", true)
 .attr("width","30")
 .attr("height","25")
 .attr('x',W-50)
 .attr('y',H-360-8)
 .style("opacity","0.5")
 .style('fill',"#ccc")
 .style("stroke-width","1")
 .style('stroke',"black")
 .on("click", function() {
   zoom.scaleBy(svg, 0.5);
 });
 
zooms.append("text")
 .classed("zoom-out", true)
 .text("-")
 .attr('x',W-50+8)
 .attr('y',H-340-8)
 .style('pointer-events',"none")
 .style("fill","#ccc")
 .style('font-size','25px')
 .style("font-family","sans-serif")
 .on("click", function() {
   zoom.scaleBy(svg, 0.5);
 })

//zoom

  let timeArr = data.x.concat(data.predx)
  let valueArr = data.y.concat(data.predy)
  //console.log(valueArr)
/*
  var div = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

  var div2 = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);
*/
  let bgRect = svg.append('rect').attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', W - margin.left - margin.right + rightW)
    .attr('height', H - margin.bottom - margin.top)
    .attr('class', 'bg-rect')

    let xScale = d3.scaleTime()
    // .domain(timeArr)
    .domain(d3.extent(timeArr, (t) => {
      return d3.utcParse(t * 1000)
    }))
    .range([
      margin.left,
      W - margin.right
    ])

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(valueArr) * 1.5])
    .range([
      H - margin.bottom,
      margin.top
    ])

  let g_x = svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + (H - margin.bottom) + ')')
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%b-%y")))
    
  let g_y = svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', 'translate('+ margin.left + ', 0)')
    .call(d3.axisLeft(yScale))

  g_y.selectAll('g.tick').append('path')
    .attr('class', 'grid-line')
    .attr('d', 'M0 0' + 'H' + (W - margin.left - margin.right + rightW) + ' 0')
  
  let lineData = []
  for (let i = 0; i < data.x.length; ++i) {
    //console.log(d3.utcParse(data.x[i] * 1000));
    lineData.push({
      lx: data.x[i],
      ly: data.y[i]
    })
  }
console.log(lineData)
  let lineCreator = d3.line()
  .x((d) => {
    return xScale(d3.utcParse(d.lx * 1000))
  })
  .y((d) => {
    return yScale(d.ly)
  })
  .curve(d3.curveMonotoneX)
  //console.log(lineData)
  let graph = svg.append('g').attr('class', 'graph')
  graph.append('path').datum(lineData)
    .attr('class', 'line-path')
    .attr('d', lineCreator(lineData))

   //test
  
   svg.selectAll("dot")	
   .data(lineData)			
.enter().append("circle")
  .attr("class","dots")
   .attr("r", "10px")	
   .style("opacity","0")	
   .attr("cx", function(d) { return xScale(d3.utcParse(d.lx * 1000))})		 
   .attr("cy", function(d) { return yScale(d.ly) })
   .style("fill","rgb(101,27,175)")
   .on("mouseover", function(d) {	
    d3.select(this).attr("r", "10px").style("opacity", "0.5");
    div.transition()		
        .duration(200)		
        .style("opacity", .6);		
    div.html('Time: '+ d3.utcFormat('%Y-%m-%d %H:%M:%S')(d3.utcParse(d.lx*1000))+ "<br/>" + data.query.event_type +': '+ d.ly)	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 80) + "px");	
    })					
.on("mouseout", function(d) {		
  d3.select(this).attr("r", "10px").style("opacity","0");
    div.transition()		
        .duration(500)		
        .style("opacity", 0);	
})

  graph.append('text').attr('transform', () => {
    return 'translate(' + (margin.left - 35) + ', ' + (H / 2) + ')rotate(-90)'
  }).attr('text-anchor', 'middle').text(data.query.event_type)
  .style("font-family","sans-serif")
  
  let preG = graph.append('g')
  preG.append('path').attr('class', 'present-line')
    .attr('d', () => {
      return 'M' + xScale(new Date()) + ' ' + margin.top + 'V0' + (H - margin.bottom)
    })

  preG.append('text').attr('class', 'present-text')
    .attr('transform', () => {
    return 'translate(' + (xScale(new Date())+5) + ', ' + (H-15) + ')rotate(40)'})
    //.attr('x', xScale(d3.utcParse()))
    //.attr('y', margin.top)
    .text('Today')
    .style('font-size',"8px")

    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")		
    .style("opacity", 0);
div.call(responsivefy)
    
    /*
    let tipG = svg.append('svg').attr('class', 'tip-g')
    bgRect.on('mousemove', function(d) {
      tipG.selectAll('*').remove()
  
      let x = d3.event.x
      if (x < margin.left || x > (W - margin.right)) {
        return
      }
      let minI = findMin(x)
      tipG.append('path')
        .attr('class', 'tip-line')
        .attr('d', () => {
          return 'M' + xScale(d3.utcParse(timeArr[minI] * 1000)) + ',' + margin.top + 'V' + (H - margin.bottom)
        })
        
  
      tipG.append('rect')
        .attr('class', 'tip-bg')
        .attr('x', xScale(d3.utcParse(timeArr[minI] * 1000)))
        .attr('y', yScale(valueArr[minI]) - 100)
        .attr('width', 200)
        .attr('height', 47)
        .attr('padding-left', '10px')
       
      tipG.append('text')
        .attr('x', xScale(d3.utcParse(timeArr[minI] * 1000))+5)
        .attr('y', yScale(valueArr[minI])-80)
        .attr('class', 'tip-text')
        .text(() => {
          return 'Time: ' + d3.timeFormat('%Y-%m-%d %H:%M:%S')(d3.utcParse(timeArr[minI] * 1000))
        })
        
      tipG.append('text')
        .attr('x', xScale(d3.utcParse(timeArr[minI] * 1000))+5)
        .attr('y', yScale(valueArr[minI]) + 20-80)
        .attr('class', 'tip-text')
        .text(() => {
          return data.query.event_type +': '+ valueArr[minI].toFixed(2)
        })
      }
    )
  
    bgRect.on('mouseout', () => {
      // tipG.selectAll('*').remove()
    })
   */

//time series

let part1 = svg.append('g').attr('class','part1')


  //legend
    let lgdh = svg.append('g').attr('class','legend')

lgdh.append('rect')
.attr('x',W-100-7-35)
.attr('y',H-90)
.attr('width',135)
.attr('height',65)
.style("stroke-width","1")
.style('fill','none')
.style('stroke',"black")
.style('stroke-dasharray',('3,3'))


    lgdh.append('line')
    .attr('x1',W-100-5-25)
    .attr('y1',H-100+20)
    .attr('x2',W-80-5-25)
    .attr('y2',H-100+20)
    .style('stroke','rgb(101,27,175)')
    .style('stroke-width','2')
  
    lgdh.append('text')
    .attr('x',W-75-5-25)
    .attr('y',H-98+20)
    .text('History')
    .style('font-size','8px')
    .style("font-family","sans-serif")
  
    lgdh.append('line')
    .attr('x1',W-100-5-25)
    .attr('y1',H-80+20)
    .attr('x2',W-80-5-25)
    .attr('y2',H-80+20)
    .style('stroke','rgb(56,178,144)')
    .style('stroke-width','2')
  
    lgdh.append('text')
    .attr('x',W-75-5-25)
    .attr('y',H-98+20+20)
    .text('Prediction')
    .style('font-size','8px')
    .style("font-family","sans-serif")
  
    lgdh.append('rect')
    .attr('x',W-90-10-5-25)
    .attr('y',H-60-10+20)
    .attr('width','20')
    .attr('height','20')
    .style('fill','rgb(32, 177, 208)')
    .style('opacity','0.5')
  
  
    lgdh.append('text')
    .attr('x',W-75-5-25)
    .attr('y',H-98+20+20+20)
    .text('95% Confidence interval')
    .style('font-size','8px')
    .style("font-family","sans-serif")

    lgdh.append('text')
    .attr('x',W-75-25)
    .attr('y',H-98)
    .text('Time Series')
    .style('font-size','8px')
    .style("font-family","sans-serif")
    .style('font-weight','bold')
  
    //lgd.append('rect')
    //.attr('x',W-90-10)
    //.attr('y',H-40)
    //.attr('width','20')
    //.attr('height','10')
    //.style('fill','yellow')
    //.style('stroke','black')
    //.style('stroke-width','0.5')
  
   // lgd.append('text')
    //.attr('x',W-75)
    //.attr('y',H-98+20+20+20+5)
    //.text('Probability')
    //.style('font-size','8px')
    //.style("font-family","sans-serif")
  
  
  
   
    function findMin (x) {
      let tmp = timeArr.map((t) => {
        return xScale(d3.utcParse(t * 1000))
      })
      let index = d3.bisectLeft(tmp, x)
      return index
    }
  
    function responsivefy(svg) {
      var container = d3.select(svg.node().parentNode),
          width = parseInt(svg.style("width")),
          height = parseInt(svg.style("height")),
          aspect = width / height;
  
      svg.attr("viewBox", "0 0 " + width + " " + height)
          .attr("perserveAspectRatio", "xMinYMid")
          .call(resize);
  
      d3.select(window).on("resize." + container.attr("id"), resize);
  
      function resize() {
          var targetWidth = parseInt(container.style("width"));
          svg.attr("width", targetWidth);
          svg.attr("height", Math.round(targetWidth / aspect));
      }
  }

  console.log(data.resultiondt)
  preG.append('path').attr('class', 'resolution-line')
    .attr('d', () => {
      return 'M' + xScale(new Date(data.resultiondt)) + ' ' + margin.top + 'V0' + (H - margin.bottom)
    })

  preG.append('text').attr('class', 'resolution-text')
    .attr('transform', () => {
    return 'translate(' + (xScale(new Date(data.resultiondt))+8) + ', ' + (H-12) + ')rotate(40)'})
    //.attr('x', xScale(new Date(data.predx[data.predx.length - 1] * 1000)))
    //.attr('y', margin.top)
    .text('Resolution')
    .style('font-size',"8px")

  preG.append('path')
    .attr('class', 'pre-area')
    .attr('d', () => {
      let x = xScale(d3.utcParse(data.predx[0] * 1000))
      let y = yScale(data.predy[0])
      let up = []
      let down = []
      for (let i = 0; i < data.predx.length;++i) {
        up.push({
          lx: data.predx[i],
          ly: data.predy[i] + data.confy[i]
        })
        down.push({
          lx: data.predx[i],
          ly:data.predy[i] - data.confy[i]
        })
      }
      down.reverse()
      let upPath = lineCreator(up)
      let downPath = lineCreator(down)
      downPath = 'L' + downPath.slice(1)
      return upPath + downPath + 'Z'
    })

  let preLineData = []
  for (let i = 0; i < data.predx.length; ++i) {
    preLineData.push({
      lx:data.predx[i],
      ly:data.predy[i]
    })
  }

//console.log(preLineData)

  graph.append('path').datum(preLineData)
    .attr('class', 'pre-line')
    .attr('d', lineCreator(preLineData))

 
  svg.selectAll("dot2")	
    .data(preLineData)			
  .enter().append("circle")
   .attr("class","dots")
    .attr("r", "10px")		
    .attr("cx", function(d) { return xScale(d3.utcParse(d.lx * 1000))})		 
    .attr("cy", function(d) { return yScale(d.ly) })
    .style("fill","rgb(56,178,144)")
    .style("opacity","0")
    .on("mouseover", function(d) {		
     d3.select(this).attr("r", "10px").style("opacity", "0.5");
     div.transition()		
         .duration(200)		
         .style("opacity", .6);		
     div.html('Time: '+ d3.utcFormat('%Y-%m-%d %H:%M:%S')(d3.utcParse(d.lx*1000)) + "<br/>" + data.query.event_type +': '+ d.ly)	
         .style("left", (d3.event.pageX) + "px")		
         .style("top", (d3.event.pageY - 80) + "px");	
     })					
  .on("mouseout", function(d) {		
   d3.select(this).attr("r", "10px").style("opacity","0");
     div.transition()		
         .duration(500)		
         .style("opacity", 0);	
  }) 

  let binsW = Math.abs(yScale(0.5) - yScale(0))
  let binsWScale = d3.scaleLinear()
    .domain([0, d3.max(data.binfreqs)])
    .range([0, maxBinsW])

  let binsData = []
  for (let i = 0; i < data.bincents.length ; ++i) {
    binsData.push({
      bin : data.bincents[i],
      //lo: data.bincents[i],
      //hi: data.bincents[i + 1],
      req: data.binfreqs[i],
      diff: data.bincents[1]-data.bincents[0]
    })
  }
  var q = binsData[1].bin
  var p = binsData[0].bin
  var binhi = yScale(p) - yScale(q)
  //console.log(binhi)
  console.log(binsData)
  //var color = d3.scaleQuantize()
  //.range(d3.schemePurples[9]);
  let color = d3.scaleOrdinal().range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"])
  preG.selectAll('rect').data(binsData).enter()
    .append('rect').attr('class', 'bins')
    .attr('y', (d) => {
      //return yScale(d.lo) - (yScale(d.lo) - yScale(d.hi)) / 2
      return yScale(d.bin)
    })
    .attr('x', xScale(new Date(data.resultiondt)))
    .attr('height', binhi//(d) => {
      
      //return yScale(d.lo) - yScale(d.hi)
      //return yScale(q-p)
   // }
  )
    .attr('width', (d, i) => {
      if (d.req <= 0.01){return binsWScale(0.01)}
      else{
      return binsWScale(d.req)}
    })
    .style("fill",(d, i) => {
      //var dc = Math.round(binsWScale(d.req))
      return color(d.bin)})
    .style("stroke-width","0.5")
    .style("stroke","black")


  /*  
  preG.selectAll('text.bins-text').data(binsData).enter()
    .append('text').attr('class', 'bins-text')
    .attr('x', xScale(new Date(1000 * data.predx[data.predx.length - 1])) + maxBinsW + 80)
    .attr('y', (d) => {
      return yScale(d.lo)*1.01
    })
    //.attr('dy', '.5em')
    .text((d) => {
      return d.lo.toFixed(1) + '-' +
        d.hi.toFixed(1) + '(' + (d.req * 100).toFixed(1) +'%)'
    })
    .style('font-size',function(d){return ''+(yScale(d.lo) - yScale(d.hi))/2+3+'px'})

  preG.selectAll('text.bins-line').data(binsData).enter()
    .append('text').attr('class', 'bins-line')
    .attr('x', (d, i) => {
      return binsWScale(d.req) + xScale(new Date(1000 * data.predx[data.predx.length - 1]))
    })
    .attr('y', (d) => {
      return yScale(d.lo)*1.01})
    //.attr('dy', '.5em')
    .text("---------")
    .style("font-size","7px")
    .style("opacity","0.5")

  preG.append('text').attr('x', xScale(new Date(1000 * data.predx[data.predx.length - 1])) + maxBinsW + 80)
    .attr('y', yScale(binsData[binsData.length - 1].hi))
    .attr('dy', '-1em')
    .attr('class', 'bins-title')
    .text(data.query.event_type + '(Probability)')
  //console.log(binsW)

  */

  //bracket

  let brac = svg.append('g').attr('class','bracket')
//console.log(lineData)
let line1x = lineData[0].lx
//console.log(line1x)
let line2x = data.resultiondt
//console.log(line2x)
let line3x = W-margin.right + rightW
let text1x = lineData[Math.round((Object.keys(lineData).length+1)/2)].lx
//console.log(text1x)
let text2x = (line3x - xScale(new Date(line2x)))/2+xScale(new Date(line2x))-50

/*
  brac.append('text')
  .attr('x',xScale(d3.utcParse(line1x * 1000)))
  .attr('y',margin.top-2)
  .text('|←')
  .style('fill','#ccc')
  .style('font-size','20px')
  .style("font-family","sans-serif")

  brac.append('text')
  .attr('x',xScale(new Date(line2x))-25)
  .attr('y',margin.top-2)
  .text('→|←')
  .style('fill','#ccc')
  .style('font-size','20px')
  .style("font-family","sans-serif")
*/
  brac.append('text')
  .attr('x',xScale(d3.utcParse(text1x * 1000))+20)
  .attr('y',margin.top-5)
  .text('Time Series')
  .style('font-size','12px')
  .style("font-family","sans-serif")
/*
  brac.append('text')
  .attr('x',line3x-25)
  .attr('y',margin.top-2)
  .text('→|')
  .style('fill','#ccc')
  .style('font-size','20px')
  .style("font-family","sans-serif")
*/
  brac.append('text')
  .attr('x',text2x)
  .attr('y',margin.top-5)
  .text('Model Prediction')
  .style('font-size','12px')
  .style("font-family","sans-serif")

  //legend
  let lgdp = svg.append('g').attr('class','legend')

let bincount = binsData.length
//console.log(bincount)

  lgdp.append('rect')
  .attr('x',W-100-7-35)
  .attr('y',H-90-200-20+25*(6-bincount))
  .attr('width',135)
  .attr('height',190-25*(6-bincount))
  .style("stroke-width","1")
  .style('fill','none')
  .style('stroke',"black")
  .style('stroke-dasharray',('3,3'))

  lgdp.selectAll('legendp').data(binsData).enter().append('rect')
  .attr('x',W-100-7-30)
  .attr('y',(d,i) => {return H-150-30*(i)})
  .attr('width',25)
  .attr('height',15)
  .style("fill",(d, i) => {
    //var dc = Math.round(binsWScale(d.req))
    return color(d.bin)})
  .style("stroke-width","0.5")
  .style("stroke","black")

  lgdp.selectAll('lgdp-text').data(binsData).enter()
  .append('text').attr('class', 'bins-text')
  .attr('x',W-75)
  .attr('y',(d,i) => {return H-150-30*(i)+12})
  .text((d) => {
    return (d.bin-d.diff/2).toFixed(1) + '-' +
      (d.bin+d.diff/2).toFixed(1) 
  })
  .style('font-size','10px')
  .style("font-family","sans-serif")

  lgdp.selectAll('lgdp-text').data(binsData).enter()
  .append('text').attr('class', 'bins-text')
  .attr('x',W-26)
  .attr('y',(d,i) => {return H-150-30*(i)+12})
  .text((d) => {
    return  '(' + (d.req * 100).toFixed(0) +'%)'
  })
  .style('font-size','10px')  
  .style("font-family","sans-serif")
  .style('font-weight','bold')

  lgdp.append('text')
  .attr('x',W-75-30)
  .attr('y',H-90-200-30+25*(6-bincount))
  .text('Model Prediction')
  .style('font-size','8px')
  .style("font-family","sans-serif")
  .style('font-weight','bold')

}