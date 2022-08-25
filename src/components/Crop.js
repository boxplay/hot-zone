import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals, is, update, remove } from 'ramda';
import interact from 'interactjs';
import { DeleteIcon, NumberIcon } from './Icons';
import { isMobile } from '../utils';

class Crop extends Component {
  cropStyle = (coordinate, isMobile, imgW, clientWidth) => {
    const { hidden } = this.props;
    const { x, y, width, height } = coordinate;
    let mobileStyle = {};
    if (isMobile && hidden) {
      const per = imgW / clientWidth;
      mobileStyle = {
        width: width * per,
        height: height * per,
        left: x * per,
        top: y * per,
      };
    }
    return {
      // border: '1px dotted rgba(153,153,153,1)',
      // background: 'rgba(153,153,153,0.3)',
      display: 'inline-block',
      position: 'absolute',
      width,
      height,
      top: y,
      left: x,
      boxShadow: '0 0 6px #000',
      borderRadius: '2px',
      border: ' 2px dashed #FF3F3F',
      background: 'rgba(255, 200, 200)',
      opacity: hidden ? 0 : 0.6,
      cursor: hidden ? 'pointer' : '',
      ...mobileStyle,
    };
  };

  componentDidMount() {
    const { hidden } = this.props;
    !hidden &&
      interact(this.crop)
        .draggable({})
        .resizable({
          edges: {
            left: true,
            right: true,
            bottom: true,
            top: true,
          },
        })
        .on('dragmove', this.handleDragMove)
        .on('resizemove', this.handleResizeMove);
  }

  shouldComponentUpdate(nextProps) {
    // reduce uncessary update
    return (
      !equals(nextProps.coordinate, this.props.coordinate) ||
      nextProps.index !== this.props.index
    );
  }

  handleResizeMove = (e) => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onResize,
      onChange,
    } = this.props;
    const { width, height } = e.rect;
    const { left, top } = e.deltaRect;

    const nextCoordinate = {
      ...coordinate,
      x: x + left,
      y: y + top,
      width,
      height,
    };
    const nextCoordinates = update(index, nextCoordinate)(coordinates);
    if (is(Function, onResize)) {
      onResize(nextCoordinate, index, nextCoordinates);
    }
    if (is(Function, onChange)) {
      onChange(nextCoordinate, index, nextCoordinates);
    }
  };
  handleDragMove = (e) => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onDrag,
      onChange,
    } = this.props;
    const { dx, dy } = e;
    const nextCoordinate = { ...coordinate, x: x + dx, y: y + dy };
    const nextCoordinates = update(index, nextCoordinate)(coordinates);
    if (is(Function, onDrag)) {
      onDrag(nextCoordinate, index, nextCoordinates);
    }

    if (is(Function, onChange)) {
      onChange(nextCoordinate, index, nextCoordinates);
    }
  };

  handleDelete = () => {
    const { index, coordinate, onDelete, coordinates } = this.props;
    const nextCoordinates = remove(index, 1)(coordinates);
    if (is(Function, onDelete)) {
      onDelete(coordinate, index, nextCoordinates);
    }
  };

  setUrlParam = (url) => {
    let vars = url.split('?');
    let newUrl = url;
    let searchStr = (window && window.location && window.location.search) || '';
    if (vars.length >= 2 && vars[1].length) {
      if (searchStr) {
        searchStr = searchStr.substring(1);
        vars[1] = vars[1] += `&${searchStr}`;
        newUrl = vars.join('?');
      }
    } else {
      if (searchStr) {
        vars[0] = vars[0] += searchStr;
        newUrl = vars.join('');
      }
    }
    return this.h5RedirectApp(newUrl);
  };

  isApp = () => {
    const ua =
      navigator && navigator.userAgent && navigator.userAgent.toLowerCase();
    if (ua.indexOf('kkbmobile') !== -1) {
      return true;
    }
    return false;
  };

  // 公开课APP内：https://testwww.kaikeba.com/app/appopen/item?c=517
  // 公开课H5：https://testwww.kaikeba.com/open/item?c=517
  //
  // 体验课APP内：https://testwww.kaikeba.com/app/appexperience/item?c=348
  // 体验课H5：https://testwww.kaikeba.com/experience/detail?id=348&channelCode=plat59xtq7q63q
  //
  // 体验课APP内：https://testwww.kaikeba.com/app/appvip/detail?id=401
  // VIP课H5：https://testwww.kaikeba.com/course/vip/401
  h5RedirectApp = (url) => {
    let vars = url.split('?');
    const courseMap = {
      'kaikeba.com/open': 'www.kaikeba.com/app/appopen/item',
      'kaikeba.com/experience/detail': 'www.kaikeba.com/app/appexperience/item',
      'kaikeba.com/course/vip': 'www.kaikeba.com/app/appvip/detail',
    };
    if (this.isApp()) {
      for (let k in courseMap) {
        if (vars[0] && vars[0].includes(k)) {
          // 判断vip 取特殊参数
          if (k === 'kaikeba.com/course/vip') {
            const ids = vars[0].split('/');
            if (ids.length) {
              vars[1] =
                `id=${ids[ids.length - 1]}` + (vars[1] ? '&' + vars[1] : '');
            }
          }
          // 判断体验课 取特殊参数
          if (k === 'kaikeba.com/experience/detail') {
            const ids = vars[1] ? vars[1].split('&') : [];
            let obj = {};
            ids.length &&
              ids.map((item) => {
                const keyVal = item.split('=');
                obj[keyVal[0]] = keyVal[1];
              });
            if (obj['id']) {
              vars[1] = `c=${obj['id']}&` + vars[1];
            }
          }
          // 判断test or prod
          if (vars[0].includes('testwww')) {
            vars[0] = 'https://test' + courseMap[k];
          } else {
            vars[0] = 'https://' + courseMap[k];
          }
          break;
        }
      }
    }
    return vars.join('?');
  };

  openUrl = (link) => {
    const { hidden } = this.props;
    if (link && hidden) {
      const href = this.setUrlParam(link);
      if (isMobile()) {
        window.location.href = href;
      } else {
        window.open(href, '_blank');
      }
    }
  };

  componentWillUnmount() {
    interact(this.crop).unset();
  }

  hrefOrFunction = (coordinate) => {
    const { isFunction, hotCallBack, isHavePoint } = this.props;
    if (isFunction) {
      hotCallBack && hotCallBack();
    } else if (
      isHavePoint &&
      coordinate.courseMap &&
      coordinate.courseMap.hrefName
    ) {
      hotCallBack && hotCallBack(coordinate.courseMap.hrefName);
    } else {
      this.openUrl(coordinate.urlLink || null);
    }
  };

  render() {
    const {
      coordinate,
      index,
      hidden,
      isMobile,
      width,
      clientWidth,
      onDoubleClick,
    } = this.props;
    return (
      <div
        name={
          coordinate.courseMap && coordinate.courseMap.elementName
            ? coordinate.courseMap.elementName
            : ''
        }
        onClick={() => {
          this.hrefOrFunction(coordinate);
          console.log('热区组件数据', coordinate);
          // // 添加埋点属性;
          // if (coordinate.courseMap && coordinate.courseMap.elementName) {
          //   document
          //     .querySelector('#clickPointId')
          //     .setAttribute('name', coordinate.courseMap.elementName);
          // }
        }}
        onDoubleClick={() => onDoubleClick(coordinate, index)}
        style={this.cropStyle(coordinate, isMobile, width, clientWidth)}
        ref={(crop) => (this.crop = crop)}
      >
        {!hidden && <NumberIcon number={index + 1} />}
        {!hidden && <DeleteIcon onClick={this.handleDelete} />}
      </div>
    );
  }
}

export const coordinateType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  urlLink: PropTypes.string,
  courseMap: PropTypes.object,
});

Crop.propTypes = {
  coordinate: coordinateType.isRequired,
  index: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  clientWidth: PropTypes.number,
  hidden: PropTypes.bool,
  isMobile: PropTypes.bool,
  urlLink: PropTypes.string,
  onResize: PropTypes.func,
  onDrag: PropTypes.func,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
  onDoubleClick: PropTypes.func,
  coordinates: PropTypes.array,
};

export default Crop;
