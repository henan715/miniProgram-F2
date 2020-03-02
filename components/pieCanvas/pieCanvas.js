Component({
  properties: {
    params: {
      type: Object,
      value: {}
    }
  },

  data: {
    opts: {
      lazyLoad: true
    },
  },

  methods: {},

  lifetimes: {
    attached: function() {
      var that = this;
      setTimeout(() => {
        that.ct = that.selectComponent('#pie-dom');
        let params = that.properties.params;
        that.ct.init((canvas, width, height, F2) => initChart(canvas, width, height, F2, params))
      }, 2000)
    }
  }
});

let chart = null;

function initChart(canvas, width, height, F2, params) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height,
    pixelRatio: 2
  });

  var Global = F2.Global;
  var data = params.pieData;
  chart.source(data);

  chart.coord('polar', {
    transposed: true,
    radius: 0.85
  });
  chart.legend(false);
  chart.axis(false);
  chart.tooltip(false);
  // 添加饼图
  chart.pieLabel({
    sidePadding:40,
    label1:function label1(data, color){
      return {
        text:data.name,
        fill: color
      }
    },
    label2:function label2(data){
      return {
        text: '￥' + String(Math.floor(data.y * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        fill: '#808080',
        fontWeight: 'bold'
      };
    }
  });
  chart.interval()
  .position(`const*y`)
  .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864'])
    .adjust('stack')
    .style({
      lineWidth: 1,
      stroke: '#fff',
      lineJoin: 'round',
      lineCap: 'round'
    })
    .animate({
      appear: {
        duration: 1200,
        easing: 'bounceOut'
      }
    });

  chart.render();
  return chart;
}