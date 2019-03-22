"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Chart =
/*#__PURE__*/
function () {
  function Chart(name, data) {
    _classCallCheck(this, Chart);

    _defineProperty(this, "chartName", null);

    _defineProperty(this, "contexts", {
      bg: null,
      // background
      xl: null,
      // x labels
      yl: null,
      // y labels
      ynl: null,
      // y next labels (animation)
      yfl: null // y first label (static)

    });

    _defineProperty(this, "columns", []);

    _defineProperty(this, "xValues", null);

    _defineProperty(this, "control", {
      wrapper: null,
      left: null,
      right: null,
      width: 100,
      // px
      rightPos: 0,
      clickedLayerX: null,
      isActive: false
    });

    _defineProperty(this, "currentMultiplier", null);

    _defineProperty(this, "currentTimelineMultiplier", null);

    _defineProperty(this, "currentPeriod", null);

    _defineProperty(this, "currentTimelinePeriod", null);

    _defineProperty(this, "currentColumn", null);

    this.chartName = name;
    this.calculateChartData(data);
    this.controlMoveHandler = this.controlMoveHandler.bind(this);
  }

  _createClass(Chart, [{
    key: "init",
    value: function init() {
      this.createBackgroundContexts();
      this.createColumnsContextsAndButtons();
      this.createControl();
      this.drawChart();
      this.drawTimeline();
      console.log(this);
    }
  }, {
    key: "createBackgroundContexts",
    value: function createBackgroundContexts() {
      var _this = this;

      Object.keys(this.contexts).forEach(function (ctx) {
        _this.contexts[ctx] = createCanvasContext('BG', _this.chartName, ctx);
      });
    }
  }, {
    key: "createColumnsContextsAndButtons",
    value: function createColumnsContextsAndButtons() {
      var _this2 = this;

      this.columns.forEach(function (column) {
        _this2.createColumnContext(column);

        _this2.createColumnButton(column);
      });
    }
  }, {
    key: "createColumnContext",
    value: function createColumnContext(column) {
      var chartName = this.chartName;
      column.ctx = createCanvasContext('COLUMN', chartName, column.name);
      column.timeline = createTimeline(chartName, column.name);
    }
  }, {
    key: "createColumnButton",
    value: function (_createColumnButton) {
      function createColumnButton(_x) {
        return _createColumnButton.apply(this, arguments);
      }

      createColumnButton.toString = function () {
        return _createColumnButton.toString();
      };

      return createColumnButton;
    }(function (column) {
      var color = column.color,
          title = column.title,
          name = column.name;
      var button = createColumnButton(this.chartName, color, title, name);
      button.addEventListener('click', this.toggleChartLine.bind(this, name));
      column.button = button;
    })
  }, {
    key: "createControl",
    value: function (_createControl) {
      function createControl() {
        return _createControl.apply(this, arguments);
      }

      createControl.toString = function () {
        return _createControl.toString();
      };

      return createControl;
    }(function () {
      var chartName = this.chartName,
          control = this.control;

      var _createControl2 = createControl(chartName, control.width, control.rightPos),
          wrapper = _createControl2.wrapper,
          controlLeft = _createControl2.controlLeft,
          controlRight = _createControl2.controlRight;

      wrapper.addEventListener('mousedown', this.controlMouseDownHandler.bind(this));
      window.addEventListener('mouseup', this.controlMouseUpHandler.bind(this));
      this.control = _objectSpread({}, control, {
        wrapper: wrapper,
        controlLeft: controlLeft,
        controlRight: controlRight
      });
    })
  }, {
    key: "calculateChartData",
    value: function calculateChartData(data) {
      var _this3 = this;

      var columns = data.columns,
          colors = data.colors,
          names = data.names,
          types = data.types;
      columns.forEach(function (column) {
        var label = column[0];
        column = column.slice(1);

        if (types[label] === 'x') {
          _this3.xValues = column;
        } else if (types[label] === 'line') {
          _this3.columns.push({
            name: label,
            title: names[label],
            values: column,
            currentValues: [],
            color: colors[label],
            max: Math.max.apply(Math, _toConsumableArray(column)),
            currentValuesMax: 0,
            isVisible: true,
            button: null,
            ctx: null
          });
        }
      });
    }
  }, {
    key: "drawChart",
    value: function drawChart() {
      var _this4 = this;

      var columns = this.columns,
          contexts = this.contexts,
          xValues = this.xValues,
          _this$control = this.control,
          width = _this$control.width,
          rightPos = _this$control.rightPos;
      var bg = contexts.bg,
          xl = contexts.xl,
          yl = contexts.yl,
          yfl = contexts.yfl;
      columns.forEach(function (column) {
        column.currentValues = calculateCurrentValues(column.values, width, rightPos);
        column.currentValuesMax = Math.max.apply(Math, _toConsumableArray(column.currentValues));
      });
      var maxValue = Math.max.apply(Math, _toConsumableArray(columns.map(function (column) {
        return column.isVisible && column.currentValuesMax;
      })));
      this.currentPeriod = getPeriod(maxValue);
      this.currentMultiplier = getMultiplier(this.currentPeriod);
      drawCoords(bg, yfl);
      writeXLabels(xl, xValues);
      writeYLabels(yl, yfl, this.currentPeriod);
      columns.forEach(function (column) {
        drawChartLine(column, _this4.currentMultiplier);
      });
    }
  }, {
    key: "drawTimeline",
    value: function drawTimeline() {
      var _this5 = this;

      var columns = this.columns;
      var maxValue = Math.max.apply(Math, _toConsumableArray(columns.map(function (column) {
        return column.isVisible && column.max;
      })));
      this.currentTimelinePeriod = getPeriod(maxValue);
      this.currentTimelineMultiplier = getTimelineMultiplier(this.currentTimelinePeriod);
      columns.forEach(function (column) {
        drawTimelineChartLine(column, _this5.currentTimelineMultiplier);
      });
    }
  }, {
    key: "redrawChartWithAnimation",
    value: function redrawChartWithAnimation() {
      var _this6 = this;

      var columns = this.columns,
          _this$control2 = this.control,
          width = _this$control2.width,
          rightPos = _this$control2.rightPos;
      columns.forEach(function (column) {
        column.currentValues = calculateCurrentValues(column.values, width, rightPos);
        column.currentValuesMax = Math.max.apply(Math, _toConsumableArray(column.currentValues));
      });
      var maxCurrentValue = Math.max.apply(Math, _toConsumableArray(columns.map(function (column) {
        return column.isVisible && column.currentValuesMax;
      })));
      var maxValue = Math.max.apply(Math, _toConsumableArray(columns.map(function (column) {
        return column.isVisible && column.max;
      })));
      var prevMultiplier = this.currentMultiplier;
      var prevTimelineMultiplier = this.currentTimelineMultiplier;

      if (maxCurrentValue) {
        this.currentPeriod = getPeriod(maxCurrentValue);
        this.currentTimelinePeriod = getPeriod(maxValue);
        this.currentMultiplier = getMultiplier(this.currentPeriod);
        this.currentTimelineMultiplier = getTimelineMultiplier(this.currentTimelinePeriod);
      }

      if (prevMultiplier === this.currentMultiplier) {
        this.chartColumnAnimation(this.currentMultiplier, this.currentColumn, true);
        this.chartTimelineColumnAnimation(this.currentTimelineMultiplier, this.currentColumn, true);
      } else {
        this.chartCoordsAnimation(prevMultiplier);
        this.chartYLabelAnimation(prevMultiplier);
        columns.map(function (column) {
          var isChangeAlpha = column.name === _this6.currentColumn.name;

          _this6.chartColumnAnimation(prevMultiplier, column, isChangeAlpha);

          _this6.chartTimelineColumnAnimation(prevTimelineMultiplier, column, isChangeAlpha);
        });
      }
    }
  }, {
    key: "chartCoordsAnimation",
    value: function chartCoordsAnimation(prevMultiplier) {
      var bg = this.contexts.bg,
          currentMultiplier = this.currentMultiplier;
      var isUp = prevMultiplier < currentMultiplier;
      var frameCount = BG_ANIMATION_FRAMES;
      var step = 0;
      var alpha = 0;

      function animate() {
        var req = requestAnimationFrame(animate);
        drawAnimatedCoords(bg, isUp, step, alpha / 10);
        step += BG_ANIMATION_FRAMES / 10;
        alpha++;
        if (step > frameCount) cancelAnimationFrame(req);
      }

      animate();
    }
  }, {
    key: "chartYLabelAnimation",
    value: function chartYLabelAnimation(prevMultiplier) {
      var _this$contexts = this.contexts,
          yl = _this$contexts.yl,
          ynl = _this$contexts.ynl,
          currentMultiplier = this.currentMultiplier,
          currentPeriod = this.currentPeriod;
      var isUp = prevMultiplier < currentMultiplier;
      var frameCount = BG_ANIMATION_FRAMES;
      var step = 0;
      var alpha = 0;

      function animate() {
        var req = requestAnimationFrame(animate);
        writeAnimatedYLabels(yl, ynl, currentPeriod, isUp, step, alpha / 10);
        step += BG_ANIMATION_FRAMES / 10;
        alpha++;
        if (step > frameCount) cancelAnimationFrame(req);
      }

      animate();
    }
  }, {
    key: "chartColumnAnimation",
    value: function chartColumnAnimation(prevMultiplier, column) {
      var isChangeAlpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var framesCount = 10;
      var currentMultiplier = this.currentMultiplier;
      var isVisible = column.isVisible;
      var isUp = prevMultiplier < currentMultiplier;
      var diff = isUp ? currentMultiplier - prevMultiplier : prevMultiplier - currentMultiplier;
      var step = 0;

      function animate() {
        var req = requestAnimationFrame(animate);
        var multiplier = prevMultiplier;
        var alpha = isChangeAlpha ? isVisible ? 0 : 100 : null;

        if (step < framesCount) {
          var point = diff / framesCount * step;
          multiplier = isUp ? prevMultiplier + point : prevMultiplier - point;
          if (isChangeAlpha) alpha = isVisible ? alpha + 10 * step : alpha - 10 * step;
        } else {
          multiplier = currentMultiplier;
          if (isChangeAlpha) alpha = isVisible ? 100 : 0;
        }

        drawChartLine(column, multiplier, isChangeAlpha ? alpha / 100 : isVisible ? 1 : 0);
        step++;
        if (step > framesCount) cancelAnimationFrame(req);
      }

      animate();
    }
  }, {
    key: "chartTimelineColumnAnimation",
    value: function chartTimelineColumnAnimation(prevMultiplier, column) {
      var isChangeAlpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var framesCount = 10;
      var currentTimelineMultiplier = this.currentTimelineMultiplier;
      var isVisible = column.isVisible;
      var isUp = prevMultiplier < currentTimelineMultiplier;
      var diff = isUp ? currentTimelineMultiplier - prevMultiplier : prevMultiplier - currentTimelineMultiplier;
      var step = 0;

      function animate() {
        var req = requestAnimationFrame(animate);
        var multiplier = prevMultiplier;
        var alpha = isChangeAlpha ? isVisible ? 0 : 100 : null;

        if (step < framesCount) {
          var point = diff / framesCount * step;
          multiplier = isUp ? prevMultiplier + point : prevMultiplier - point;
          if (isChangeAlpha) alpha = isVisible ? alpha + 10 * step : alpha - 10 * step;
        } else {
          multiplier = currentTimelineMultiplier;
          if (isChangeAlpha) alpha = isVisible ? 100 : 0;
        }

        drawTimelineChartLine(column, multiplier, isChangeAlpha ? alpha / 100 : isVisible ? 1 : 0);
        step++;
        if (step > framesCount) cancelAnimationFrame(req);
      }

      animate();
    }
  }, {
    key: "toggleChartLine",
    value: function toggleChartLine(name) {
      this.currentColumn = this.columns.find(function (column) {
        return column.name === name;
      });
      var _this$currentColumn = this.currentColumn,
          button = _this$currentColumn.button,
          color = _this$currentColumn.color,
          isVisible = _this$currentColumn.isVisible;
      this.currentColumn.isVisible = !isVisible;
      changeButtonStyle(button, color, this.currentColumn.isVisible);
      this.redrawChartWithAnimation();
    }
  }, {
    key: "controlMouseUpHandler",
    value: function controlMouseUpHandler() {
      console.log(this.control.isActive);

      if (this.control.isActive) {
        this.control.isActive = false;
        window.removeEventListener('mousemove', this.controlMoveHandler);
      }
    }
  }, {
    key: "controlMouseDownHandler",
    value: function controlMouseDownHandler(event) {
      this.control.clickedLayerX = event.layerX;
      this.control.isActive = true;
      window.addEventListener('mousemove', this.controlMoveHandler);
    }
  }, {
    key: "controlMoveHandler",
    value: function controlMoveHandler(event) {
      var _this$control3 = this.control,
          clickedLayerX = _this$control3.clickedLayerX,
          controlWidth = _this$control3.width;
      var leftPadding = (window.innerWidth - cWidth) / 2;
      var timelineWidthWithoutControl = cWidth - controlWidth;
      var newRightPos = Math.floor(cWidth - (event.clientX - leftPadding) - (controlWidth - clickedLayerX));

      if (newRightPos >= 0 && newRightPos <= timelineWidthWithoutControl) {
        this.control.rightPos = newRightPos;
      } else if (newRightPos < 0) {
        this.control.rightPos = 0;
      } else if (newRightPos > timelineWidthWithoutControl) {
        this.control.rightPos = timelineWidthWithoutControl;
      }

      moveControl(this.control);
      this.drawChart();
    }
  }]);

  return Chart;
}();