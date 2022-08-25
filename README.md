# React Hot zone
react 热区resize组件

## Installation
```
knpm install @kkb/hot-zone --save
```


## Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import HotZoneWrap from '@kkb/hot-zone'
import img from './imgs/img.jpg'

class App extends React.Component {
  state = {
    coordinates: [],
  }

  changeCoordinate = (coordinate, index, coordinates) => {
    this.setState({
      coordinates,
    })
  }
  deleteCoordinate = (coordinate, index, coordinates) => {
    this.setState({
      coordinates,
    })
  }
  onDoubleClick = () => {
    console.log("双击事件")
  }
  render() {
    return
        <HotZoneWrap
          src={img}
          width={1000}
          coordinates={this.state.coordinates}
          onChange={this.changeCoordinate}
          onDelete={this.deleteCoordinate}
          onDoubleClick={this.onDoubleClick}
          hidden={false}
        />
      </div>
  }
}


ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('root'),
)

```

## Props

| Prop        | Description                                                  | Type                                     | Default |
| ----------- | ------------------------------------------------------------ | ---------------------------------------- | ------- |
| src         | 图片链接                                                      | string                                   | -       |
| coordinates | 热区拖拽信息 {id, x, y, width, height, urlLink}. | array                       | []      |
| width       | 图片宽度                                                      | number(in pixel)                         | -       |
| clientWidth | 拖拽窗口宽度（默认 320） B端配置区                               | number(in pixel)                         | -       |
| height      | 图片高度                                                      | number(in pixel)                         | -       |
| hidden      | 热区是否显性展示                                               | bool                                     |
| isMobile    | 是否支持手机端 默认false                                       | bool                                     |
| onDraw      | 创建新热区                                                    | funtion(coordinate , index, coordinates) | -       |
| onDrag      | 拖拽事件                                                      | funtion(coordinate , index, coordinates) | -       |
| onResize    | Resize事件                                                   | funtion(coordinate , index, coordinates) | -       |
| onChange    | 热区变化事件                                                  | funtion(coordinate , index, coordinates) | -       |
| onDelete    | 热区删除事件                                                  | funtion(coordinate , index, coordinates) | -       |
| onDoubleClick| 热区双击事件  （hiden为true时触发）                            | onLoad(e)                                | -       |


### coordinate

| Prop   | Description                                                  | Type             | Default |
| ------ | ------------------------------------------------------------ | ---------------- | ------- |
| id     | id                                                           | string           | -       |
| x      | X                                                            | number(in pixel) | -       |
| y      | Y                                                            | number(in pixel) | -       |
| width  | Width                                                        | number(in pixel) | -       |
| height | Height                                                       | number(in pixel) | -       |

