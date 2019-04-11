import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from "d3";

class App extends Component {



InitChart(graphData, i) {

  var lineData = graphData.data;

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
        return d.x;
      }),
      d3.max(lineData, function (d) {
        return d.x;
      })
    ]),

    yRange = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
        return d.y;
      }),
      d3.max(lineData, function (d) {
        return d.y;
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
    return xRange(d.x);
  })
  .y(function (d) {
    return yRange(d.y);
  })
  .curve(d3.curveMonotoneX);

vis.append("svg:path")
  .attr("d", lineFunc(lineData))
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("fill", "none");



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
    let reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload=(e)=>{
      let csvData = e.target.result.toString().split("\n");
      this.formatDataForLineChart(csvData);
    };
  }

  formatDataForLineChart(csvData){
    let graphArray = [];
    csvData.forEach(row => {
      let rowArray = row.split(",");
      let rowObject = {
        name: rowArray[0],
        data: rowArray.splice(1).map(yearscore=>{
          let valueArray = yearscore.split("|");
          return {
            x: valueArray[0],
            y: valueArray[1]
          }
        })
      };

     
      graphArray.push(rowObject);
    })

    graphArray.forEach((graphData, i)=>{
      this.InitChart(graphData, i);
    });
   
    console.warn(graphArray);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <div onSubmit={this.onFormSubmit}>
        <input type="file" name="file" onChange={(e)=>this.onChange(e)} />
      </div>
        </header>
        <div id="chartContainer"></div>
        {/* <svg id="visualisation" width="1000" height="500"></svg> */}
      </div>
    );
  }
}

export default App;
