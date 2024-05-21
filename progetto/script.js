d3.json("data.json").then(function(dataset) {
    // Definizione delle dimensioni del grafico
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    

    function createScales(dataset) {
        const maxRadius = d3.max(dataset, d => d.v3);
        const xMax = d3.max(dataset, d => d.v1 + maxRadius + 10);
        const yMax = d3.max(dataset, d => d.v2 + maxRadius + 10);
    
        const xScale = d3.scaleLinear()
            .domain([0, xMax])
            .range([0, innerWidth]);
    
        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([innerHeight, 0]);
    
        return { xScale, yScale };
    }

    function createAxes(scales) {
        const xAxis = d3.axisBottom(scales.xScale);
        const yAxis = d3.axisLeft(scales.yScale);
        return { xAxis, yAxis };
    }

    let { xScale, yScale } = createScales(dataset);
    let { xAxis, yAxis } = createAxes({ xScale, yScale });


    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis);

    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    
    function updateChart() {
        ({ xScale, yScale } = createScales(dataset));
        ({ xAxis, yAxis } = createAxes({ xScale, yScale }));
    
        g.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);
    
        g.select(".y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);
    
        g.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1000)
            .attr("cx", d => xScale(d.v1))
            .attr("cy", d => yScale(d.v2))
            .attr("r", d => d.v3);
    }

    g.select(".x-axis")
    .on("click", function() {
        // Per ogni cerchio nel dataset, ruota i valori di v1, v2 e v3
        dataset.forEach(function(d) {
            const temp = d.v1;
            d.v1 = d.v3;
            d.v3 = temp;
        });
        updateChart();
    });

    g.select(".y-axis")
        .on("click", function() {
            // Per ogni cerchio nel dataset, ruota i valori di v1, v2 e v3
            dataset.forEach(function(d) {
                const temp = d.v2;
                d.v2 = d.v3;
                d.v3 = temp;
            });
            updateChart();
        });

        g.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.v1))
        .attr("cy", d => yScale(d.v2))
        .attr("r", d => d.v3)
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
});