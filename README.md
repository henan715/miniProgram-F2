## 一、工程介绍

[F2](https://f2.antv.vision/zh)是阿里推出的移动平台图表可视化解决方案，不过官方的文档对新手而言不是特别友好，我在学习的过程中趟了不少坑，特别是在数据延迟加载这一块，官方给出的demo（wx-f2仓库里面已经没有了，我加在仓库的”官方Demo“文件夹中了）中k线页面是模拟了延迟加载的情况，不过我的需求是：

1. 封装图表为组件，因为我的一些页面中会有多个图表；
2. 在页面中通过`wx.request()`方法获取数据，然后以参数的形式传递到图表组件中；
3. 图表组件获取参数后，动态改变内容进行显示；

我想也会有很多人是和我一样的需求，因此摸索了2天，将自己的填坑记录整理在这里。



## 二、踩坑记录

- 引用那个库的问题

  在[官方的仓库](https://github.com/antvis/wx-f2)中，需要安装的库名称是`@antv/wx-f2`，而官方demo中引用的却是`@anv/ff-canvas`这个库，导致我刚开始一直引包失败，我在[官方语雀文档](https://www.yuque.com/antv/f2/miniprogram)中找到这样一段话：

  > 和上面小程序版本不同之处在于，my-f2是用f2的方式较为自定义底层地绘制，而mini-chart是封装成了自定义组件的形式，在使用上要简单些。

  这是支付宝小程序里面使用F2的说明，所以我猜测，`@antv/ff-canvas`也是偏向于前者，官方本应该提供更为简单的后者方便小程序开发，至于为啥没提供，咱也不知道~



- 图表不显示的问题

  在官方的demo中，以`bar`页面为例：
  
  ```html
  <!-- index.html -->
  <view class="container">
    <ff-canvas id="bar-dom" canvas-id="bar" opts="{{ opts }}"></ff-canvas>
  </view>
  ```
  
  在css中只定义了`ff-canvas`的样式，但却没有指定上层view的样式，这会导致图表无法显示出来，这边记得调整为：
  
  ```css
  ff-canvas {
    width: 100%;
    height: 100%;
  }
  
  /* 添加上层view的样式 */
  .container{
    width: 100%;
    height: 500rpx;
  }
  ```
  
- 图表显示模糊的问题

  先说结论：重启机器后问题没有再重现。在周六周末调试的过程中，突然图表显示发虚、分辨率很差，很奇怪，我重新新建工程、跑 官方的demo都是一样的模糊，网上查找资料后也没有相关的材料，只是在涉及`canvas`绘图中有人提到，图表的显示和屏幕的像素比例有关，小程序中可以通过如下代码获取像素比:

  ```javascript
  //获取设备像素比
  const getPixelRatio = () => {
    let pixelRatio = 0
    wx.getSystemInfo({
      success: function (res) {
        pixelRatio = res.pixelRatio
      },
      fail: function () {
        pixelRatio = 0
      }
    })
    return pixelRatio
  }
  ```

  在图表实例创建时，指定像素比：

  ```javascript
  chart = new F2.Chart({
      el: canvas,
      width,
      height,
      pixelRatio:2 // 这里直接调用上面函数的返回值2
    });
  ```

  不过并没有啥效果，折腾到晚上12点，无解，然后第二天重启电脑，图表又清晰了，很诡异的问题，暂且记录在这边。

  

## 三、延迟加载

在官方demo的k线样例中，已经提供了比较好的代码示例（不过接口好像失效了，导致demo无法使用，不过逻辑还是通的），这边简单介绍一下，大佬可以直接看代码。

首先，给组件添加一个`opts`参数

```html
<view class="container">
  <ff-canvas id="kChart" canvas-id="kChart" opts="{{ opts }}"></ff-canvas>
</view>

```

其次，在页面的的`data`中添加延迟加载的参数配置：

```javascript
Page({
  data: {
    opts: {
      lazyLoad: true // 延迟加载组件
    }
  },
 ...... 
}
```

随后，在`onLoad`生命周期函数中，调用`wx.request()`方法，在回调函数中有这样一段：

```javascript
const self = this;

// 获取页面dom节点
self.chartComponent = self.selectComponent('#kChart');
// 调用init方法初始化并显示数据
self.chartComponent.init((canvas, width, height) => {
  // 创建chart对象
  const chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  // 具体的图表参数、数据配置代码
  ......
}
```

官方的案例结构逻辑很清晰，不过将所有的代码都写在`onLoad`方法里面实在有些难受，在demo的`bar`页面代码中，官方把这些代码封装成了一个`initChart`方法，我们直接参考将之提取出来即可，这样代码就非常清晰：

```javascript
function initChart(canvas, width, height, F2) {
  chart = new F2.Chart({el: canvas, width, height});
  /*
  图表的配置、数据处理部分
  */
  chart.render();
  return chart;
}

Page({
  /*调用initChart方法*/
})
```

在抽取方法的过程中，我想到：可以给函数增加一些新的参数，这些参数是页面以参数的形式发送给组件的，这样就实现了数据和图表展示的分离，自然而然的就可以进行异步数据加载（Page请求数据-->Component接收数据参数—>Component初始化图表显示数据），所以我在自己的工程中尝试封装这些组件。



## 四、图表封装

参考k线的demo，我尝试封装了三个组件，分别是：

- `lineCanvas`：曲线图组件；
- `pieCanvas`：饼图组件；
- `lineChart`：柱状图组件；

以曲线图组件为例，先按照官方git的说明安装好库，然后，创建组件`lineCanvas`，在`json`文件中引入组件

```json
{
  "component": true,
  "usingComponents": {
    "ff-canvas":"@antv/f2-canvas"
  }
}
```

在`wxml`文件中写入：

```html
<view class="container">
  <ff-canvas id="bar-dom" canvas-id="bar-dom" opts="{{ opts }}"></ff-canvas>
</view>
```

其次，在`wxss`文件中指定图表的基础样式：

```css
ff-canvas {
  width: 100%;
  height: 100%;
}

.container{
  width: 100%;
  height: 500rpx;
}
```

然后在`js`文件中定义组件代码，注意`initChart`中需要额外添加`params`参数：

```javascript
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

  methods: {},

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
// 注意我这边添加了一个params参数作为所有信息的载体
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
```

在使用组件的页面上，首先在json文件中中引入组件：

```json
{
  "usingComponents": {
    "lineCanvas":"/components/lineCanvas/lineCanvas"
  }
}
```

然后在html中引用组件,注意这边以参数的形式传入了`params`：

```html
<lineCanvas style="display:block;" params="{{params}}"></lineCanvas>
```

最后在page的data下新建`parasm`字段：

```javascript
Page({
  data: {
    params: {
      'chartData': [
        {country: '巴西',population: 18203},
        {country: '印尼',population: 23489},
        {country: '美国',population: 29034},
        {country: '印度',population: 104970},
        {country: '中国',population: 131744}
      ],
      xAxisName: 'country',
      yAxisName: 'population'
    },
  }
  ......
}
```

`parasm`我目前只传入了固定的数据，可以根据各自的需求传递其他图表的配置参数，或者再额外添加参数来进一步提升图表的可用性，这边暂且不表。



在封装的过程中，我还参考了钉钉使用F2的，[Git仓库在这里](https://github.com/Darren-chenchen/dd-f2-test)，这个案例进一步封装了参数，并且做了非常好的组件代码优化，有需要的小伙伴可以参考一下。



最后，如果觉得我的仓库给了您一丝丝的帮助，不妨来个star鼓励一下哈，刚学js没一个月，也欢迎有更好解决方法的大佬给予指导~Thanks！