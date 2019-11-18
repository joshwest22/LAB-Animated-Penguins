var screen = {width:1920,height:800}
var margins = {top:10,right:50,bottom:50,left:50}
//where do the animations go? in code
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
    //tooltip stuff
        .on("mouseover", function(quizes, day)
    {  
       d3.select("#tooltip").style("left",(d3.event.pageX+20)+"px").style("top",(d3.event.pageY-25)+"px").text("("+day+","+quizes+")")
    }
    )
    
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

var makeButtons = function(penguins, xScale, yScale, cScale, index)
    {
        //adds images
        d3.select("body")
        .selectAll(".images")
        .data(penguins, xScale, yScale, cScale, index)
        .enter()
        .append("div")
        .attr("class","images")
        .append("img")
        .attr("src",function(penguin){return "penguins/" + penguin.picture})
        d3.selectAll(".images")
        //switch graphs
        .on("click",function()
        {
        console.log("penguins1",penguins)
        console.log("xScale",xScale)//undefined rn
        console.log("index",index)//undefined rn
        console.log("button clicked") //works
            d3.select("#graph").remove();//works
            d3.select("svg").append("g").attr("id", "graph"); //doesn't work
            d3.select("#graph")
            .selectAll("circle")
            .enter()
            .append("circle")
        .attr("fill", function(colors) //different color for each penguin
        {
            console.log("index",index); console.log("penguins",penguins); return cScale(penguins[index].picture)     
        })
        .attr("cx",function(quiz,day) //x positions of circles
        {
            return xScale(day)  +1  
        })
        .attr("cy",function(quiz)
        {
            return yScale(quiz.grade)
        })
        .attr("r",3)
    })
    }