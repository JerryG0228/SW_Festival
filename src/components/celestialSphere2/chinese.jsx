import React, { useEffect } from 'react';

// D3와 Celestial 관련 스크립트 파일들은 public 폴더에 넣고 아래와 같이 static 경로로 접근합니다.
const D3_SCRIPT = '/static/d3.min.js';
const D3_GEO_SCRIPT = '/static/d3.geo.projection.min.js';
const CELESTIAL_SCRIPT = '/static/celestial.min.js';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => {
      resolve(true);
    });
    document.body.appendChild(script);
  });
};

const CelestialComponent = () => {
  useEffect(() => {
    const loadAllScripts = async () => {
      await loadScript(D3_SCRIPT);
      await loadScript(D3_GEO_SCRIPT);
      await loadScript(CELESTIAL_SCRIPT);

      const config = {
        width: 700,
        projection: 'airy',
        center: [-120, 31],
        form: true,
        background: { fill: '#333', stroke: '#b3b300', opacity: 1, width: 4 },
        formFields: {
          location: false,
          general: false,
          stars: true,
          dsos: false,
          constellations: true,
          lines: false,
          other: true,
        },
        culture: 'cn',
        container: 'celestial-map',
        datapath: 'https://ofrohn.github.io/data/',
        constellations: {
          show: true, //Show constellations
          names: true, //Show constellation names
          namesType: 'cn',
          nameStyle: {
            fill: ['#fec', '#f6c', '#fec'],
            opacity: 0.9,
            font: [
              "bold 14px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif",
              "18px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif",
              "14px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif",
            ],
            align: 'center',
            baseline: 'middle',
          },
          lines: true, //Show constellation lines
          lineStyle: { stroke: ['#99c', '#f6c', '#99c'], width: [2, 2.5, 2], opacity: 0.75 },
          bounds: true, //Show constellation boundaries
          boundStyle: { stroke: '#ffff00', width: 1.0, opacity: 0.7, dash: [8, 4, 2, 4] },
        },
        stars: {
          limit: 5,
          propername: true,
          propernameStyle: {
            fill: '#9999bb',
            font: "13px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
            align: 'right',
            baseline: 'bottom',
          },
          propernameLimit: 2.5,
          designation: false,
          designationStyle: {
            fill: '#9999bb',
            font: "11px 'Palatino Linotype', Georgia, Times, 'Times Roman', serif",
            align: 'left',
            baseline: 'top',
          },
          designationLimit: 2.5,
        },
        dsos: {
          show: false,
        },
        mw: {
          style: { fill: '#ffffff', opacity: 0.1 },
        },
        planets: {
          //Show planet locations
          show: false,
        },
      };

      window.Celestial.display(config);
    };

    loadAllScripts();
  }, []);

  return (
    <div>
      <div style={{ overflow: 'hidden' }}>
        <div id='celestial-map'></div>
      </div>
      <div id='celestial-form'></div>
    </div>
  );
};

export default CelestialComponent;
