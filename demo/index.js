import React from 'react';
import ReactDOM from 'react-dom';
import LeapMap from '../src/index';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: '',
      data: [],
    };
  }

  componentDidMount() {
    this.setChinaData();
  }

  setChinaData = () => {
    this.setState({
        map:'',
      data: [
        { id: '370000', value: 1000 },
        { id: '110000', value: 2000 },
        { id: '140000', value: 3000 },
      ],
    });
  }

  setProvinceData(map) {
    this.setState({
      map,
      data: [
        { id: '370200', value: 1000 },
        { id: '370100', value: 2000 },
      ],
    });
  }

  render() {
    const { map, data } = this.state;
    return (
      <div>
        <button type="button" e href="#" onClick={this.setChinaData}>返回上级</button>
        <LeapMap
          style={{ width: '100%', height: 500 }}
          map={map}
          data={data}
          onClick={(area) => {
            this.setProvinceData(area.name);
          }}
          title={{
            text: '地图下钻演示',
          }}
          geo={{
            zoom: 1.2,
          }}
        />
      </div>
    );
  }
}


ReactDOM.render(<Demo />, document.getElementById('root'));
