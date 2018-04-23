import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { ResponsiveXYFrame } from 'semiotic'
import moment from 'moment'
// import 'moment/locale/es'
import { ScatterChart, Scatter, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import randomColor from 'randomcolor'
import _ from 'lodash'

import data from './db.json'

const radioColors = data.reduce((memo, val) => {
	if (memo[val.radio]) return memo;
	memo[val.radio] = randomColor();
	return memo;
}, {});

const maxTotal = _.maxBy(data, 'total').total;
const minTotal = _.minBy(data, 'total').total;

moment.locale('en');

// poner un color a cada programa

class CustomTooltip extends Component {

  getIntroOfPage(label) {
    if (label === 'Page A') {
      return "Page A is about men's clothing";
    } else if (label === 'Page B') {
      return "Page B is about women's dress";
    } else if (label === 'Page C') {
      return "Page C is about women's bag";
    } else if (label === 'Page D') {
      return "Page D is about household goods";
    } else if (label === 'Page E') {
      return "Page E is about food";
    } else if (label === 'Page F') {
      return "Page F is about baby food";
    }
  }

  render() {
    const { active } = this.props;

    if (active) {
    	console.log(this.props);
      const { payload, label } = this.props;
      const p = payload[0].payload;
      return (
        <div style={{
        	backgroundColor:'rgba(255,255,255,.9)',
        	border: '1px solid rgba(0, 0, 0, .4)',
        	padding: 4
        }}>
          <h2 style={{margin:0,padding:0}}>{p.radio}</h2>
          <p style={{margin:0,padding:0,color:'#aaa'}}><b>Mobile usage in {p.month} {p.year}</b>: {p.percentage}%</p>
          <p className="desc">{p.mobile} users used their cellphones to use play cuts in {p.month} {p.year}</p>
        </div>
      );
    }

    return null;
  }
}

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			current: moment('2016-11-01', 'YYYY-MM-DD'),
			autoplay: false
		}
	}

	componentWillMount() {
		// 
		this.interval = setInterval(() => {
			this.setState({ current: moment(this.state.current).add(1, 'month') });
		}, 2000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	componentWillUpdate(nextProps, nextState) {
		if (+nextState.current !== +this.state.current) {
			if (nextState.current.year() === 2017 && nextState.current.format('MMM') === 'Dec') {
				clearInterval(this.interval);
			}
		}
	}

	render() {

		const { current } = this.state;

		if (!data || !data.length) return null;


		const filteredData = data.filter(d => d.percentage > 0).filter(d => {
			return d.month === current.format('MMM') && d.year === current.year();
		}).filter(d => d.mobile / 100 > 2);


		

		/// filtrar por fecha

		let i = 0;

		return (
			<div className='full-height'>
				<ResponsiveContainer>
					<ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
		      	<YAxis
		      		type="number"
		      		domain={[0, 100]}
		      		dataKey={'percentage'}
		      		unit='%'
		      		tickCount={50}/>
		      	<XAxis
		      		type="number"
		      		scale='log'
		      		domain={[1000, maxTotal + maxTotal / 20]}
		      		dataKey={'total'}
		      		tickCount={20} />
		      	<CartesianGrid />
		      	<Tooltip content={<CustomTooltip />}/>
		      	
		        <Scatter name='A school' data={filteredData} fill='#8884d8'>

		          {filteredData.map((entry, index) => {

		            return <Cell size={Math.floor(entry.mobile / 100)} key={entry.radio} fill={radioColors[entry.radio]} />
		          })}

		        </Scatter>
		        <text fill="rgba(155,155,155,0.7)" textAnchor="start" x={90} y={100} fontSize={100}>{moment(this.state.current).format('MMM YY')}</text>
		      </ScatterChart>
		     </ResponsiveContainer>
				
			</div>
		)
	}
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect()(App);
