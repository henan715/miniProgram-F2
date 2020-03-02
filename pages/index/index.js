Page({
  data: {
    params: {
      'chartData': [{
          country: '巴西',
          population: 18203
        },
        {
          country: '印尼',
          population: 23489
        },
        {
          country: '美国',
          population: 29034
        },
        {
          country: '印度',
          population: 104970
        },
        {
          country: '中国',
          population: 131744
        }
      ],
      xAxisName: 'country',
      yAxisName: 'population'
    },

    pieParams : {
      'pieData':[
        {
          name: '其他消费',
          y: 6371664,
          const: 'const'
        }, {
          name: '生活用品',
          y: 7216301,
          const: 'const'
        }, {
          name: '通讯物流',
          y: 1500621,
          const: 'const'
        }, {
          name: '交通出行',
          y: 586622,
          const: 'const'
        }, {
          name: '饮食',
          y: 900000,
          const: 'const'
        }
      ],
      xAxisName: 'name',
      yAxisName: 'y',
      constItemName:'const'
    }
  },

  onLoad: function(options) {
    // console.log(this.data.params)
  },



});