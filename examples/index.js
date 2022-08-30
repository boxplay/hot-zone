import React from 'react'
import ReactDOM from 'react-dom'
import HotZoneWrap from '../src/components/HotZoneWrap'
import img from './imgs/img.png'


class App extends React.Component {
  state = {
    coordinates: [
      {
        x: 178, y: 91, width: 158, height: 132, id: 'SJxb6YpuG',
        urlLink: 'https://www.baidu.com'
      },
      // {
      //   x: 436, y: 97, width: 170, height: 168, id: 'SJMZ6YTdf',
      // },
    ],
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
  onDoubleClick = (coordinate, index) => {
    console.log(coordinate);
    console.log(index);
  }
  render() {
    return (
      <div style={{width: '100%',margin: "0 auto"}}>
        <h1>Dragging, Drawing, Resizing rectangles on the img</h1>
        <HotZoneWrap
          src={img}
          coordinates={this.state.coordinates}
          // onDrag={this.changeCoordinate}
          // onResize={this.changeCoordinate}
          // onDraw={this.changeCoordinate}
          onChange={this.changeCoordinate}
          onDelete={this.deleteCoordinate}
          onDoubleClick={this.onDoubleClick}
          hidden={false}
          isMobile={false}
          width={800} //根据手机可变
          clientWidth={320} //B端配置区width
          // onLoad={e => console.log(e.target.height, e.target.width)}
        />
      </div>
    )
  }
}


ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('root'),
)
