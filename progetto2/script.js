d3.json("data.json").then(function(dataset) {
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Funzione per creare le scale
    function createScales(dataset) {
        const maxRadius = d3.max(dataset, d => d.v3);
        const xMax = d3.max(dataset, d => d.v1) + maxRadius + 10;
        const yMax = d3.max(dataset, d => d.v2) + maxRadius + 10;
        const xMin = d3.min(dataset, d => d.v1) - maxRadius - 10;
        const yMin = d3.min(dataset, d => d.v2) - maxRadius - 10;

        // Creazione della scala X
        const xScale = d3.scaleLinear()
            .domain([xMin, xMax])
            .range([0, innerWidth]);

        // Creazione della scala Y
        const yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([innerHeight, 0]);

        return { xScale, yScale };
    }

    // Funzione per creare gli assi
    function createAxes(scales) {
        const xAxis = d3.axisBottom(scales.xScale);
        const yAxis = d3.axisLeft(scales.yScale);
        return { xAxis, yAxis };
    }

    // Creazione delle scale e degli assi iniziali
    let { xScale, yScale } = createScales(dataset);
    let { xAxis, yAxis } = createAxes({ xScale, yScale });

    // Creazione dell'SVG e del gruppo contenitore
    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Aggiunta degli assi
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis);

    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Funzione per aggiornare il grafico
    function updateChart() {
        // Ricalcola le scale e gli assi
        ({ xScale, yScale } = createScales(dataset));
        ({ xAxis, yAxis } = createAxes({ xScale, yScale }));

        // Aggiorna gli assi con transizioni animate
        g.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);

        g.select(".y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);

        // Aggiorna i cerchi con transizioni animate
        g.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1000)
            .attr("cx", d => xScale(d.v1))
            .attr("cy", d => yScale(d.v2))
            .attr("r", d => d.v3);
    }

    // Gestione dei click sugli assi per aggiornare i cerchi
    g.select(".x-axis")
        .on("click", function() {
            dataset.forEach(function(d) {
                const temp = d.v1;
                d.v1 = d.v3;
                d.v3 = temp;
            });
            updateChart();
        });

    g.select(".y-axis")
        .on("click", function() {
            dataset.forEach(function(d) {
                const temp = d.v2;
                d.v2 = d.v3;
                d.v3 = temp;
            });
            updateChart();
        });

    // Creazione iniziale dei cerchi
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
