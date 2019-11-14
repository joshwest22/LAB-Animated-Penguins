var screen = {width:400,height:500}
var margins = {top:10,right:50,bottom:50,left:50}

//penguin promise to get data
var penguinPromise = d3.json("penguins/classData.json")
penguinPromise.then
(
    function(penguins)
    {
    console.log("JSON works", penguins);
    setup(penguins);
        makeButtons(penguins);
        
    },
    function(err)
    {
        console.log("CAN'T READ DATA", err);
    })

//set up svg, scales, and axes
var setup = function(penguins)
{
    d3.select("svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    .append("g")
    .attr("id","graph")
    .attr("transform","translate("+margins.left+","+margins.top+")")
    
    var width = screen.width - margins.left - margins.right
    var height = screen.height - margins.top - margins.bottom
    
    var xScale = d3.scaleLinear()
    .domain([0,38])
    .range([0,width])
    
    var yScale = d3.scaleLinear()
    .domain([0,10])
    .range([height,0])
    
    var cScale = d3.scaleOrdinal(d3.schemeTableau10)
    //create axes
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    d3.select("svg")
        .append("g")
        .classed("axis",true)
    
    d3.select(".axis")
        .append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+margins.left+","+(margins.top+height)+")")
        .call(xAxis)
    
    d3.select(".axis")
        .append("g")
        .attr("id","yAxis")
        .attr("transform","translate(25,"+(margins.top)+")")
        .call(yAxis)
    
    
    drawPenguins(penguins,xScale,yScale,cScale,0);
}

var drawPenguins = function(penguins,xScale,yScale,cScale,index)
{
    var groups = d3.select("#graph")
        .selectAll("circle")
        .data(penguins[index].quizes)
        .enter()
        .append("circle")
        .attr("fill", function(colors) //different color for each penguin
        {
            console.log("index",index); console.log("penguins",penguins); return cScale(penguins[index].picture)     
        })
        .attr("cx",function(quiz,day) //x positions of circles
        {
            return xScale(day)    
        })
        .attr("cy",function(quiz)
        {
            return yScale(quiz.grade)
        })
        .attr("r",3)
}

var makeButtons = function(penguins)
    {
        d3.select("body")
        .selectAll(".images")
        .data(penguins)
        .enter()
        .append("div")
        .attr("class","images")
        .append("img")
        .attr("src",function(penguin){return "penguins/" + penguin.picture})
        d3.selectAll(".images")
        .on("click",function()
        {
        console.log("button clicked")
        //drawPenguins goes here
        })
    }