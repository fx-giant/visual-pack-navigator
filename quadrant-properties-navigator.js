namespace("fx.quadrantProperties")["navigator"] = (function (ko, _, leesa, fx, fxDataContext, fxUtil, fxEnum) {

    //#region shorthand
    
    var observable = ko.observable;
    var observableArray = ko.observableArray;
    var computed = ko.computed;

    var enumState = fxEnum.state;
    var dashboardState = enumState.stateAndMessage();
    var application = fxDataContext.Application;
    var dashboardViewApi = application.dashboardView;
    
    function model(params) {
        function getDashboardInfo(){
            dashboardState.setLoading();
            var option = {
                success: onSuccess,
                fail: onFail
            };
            dashboardViewApi.getAll(option,option);
            function onSuccess(data) {
                dashboardInfo(data);
                console.log(dashboardInfo());
                dashboardState.setCompleted();
            }
            function onFail() {
                dashboardState.setError();
            }
        }
        //#region Param properties
        var fxQuadrant = params.quadrantViewModel;
        var quadrantComposer = fxQuadrant.quadrantComposer;
        var koVisual = quadrantComposer.visual;
        var refreshQuadrant = fxQuadrant.refreshQuadrant;
        var refreshVisual = quadrantComposer.refreshVisual;
        //#endregion

        //#region Public properties
        var dashboardInfo = observableArray();
        var dropdown = observable("0px");
        var selectedCount = observable(0);
        var selectedDashboardInfo = observableArray();


        //#endregion

        //#region event

        var changeDashboardEvent = function(value, element){
            var el = d3.select(element.currentTarget);
            var arrInfo = selectedDashboardInfo() || [];
            var selCount = selectedCount();
            if(el.classed("selected") == false){
                el.classed("selected", true);
                arrInfo.push(value);

                selCount++;
                el.style("background-color","#d7d7d7");
            }else{
                el.classed("selected", false);
                arrInfo = arrInfo.filter(item => !_.isEqual(item.dashboardViewId,value.dashboardViewId))

                selCount--;
                el.style("background-color","#FFFFFF");
            }
            selectedDashboardInfo(arrInfo);
            selectedCount(selCount);

            setNRefresh("selectedDashboardInfo", arrInfo);
            refreshQuadrant();
        }

        var initPropertiesValue = computed(function () {
            var visual = koVisual();
            if (!visual)
                return;

            if(visual.parameters.selectedDashboardInfo){
                selectedDashboardInfo(visual.parameters.selectedDashboardInfo);
                selectedCount(selectedDashboardInfo().length)
            }

            return;
        });

        ko.bindingHandlers.toggleDropdown = {
            init: function (element, valueAccessor) {
                var value = valueAccessor();

                ko.utils.registerEventHandler(element, "click", function () {
                    if(value() == "0px")
                        value("200px");
                    else
                        value("0px");


                });
            }
        }

        ko.bindingHandlers.updateSelection = {
            init: function(element) {
                var thisData = ko.dataFor(element).dashboardViewId; 
                var info = selectedDashboardInfo().map(id => id.dashboardViewId);
                _.forEach(info, function(d){
                    if(thisData == d){
                        d3.select(element).style("background-color","#d7d7d7").classed("selected", true);
                        return;
                    }
                })
            }    
        };

        //See initEvent

        //#endregion

        init();

        function init() {
            getDashboardInfo()
            initEvent();
        }

        function initEvent() {

        }

        //#region Private Methods
        function setNRefresh(propertyKey, newValue) {
            var visual = koVisual();
            if (visual[propertyKey] === newValue)
                return;

            visual[propertyKey] = newValue;
            var parameters = visual.parameters || {};
            parameters[propertyKey] = newValue;
            visual.parameters = parameters;
        }

        //#endregion

        var me = this;
        $.extend(true, me, {
            //binding
            selectedCount:selectedCount,
            selectedDashboardInfo:selectedDashboardInfo,
            dashboardInfo:dashboardInfo,
            dropdown:dropdown,
            changeDashboardEvent:changeDashboardEvent,
        });

        return;
    }

    return {
        viewModel: model
    };

})(ko, _, leesa, fx, fx.DataContext, fx.util, fx.enum);