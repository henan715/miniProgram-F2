Component({
  properties: {
    params:{
      type:Object,
      value:{}
    }
  },

  data: {
    opts: {
      lazyLoad:true
    },
  },

  methods: {

  },

  lifetimes: {
    attached:function(){
      var that = this;
      setTimeout(()=>{
        that.ct = that.selectComponent('#bar-dom');
        let params = that.properties.params;
        that.ct.init((canvas, width, height, F2) => initChart(canvas, width, height, F2, params))
      },2000)
    }
  }
})


let chart = null;
function initChart(canvas, width, height, F2, params) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height,
    pixelRatio: 2
  });

  var Global = F2.Global;

  var data = params.chartData;

  chart.source(data, {
    population: {
      tickCount: 5
    }
  });
  chart.coord({
    transposed: true
  });
  chart.axis(params.xAxisName, {
    line: Global._defaultAxis.line,
    grid: null
  });
  chart.axis(params.yAxisName, {
    line: null,
    grid: Global._defaultAxis.grid,
    label: function label(text, index, total) {
      var textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.interval().position(`${params.xAxisName}*${params.yAxisName}`);
  chart.render();

  return chart;
}