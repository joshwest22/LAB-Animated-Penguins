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
        setup(penguins,0);//index set to 0 by default
        
        
    },
    function(err)
    {
        console.log("CAN'T READ DATA", err);
    })

//set up svg, scales, and axes
var setup = function(penguins,index)
{
    //print index to console
    console.log("index:",index)
    
    //make svg
    d3.select("svg")
    .attr("width",screen.width)
    .attr("height",screen.height)
    .append("g")
    .attr("id","graph")
    .attr("transform","translate("+margins.left+","+margins.top+")")
    //tooltip stuff
    .on("mouseover", function(quiz, index)
    {  
        console.log("inside on mouseover")//working
        //console.log("quiz",penguins[index].quizes[index].grade)//FIXME: figure out how to get the grade info for each circle
        d3.select("#tooltip").classed("hidden", false)
        d3.select("body").append("span").attr("id","tooltip") //creates tooltip span every time
        d3.select("#tooltip")
            .style("left",(d3.event.pageX+20)+"px")
            .style("top",(d3.event.pageY-0)+"px")
            .style("width", 150 +"px")
            .style("height",25+"px")
            .style("border-radius", 10+"px")
            .style("position","fixed")
            .style("background-color","grey")
            .style("pointer-event","none")
            //.style("font-size",15+"px")
            //.style("border", 10+"px"+10+"px"+"black")
            //.style("box-shadow",4+"px" 4+"px" 10+"px"+ "right"+ "rgba(0,0,0,0.4)")
            .text("(Tip: penguin data)") //tooltip not responding to CSS and printing wrong index
            //.style("text-align", "center")
            
    })
    .on("mouseout", function()
    {
        console.log("inside on mouseout")//not working
        d3.select("#tooltip").classed("hidden",true)    
    })
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
    //draw the circles for the first time
    var initialCircles = d3.select("#graph")
        .selectAll("circle")
        .data(penguins[index].quizes)
        .enter()
        .append("circle")
        .attr("fill", function(colors) //different color for each penguin
        {
            return cScale(penguins[index].picture)     
        })
        .attr("cx",function(quiz,day) //x positions of circles
        {
            return xScale(day)    
        })
        .attr("cy",function(quiz)
        {
            return yScale(quiz.grade)
        })
        .attr("r",10)
    
    drawPenguins(penguins,xScale,yScale,cScale,0);
    makeButtons(penguins,xScale,yScale,cScale); //this was previously in the promise (which was wrong bc xScale, yScale, etc. from setup couldn't be used)
}

var drawPenguins = function(penguins,xScale,yScale,cScale,index)
{
    var groups = d3.select("#graph")
        .selectAll("circle")
        .data(penguins[index].quizes)
        //.enter() <-- don't need this here since there are already visual elements
        //.append("circle") <-- don't need this here since there are already circles
        //put transition() here
        //don't remove()
        .transition()
        .duration(1000)
        .attr("fill", function(colors) //different color for each penguin
        {
            return cScale(penguins[index].picture)     
        })
        .attr("cx",function(quiz,day) //x positions of circles
        {
            return xScale(day)    
        })
        .attr("cy",function(quiz)
        {
            return yScale(quiz.grade)
        })
        .attr("r",10)
    //make dynamic title for graph
    d3.select("span")
    .attr("id","title")
    .text("Penguin " + index + "'s Quiz Grades") //index changes to the correct penguin clicked
}

var makeButtons = function(penguins, xScale, yScale, cScale)
    {
        //adds images
        d3.select("body")
        .selectAll(".images")
        .data(penguins)
        .enter()
        .append("div")
        .attr("class","images")
        .append("img")
        .attr("src",function(penguin){return "penguins/" + penguin.picture})
        d3.selectAll(".images")
        //switch graphs when penguin img clicked
        .on("click",function(penguin,index)
        {
        //console.log("penguinsOnClick",penguins)
        //console.log("xScale",xScale)//works now
        console.log("index",index)//works now
        console.log("button clicked") //works
            //d3.selectAll("#graph *").remove();//works, but not needed when using animations
            drawPenguins(penguins, xScale, yScale, cScale,index)
    })
    }