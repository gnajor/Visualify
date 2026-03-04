export class CircularBarChart{
    constructor(parentSelector, dataset, innerSize){
        this.parent = d3.select(parentSelector);
        this.dataset = dataset;

        this.margin = {
            top: 0,
            right: 80,
            bottom: 0,     
            left: 80
        }
        this.colors = {
            toLilac: "var(--light-lilac)",
            fromLilac: "var(--main-purple-color)",
            toDarkerLilac: "var(--dark-purple)"
        }

        this.wSvg = 800;
        this.hSvg = 800; 
        this.hViz = this.hSvg - this.margin.bottom - this.margin.top;
        this.wViz = this.wSvg - this.margin.left - this.margin.right;

        this.rotation = ((1/dataset.length) * 360)/2;
        this.innerRadius = this.wSvg * innerSize;
        this.innerSize = innerSize;
        this.outerRadius = d3.min([this.hViz, this.wViz]) / 1.7;

        this.init();
    }

    init(){
        this.svg = this.parent.append("svg")
            .attr("width", "100%")
            .attr("height", "auto")
            .attr("viewBox", `0 0 ${this.wSvg} ${this.hSvg}`)
            .classed("circular-bar-chart", true)

        this.graphGroup = this.svg.append("g")
            .classed("graph-group", true)
            .attr("transform", `translate(${this.wSvg / 2},  ${this.hSvg/2}) rotate(${this.rotation})`);
        
        this.renderDefs();
        this.prepScales();
        this.renderBackroundArcs();
        this.renderLabels();
        this.renderDataArcs();
        this.bindListeners();
    }

    renderDefs(){
        const defs = this.svg.append("defs")

        const lightPurpleGrad = defs.append("linearGradient")
            .attr("id", "lightPurpleGrad")
        lightPurpleGrad.append("stop").attr("stop-color", this.colors.fromLilac).attr("offset", "0%")
        lightPurpleGrad.append("stop").attr("stop-color", this.colors.toLilac).attr("offset", "100%");

        const darkPurpleGrad = defs.append("linearGradient")
            .attr("id", "darkPurpleGrad")
        darkPurpleGrad.append("stop").attr("stop-color", this.colors.fromLilac).attr("offset", "0%");
        darkPurpleGrad.append("stop").attr("stop-color", this.colors.toDarkerLilac).attr("offset", "100%");
    }

    prepScales(){
        const decades = this.dataset.map(obj => obj.decade);
        const amounts = this.dataset.map(obj => obj.amount);
        this.maxamount = d3.max(amounts);

        this.xScale = d3.scaleBand()
            .domain(decades)
            .range([0, 2 * Math.PI]);
        
        this.yScale = d3.scaleRadial()
            .domain([0, this.maxamount])
            .range([this.innerRadius, this.outerRadius])
    }

    renderBackroundArcs(){
        this.graphGroup.append("g").classed("backroundArcGroup", true)
            .selectAll("path")
            .data(this.dataset)
            .enter()
            .append("path")
                .style("fill", (d, i, nodes) => {
                    if(i === nodes.length - 1){
                        nodes[i].classList.add("none");
                        return "transparent";
                    }
                    else{
                        nodes[i].classList.add("pieBackground");
                        return "var(--darkest-grey)";
                    }
                })
                .attr("d", d3.arc()
                    .innerRadius(this.innerRadius)
                    .outerRadius((d, i, nodes) => this.yScale(this.maxamount))
                    .startAngle((d, i, nodes) => this.xScale(d.decade))
                    .endAngle((d, i, nodes) => this.xScale(d.decade) + this.xScale.bandwidth())
                    .padAngle(0.10)
                    .padRadius(this.innerRadius)
                )
    }

    renderLabels(){
        this.graphGroup.append("g").classed("labelGroup", true)
            .selectAll("g")
            .data(this.dataset)
            .enter().append("g")
                .attr("text-anchor", "middle")
                .attr("transform", (d, i, nodes) => 
                    `rotate(${(this.xScale(d.decade) + this.xScale.bandwidth() / 2) * 180 / Math.PI - 90})` +
                    `translate(${this.innerRadius}, 0)`
                )
                .append("text")
                    .classed("decadeText", true)
                    .attr("id", (d, i, nodes) => "pieText-" + (i + 1))
                    .attr("transform", (d, i, nodes) =>
                        (this.xScale(d.decade) + this.xScale.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                            ? `rotate(90)translate(0, ${this.innerSize * 160})`
                            : `rotate(-90)translate(0,-${this.innerSize * 90})`
                    )
                    .text((d, i, nodes) => {
                        if(d.decade)return String(d.decade).slice(2, 5) + "s"
                    });
    }

    renderDataArcs(){
        this.arcs = this.graphGroup.append("g").classed("arcGroup", true)
            .selectAll("path")
            .data(this.dataset)
            .enter()
            .append("path")
                .classed("pie", true)
                .attr("id", (d, i, nodes) => "pie-" + (i + 1))
                .attr("d", d3.arc()
                    .innerRadius(this.innerRadius)
                    .outerRadius((d, i, nodes) => this.yScale(d.amount))
                    .startAngle((d, i, nodes) => this.xScale(d.decade))
                    .endAngle((d, i, nodes) => this.xScale(d.decade) + this.xScale.bandwidth())
                    .padAngle(0.10)
                    .padRadius(this.innerRadius)
                )
    }

    bindListeners(){
        this.graphGroup.selectAll(".pie").each(function(d, i){
            d3.select(this)
                .on("mouseenter", () => {
                    this.classList.add("pieHover");
                    d3.select(`#song-${d.decade}`).classed("show", true)
                    d3.select("#pieText-" + (i + 1)).classed("pieTextHover", true)
                })
                .on("mouseleave", () => {
                    this.classList.remove("pieHover");
                    d3.select(`#song-${d.decade}`).classed("show", false)
                    d3.select("#pieText-" + (i + 1)).classed("pieTextHover", false)
                });
        });

        this.graphGroup.selectAll(".pieBackground").each(function(d, i){
            d3.select(this)
                .on("mouseenter", () => {
                    d3.select(`#song-${d.decade}`).classed("show", true)
                    d3.select("#pie-" + (i + 1)).classed("pieHover", true)
                    d3.select("#pieText-" + (i + 1)).classed("pieTextHover", true)
                })
                .on("mouseleave", () => {
                    d3.select(`#song-${d.decade}`).classed("show", false)
                    d3.select("#pie-" + (i + 1)).classed("pieHover", false)
                    d3.select("#pieText-" + (i + 1)).classed("pieTextHover", false)
                });
        });
    }

    bindClickListeners(){
        const pies = this.graphGroup.selectAll(".pie");

        pies.each(function(d, i){
            d3.select(this)
                .on("click", () => {
                    pies.each(function(d, i){ d3.select(this).classed("pieHover", false)})
                    this.classList.add("pieHover");
                    d3.select(`#song-${d.decade}`).classed("show", true)
                    d3.select("#pieText-" + (i + 1)).classed("pieTextHover", true)
                })
        });

        this.graphGroup.selectAll(".pieBackground").each(function(d, i){
            d3.select(this)
                .on("click", () => {
                    d3.select(`#song-${d.decade}`).classed("show", true)
                    d3.select("#pie-" + (i + 1)).classed("pieHover", true)
                    d3.select("#pieText-" + (i + 1)).classed("pieTextHover", true)
                })
        });
    }

    changeData(dataset){
        this.dataset = dataset;
        const amounts = this.dataset.map(obj => obj.amount);
        this.maxamount = d3.max(amounts);

        this.yScale = d3.scaleRadial()
            .domain([0, this.maxamount])
            .range([this.innerRadius, this.outerRadius]);

        const arcGenerator = d3.arc()
            .innerRadius(this.innerRadius)
            .startAngle(d => this.xScale(d.decade))
            .endAngle(d => this.xScale(d.decade) + this.xScale.bandwidth())
            .padAngle(0.10)
            .padRadius(this.innerRadius);

        this.arcs
            .data(this.dataset)
            .transition()
            .duration(400)
            .attrTween("d", (d, i, nodes) => { //
                const previousRadius = nodes[i].__currentRadius || this.innerRadius; //old radius
                const targetRadius = this.yScale(d.amount); //new radius based on data
                const interpolateRadius = d3.interpolate(previousRadius, targetRadius); //makes for a smooth transition between the values

                return (t) => { //called on each animation frame, t represents the transition progress from 0 => 1
                    const currentRadius = interpolateRadius(t); 
                    const arcWithRadius = arcGenerator.outerRadius(currentRadius); //the current frame radius
                    return arcWithRadius(d);  //generates a arc with the new outerRadius
                };
            });
        }
}