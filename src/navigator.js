namespace("leesa.visual").navigator = (function(leesa, _, d3) {

    
    var containerId = leesa.util.uniqueId();
    var magicalChart = {
        extend: function(quadrant) {},
        render: function render(quadrant, callback) {
            var content = quadrant.htmlJContent();
            var visual = quadrant.visual();
            content.html("");

            var container = $("<div></div>")
                .attr("id", "navigator")
                .css({
                    "height": "100%",
                    "width": "100%",
                    "white-space":"nowrap",
                    
                });

            content.append(container);

            var fullCanvas = d3.select(container[0]);
            var width = container.width();
            var height = container.height();

            function drawChart(){
                $(container[0]).html('');
                if(typeof visual.parameters.selectedDashboardInfo !== "undefined"){
                    var data = visual.parameters.selectedDashboardInfo;
                    var nav = fullCanvas.append("ul").selectAll(".nav")
                            .data(data)
                            .enter()
                            .append("li")
                            .append("div")
                            .attr("class","nav waves-effect button--white button--shadow");
                        nav.append("div")
                            .attr("id","title")
                            .attr("class","oneline")
                            .text(function(d){return d.title;});
                    nav.append("div")
                        .attr("id", "desc")
                        .each(function(d) {
                            if (d.description == "") {
                                d3.select(this)
                                    .append("div")
                                    .attr("class", "line")
                                    .text(`Created By: ${d.nameOfCreatedBy}`);


                                var d3DivDateTime = d3.select(this).append("div").attr("class", "line");
                                d3DivDateTime.append("span")
                                    .text("Last Updated: ")
                                var d3ValueSpan = d3DivDateTime.append("span")[0][0];
                                ko.bindingHandlers.textDatetime
                                    .update(d3ValueSpan, function() { return d.lastEditedUTCDateTime });
                            } else {
                                d3.select(this).text(`${d.description.replace(/<\/?[^>]+(>|$)/g, "")}`);
                            }
                        });
                        nav.on("click", function(d){
                            var localURL=document.URL;
                            var primaryURL=localURL.match(/(.*)\//)[0];
                            var dashboardURL = primaryURL+d.dashboardViewId;

                            var isNewChart = localURL.match(/(.*?)\//g);
                            if( !(isNewChart[ isNewChart.length-1 ] == "Quadrant/" || isNewChart[ isNewChart.length-1 ] == "New/") ){
                                window.open(dashboardURL, "_blank");
                            }
                        })
                }
                hackDashboard();
            }

            function hackDashboard(){
                var localURL=document.URL;
                if(!_.isEmpty(localURL.match(/Workspace/))){
                    return;
                }
                d3.selectAll(".leesa__cell.leesa__cell--noFooter.leesa__cell--grid").each(function(){
                    if (!d3.select(this).select("#navigator").empty()) {
                        d3.select(this)
                            .style({
                                "background-color": "transparent",
                                "box-shadow": "none"
                            });

                        d3.select($(this).closest(".grid-stack-item-content.leesa__flipContainer")[0])
                            .style({
                                "background-color": "transparent",
                                "box-shadow": "none"
                            });


                    d3.select(this).select(".leesa__header").style("display","none");
                        d3.select(this).select(".leesa__content").style("padding-top","0");

                    }
                })
            }

            drawChart();
           

            callback(quadrant);

            var refreshTimeout;
            setInterval(function() {
                if (container.width() != width || container.height() != height) {
                    clearTimeout(refreshTimeout);
                    width = container.width();
                    height = container.height();

                    refreshTimeout = setTimeout(function() {
                        drawChart();
                    }, 1000);
                }
            });
        },
        configuration: {},
    };
    return magicalChart;

})(leesa, _, d3);

