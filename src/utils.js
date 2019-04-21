import echarts from 'echarts';

export const chinaMapKey = 'china';

const maxValue = data => (data.length ? data.sort((a, b) => b.value - a.value)[0].value : 0);
const minValue = data => (data.length ? data.sort((a, b) => a.value - b.value)[0].value : 0);

export const dataShowMode = {
  area: 'area',
  scatter: 'scatter',
};

export const getAreaData = (map, name) => {
  const {
    geoJson: { features },
  } = echarts.getMap(map);
  const data = features.filter(f => name === f.properties.name)[0];
  return data ? {
    id: data.id,
    name: data.properties.name,
    cp: data.properties.cp,
  } : {};
};

export const getProvinceArea = name => getAreaData(chinaMapKey, name);

const getMapData = (map, id) => {
  const {
    geoJson: { features },
  } = echarts.getMap(map);
  return features.filter(f => id === f.id)[0];
};

const convertScatterData = (map, data) => data
  .map((d) => {
    const coordData = getMapData(map, d.id);
    return coordData
      ? {
        name: coordData.properties.name,
        value: [...coordData.properties.cp, d.value],
      }
      : coordData;
  })
  .filter(d => !!d);

const convertAreaData = (map, data) => data
  .map((d) => {
    const coordData = getMapData(map, d.id);
    return coordData
      ? {
        name: coordData.properties.name,
        value: d.value,
      }
      : coordData;
  })
  .filter(d => !!d);

const optionSeriesArea = (map, data, geo) => ({
  name: '',
  type: 'map',
  map,
  data: convertAreaData(map, data),
  label: { show: true },
  ...geo,
});

const optionSeriesScatter = (map, data) => (
  {
    type: 'scatter',
    coordinateSystem: 'geo',
    data: convertScatterData(map, data),
    symbolSize: 15,
  }
);

const defaultOption = {
  geo: {
    roam: true,
    label: {
      show: true,
    },
  },
  backgroundColor: '#FFFFFF',
  title: {
    x: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      restore: {},
      saveAsImage: {},
    },
  },
};

/**
 * Echarts 属性
 * https://www.echartsjs.com/option.html
 * @type {{
 *  geo: (function(*=, *): {map: *}),
 *  title: (function(*): {}),
 *  backgroundColor: (function(*=)),
 *  tooltip: (function(*): {}),
 *  visualMap: (function(*=, *))}}
 */
const option = {
  geo: (map, mode, custom) => {
    if (dataShowMode.area === mode) return null;
    return {
      ...defaultOption.geo,
      ...custom,
      map: map || chinaMapKey,
    };
  },
  title: custom => ({ ...defaultOption.title, ...custom }),
  backgroundColor: (custom) => {
    if (typeof custom === 'string') return custom || defaultOption.backgroundColor;
    if (typeof custom === 'object') return { ...defaultOption.backgroundColor, ...custom };
    return defaultOption.backgroundColor;
  },
  tooltip: (mode, custom) => ({
    ...defaultOption.tooltip,
    formatter: ({name, value}) => (`${name} : ${mode === dataShowMode.scatter ? value[2] : value}`),
    ...custom,
  }),
  visualMap: (data, custom) => {
    if (!data.length) return null;
    const visualMap = {
      type: 'continuous',
      min: minValue(data),
      max: maxValue(data),
      calculable: true,
    };
    return { ...visualMap, ...custom };
  },
  series: (map, data, mode, geo) => {
    const mapKey = map || chinaMapKey;
    switch (mode) {
      case dataShowMode.area:
        return optionSeriesArea(mapKey, data, geo);
      case dataShowMode.scatter:
        return optionSeriesScatter(mapKey, data);
      default: return null;
    }
  },
};

/**
 * 获取地图Option
 * @param option
 */
export const getMapOption = ({
  map,
  data,
  mode,
  geo,
  title,
  backgroundColor,
  tooltip,
  visualMap,
}) => ({
  geo: option.geo(map, mode, geo),
  title: option.title(title),
  backgroundColor: option.backgroundColor(backgroundColor),
  tooltip: option.tooltip(mode, tooltip),
  visualMap: option.visualMap(data, visualMap),
  series: option.series(map, data, mode, geo),
});
