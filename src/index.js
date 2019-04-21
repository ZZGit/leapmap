import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import {
  getMapOption, getProvinceArea, dataShowMode,
} from './utils';
import './mapdata';

const propTypes = {
  mode: PropTypes.string,
  map: PropTypes.string,
  data: PropTypes.array,
  style: PropTypes.object,
  legend: PropTypes.object,
  visualMap: PropTypes.object,
  tooltip: PropTypes.object,
  toolbox: PropTypes.object,
  title: PropTypes.object,
  backgroundColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  onClick: PropTypes.func,
};

const defaultProps = {
  mode: dataShowMode.area,
};

class LeapMap extends React.Component {
  onClickArea(param) {
    const { onClick } = this.props;
    const area = getProvinceArea(param.name);
    if (onClick) onClick(area);
  }

  render() {
    const { style } = this.props;
    const option = getMapOption(this.props);
    return (
      <ReactEcharts
        style={style}
        option={option}
        notMerge
        lazyUpdate
        onEvents={{
          click: param => this.onClickArea(param),
        }}
      />
    );
  }
}

LeapMap.propTypes = propTypes;

LeapMap.defaultProps = defaultProps;

export default LeapMap;
