import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from "d3";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {isInvalidFormat: false};
  }

clearChart(){
  document.getElementById("chartContainer").innerHTML = "";
}

InitChart(graphData, i) {

  var lineData = graphData.data;

  var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


  var svg = d3.select("#chartContainer").append("svg")
    .attr("width", 1000)
    .attr("height",500)
    .attr("id", "visualisation"+i);

  var vis = d3.select("#visualisation"+i),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
        return d.year;
      }),
      d3.max(lineData, function (d) {
        return d.year;
      })
    ]),

    yRange = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
        return d.value;
      }),
      d3.max(lineData, function (d) {
        return d.value;
      })
    ]),

    xAxis = d3.axisBottom()
      .scale(xRange),
      // .tickSize(5)
      // .tickSubdivide(true),

    yAxis = d3.axisLeft()
      .scale(yRange)
      // .tickSize(5)
      // .orient("left")
      // .tickSubdivide(true);


  vis.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);

  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  var lineFunc = d3.line()
  .x(function (d) {
    return xRange(d.year);
  })
  .y(function (d) {
    return yRange(d.value);
  })
  .curve(d3.curveMonotoneX);

vis.append("svg:path")
  .attr("d", lineFunc(lineData))
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "none");

  svg.selectAll("dot")
        .data(lineData)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("fill", "red")
        .attr("cx", function(d) { return xRange(d.year); })
        .attr("cy", function(d) { return yRange(d.value); })
        .on("mouseover", function(d) {		
          div.transition()		
              .duration(200)		
              .style("opacity", .9);		
          div .html("Year: " + d.year + "<br/>Value: "  + d.value)	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {		
          div.transition()		
              .duration(500)		
              .style("opacity", 0);	
      });



vis.append("svg:text")
        .attr("x", (WIDTH / 2))             
        .attr("y", 15)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .style("stroke", "#fff") 
        .style("fill", "#fff")  
        .text(graphData.name);

}

  onChange(e){
    let files = e.target.files;
    console.warn("data file", files);
    if(files.length == 0){
      this.clearChart();
      return;
    }
    let reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload=(e)=>{
      let csvData = e.target.result.toString().split("\n");
      this.formatDataForLineChart(csvData);
    };
  }

  formatDataForLineChart(csvData){
    let graphArray = [];
    let isInvalidFormat = false;
    csvData.forEach(row => {
      let rowArray = row.split(",");
      if(rowArray[0].indexOf("|") !== -1){
        isInvalidFormat = true;
        return;
      }
      let rowObject = {
        name: rowArray[0],
        data: rowArray.splice(1).map(yearscore=>{
          if(yearscore.indexOf("|")==-1 || yearscore.indexOf("|") !== yearscore.lastIndexOf("|")){
            isInvalidFormat = true;
            return;
          }
          let valueArray = yearscore.split("|");
          if(!valueArray[0] || !valueArray[1]){
            isInvalidFormat = true;
            return;
          }
          return {
            year: valueArray[0],
            value: valueArray[1]
          }
        })
      };

      if(!rowObject.data.length || !rowObject.name){
        isInvalidFormat = true;
        return;
      }

     
      graphArray.push(rowObject);
    })

    this.state.isInvalidFormat = isInvalidFormat;
    if(isInvalidFormat){
      document.getElementById('errorDiv').innerText = 'Please upload valid CSV file';
      this.clearChart();
      return;
    }

    document.getElementById('errorDiv').innerText = '';

    graphArray.forEach((graphData, i)=>{
      this.InitChart(graphData, i);
    });
    this.makePostCalltoSave(graphArray);
    console.warn(graphArray);
  }

  makePostCalltoSave(graphArray){
    let reqPayload = {
      graphData: graphArray
    };


    fetch('http://localhost:3001/api/filecontent', {
      method: 'POST',
      body: JSON.stringify(reqPayload)
      }).then(response => {
        response.json().then(res1 => {
          console.log(res1);
        });
      });
  }

  render() {
   
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <div>Line chart application</div>
        </header>
        <div className="fileUploadContainer" onSubmit={this.onFormSubmit}>
        <input type="file" name="file" onInput={(e)=>this.onChange(e)} accept=".csv" />
        <div id="errorDiv"></div>
      </div>
        <div id="chartContainer"></div>
        {/* <svg id="visualisation" width="1000" height="500"></svg> */}
      </div>
    );
  }
}

export default App;
