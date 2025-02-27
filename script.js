document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayChart(data);
    })
    .catch((err) => {
      console.log("an error occured: ", err);
    });
});

const displayChart = (data) => {
  const chartWidth = 1000;
  const chartHeight = 500;
  const chartPadding = 100;
  const chartPaddingRight = 50;
  const tooltipWidth = 150;
  const dopingColor = "rgb(200, 50, 50)";
  const noDopingColor = "rgb(50, 200, 50)";

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([chartPadding, chartWidth - chartPaddingRight]);

  const parseTime = d3.timeParse("%M:%S");
  const yScale = d3
    .scaleTime()
    .domain([
      d3.min(data, (d) => parseTime(d.Time)),
      d3.max(data, (d) => parseTime(d.Time))
    ])
    .range([chartHeight - chartPadding, chartPadding]);

  const svg = d3
    .select("div")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .style("box-shadow", "0 0 10px 5px grey")
    .style("border-radius", "10px");

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", chartWidth / 2)
    .attr("y", chartPadding / 2)
    .attr("text-anchor", "middle")
    .text("Doping in Professional Bicycle Racing")
    .style("font-size", "30px")
    .style("font-weight", "bold");

  svg
    .append("text")
    .attr("id", "sub-title")
    .attr("x", chartWidth / 2)
    .attr("y", chartPadding / 2 + 30)
    .attr("text-anchor", "middle")
    .text(data.length + " Fastest times up Alpe d'Huez")
    .style("font-size", "20px");

  const tooltip = d3
    .select("div")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(100, 150, 250, 85%)")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("width", tooltipWidth + "px")
    .style("text-align", "center")
    .style("box-shadow", "0 0 5px 2px grey");

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => parseTime(d.Time))
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(parseTime(d.Time)))
    .attr("r", 5)
    .attr("fill", (d) => (d.Doping ? dopingColor : noDopingColor))
    .on("mouseover", (event, d) => {
      const chartRightEdge = chartWidth + chartPadding * 2;
      const tooltipX =
        event.pageX + tooltipWidth > chartRightEdge
          ? event.pageX - tooltipWidth - 20
          : event.pageX + 20;

      tooltip
        .style("visibility", "visible")
        .attr("data-year", d.Year)
        .html(
          d.Name +
          "<br>Year: " +
          d.Year +
          "<br>Time: " +
          d.Time +
          "<br>Nationality: " +
          d.Nationality +
          (d.Doping ? "<br><br>Doping: " + d.Doping : "")
        )
        .style("left", tooltipX + "px")
        .style("top", event.pageY - 28 + "px")
        .style("font-size", "15px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (chartHeight - chartPadding) + ")")
    .call(xAxis);
  svg
    .append("text")
    .attr("id", "x-axis-decription")
    .attr("text-anchor", "middle")
    .text("Time in Minutes")
    .style("font-size", "20px")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - chartHeight / 2)
    .attr("y", chartPadding / 2);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + chartPadding + ",0)")
    .call(yAxis);

  svg
    .append("text")
    .attr("id", "x-axis-decription")
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Year")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight - chartPadding / 2);

  const legendSize = 20;
  const legendSpacing = 5;
  const legendArr = [
    {
      text: "Riders with doping allegations",
      color: dopingColor
    },
    {
      text: "Riders with no doping allegations",
      color: noDopingColor
    }
  ];

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll(".legend-values")
    .data(legendArr)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d, i) =>
        "translate(0," +
        ((chartHeight - chartPadding) / 2 - i * (legendSize + legendSpacing)) +
        ")"
    );

  legend
    .append("rect")
    .attr("x", chartWidth - chartPaddingRight)
    .attr("width", legendSize)
    .attr("height", legendSize)
    .style("fill", (d) => d.color);

  legend
    .append("text")
    .attr("x", chartWidth - chartPaddingRight - legendSpacing)
    .attr("y", legendSize - legendSpacing)
    .style("font-size", "13px")
    .style("text-anchor", "end")
    .text((d) => d.text);
};
