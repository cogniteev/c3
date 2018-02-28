import CLASS from './class';

const gridTextDx = (d) =>
    d.position === 'start' ? 4 : d.position === 'middle' ? 0 : -4;

const gridTextAnchor = (d) =>
    d.position ? d.position : "end";

const xGridTextX = (d) =>
    d.position === 'start' ? -height : d.position === 'middle' ? -height / 2 : 0;

const yGridTextX = (d) =>
    d.position === 'start' ? 0 : d.position === 'middle' ? width / 2 : width;

const valueForScales = (scales) =>
    (d) => Math.ceil((d.axis && d.axis === 'y2' ? scales.y2 : scales.y)(d.value));

/**
 * C3GridLines add handling of custom lines along the X or Y axis.
 *
 * @constructor
 */
const C3GridLines = function({ container, clipPath, xLines = [], yLines = [] }) {
    this.xData = xLines;
    this.yData = yLines;

    this.gridLines = container
        .append('g')
        .attr('clip-path', clipPath)
        .attr('class', CLASS.gridLines);

    this.xgridLines = this.gridLines
        .append('g')
        .attr('class', CLASS.xgridLines);

    this.ygridLines = this.gridLines
        .append('g')
        .attr('class', CLASS.ygridLines);
};

/**
 * Updates the displayed grid
 *
 * Should be called if the data has changed.
 *
 * @param duration The transition duration in ms
 * @param rotatedAxis if the X and Y axis should be swapped
 * @param width The chart's width
 * @param height The chart's height
 * @param scales The scales used by the axis ({ y: Scale, y2: Scale })
 */
C3GridLines.prototype.update = function({ duration, rotatedAxis, width, height, scales }) {
    let yv = valueForScales(scales);

    let xLines = this.xgridLines
        .selectAll('.' + CLASS.xgridLine)
        .data(this.xData);

    let xLine = xLines
        .enter()
        .append('g')
        .attr('class', (d) => [ CLASS.xgridLine, d.class ].filter((v) => v).join(' '));

    xLine
        .append('line')
        .style('opacity', 0);

    xLine
        .append('text')
        .attr("text-anchor", gridTextAnchor)
        .attr("transform", rotatedAxis ? "" : "rotate(-90)")
        .attr('dx', gridTextDx)
        .attr('dy', -5)
        .style("opacity", 0);

    xLines
        .exit()
        .transition()
        .duration(duration)
        .style('opacity', 0)
        .remove();

    let yLines = this.ygridLines
        .selectAll('.' + CLASS.ygridLine)
        .data(this.yData);

    let yLine = yLines
        .enter()
        .append('g')
        .attr('class', (d) => [ CLASS.ygridLine, d.class ].filter((v) => v).join(' '));

    yLine
        .append('line')
        .style('opacity', 0);

    yLine
        .append('text')
        .attr("text-anchor", gridTextAnchor)
        .attr("transform", rotatedAxis ? "rotate(-90)" : "")
        .attr('dx', gridTextDx)
        .attr('dy', -5)
        .style("opacity", 0);

    yLines
        .select('line')
        .transition().duration(duration)
        .attr("x1", rotatedAxis ? yv : 0)
        .attr("x2", rotatedAxis ? yv : width)
        .attr("y1", rotatedAxis ? 0 : yv)
        .attr("y2", rotatedAxis ? height : yv)
        .style("opacity", 1);

    yLines
        .select('text')
        .transition().duration(duration)
        .attr("x", rotatedAxis ? xGridTextX : yGridTextX)
        .attr("y", yv)
        .text((d) => d.text)
        .style("opacity", 1);

    yLines
        .exit()
        .transition()
        .duration(duration)
        .style("opacity", 0)
        .remove();

    this.rotatedAxis = rotatedAxis;
    this.width = width;
    this.height = height;
    this.yv = yv;
};

/**
 * Compute transitions for grid
 *
 * @returns List of transitions for X and Y grid lines
 */
C3GridLines.prototype.redraw = function ({ withTransition }) {
    let lines = this.xgridLines
        .select('line');

    let texts = this.xgridLines
        .select('text');

    return [
        (withTransition ? lines.transition() : lines)
            .attr("x1", this.rotatedAxis ? 0 : this.xv)
            .attr("x2", this.rotatedAxis ? this.width : this.xv)
            .attr("y1", this.rotatedAxis ? this.xv : 0)
            .attr("y2", this.rotatedAxis ? this.xv : this.height)
            .style("opacity", 1),
        (withTransition ? texts.transition() : texts)
            .attr("x", this.rotatedAxis ? yGridTextX : xGridTextX)
            .attr("y", this.xv)
            .text((d) => d.text)
            .style("opacity", 1)
    ];
};

C3GridLines.prototype.removeXLines = function(params) {

};

C3GridLines.prototype.removeYLines = function(params) {




};

/*
c3_chart_internal_fn.getGridFilterToRemove = function (params) {
    return params ? function (line) {
        var found = false;
        [].concat(params).forEach(function (param) {
            if ((('value' in param && line.value === param.value) || ('class' in param && line['class'] === param['class']))) {
                found = true;
            }
        });
        return found;
    } : function () { return true; };
};
c3_chart_internal_fn.removeGridLines = function (params, forX) {
    var $$ = this, config = $$.config,
        toRemove = $$.getGridFilterToRemove(params),
        toShow = function (line) { return !toRemove(line); },
        classLines = forX ? CLASS.xgridLines : CLASS.ygridLines,
        classLine = forX ? CLASS.xgridLine : CLASS.ygridLine;
    $$.main.select('.' + classLines).selectAll('.' + classLine).filter(toRemove)
        .transition().duration(config.transition_duration)
        .style('opacity', 0).remove();
    if (forX) {
        config.grid_x_lines = config.grid_x_lines.filter(toShow);
    } else {
        config.grid_y_lines = config.grid_y_lines.filter(toShow);
    }
};

*/
export { C3GridLines };
