import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { ResponsiveXYFrame } from 'semiotic'
import moment from 'moment'
// import 'moment/locale/es'
import { ScatterChart, Scatter, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import randomColor from 'randomcolor'
import _ from 'lodash'
import FA from 'react-fontawesome'

import _data from './db.json'

moment.locale('en');

const initialState = {
	current: moment('2016-11-01', 'YYYY-MM-DD'),
	playing: false,
	loading: true
};

// poner un color a cada programa

class CustomTooltip extends Component {

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      const p = payload[0].payload;
      return (
        <div style={{
        	backgroundColor:'rgba(255,255,255,.9)',
        	border: '1px solid rgba(0, 0, 0, .2)',
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

		this.state = initialState;

		this.updateCurrent = this.updateCurrent.bind(this);
		this.togglePlayPause = this.togglePlayPause.bind(this);
	}

	componentWillMount() {
	}

	componentDidMount() {
		setTimeout(() => {
			this.data = _.filter(_data, v => {
				return _.every(_.times(9, i => moment(initialState.current).add(i, 'months')), m => {
					return _.find(_data, d => {
						return m.format('MMM') === d.month && m.year() === d.year && v.radio === d.radio && d.mobile / 100 > 10;
					});
				});
			});

			this.radioColors = this.data.reduce((memo, val) => {
				if (memo[val.radio]) return memo;
				memo[val.radio] = randomColor();
				return memo;
			}, {});

			this.maxTotal = _.maxBy(this.data, 'total').total;
			this.minTotal = _.minBy(this.data, 'total').total;

			this.setState({ loading: false });
		}, 1);


		// 
		
	}

	updateCurrent() {
		this.setState({ current: moment(this.state.current).add(1, 'month') });
	}

	togglePlayPause() {
		this.setState({ playing: !this.state.playing })
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

		if (!nextState.playing && this.state.playing) {
			clearInterval(this.interval)
		} else if (nextState.playing && !this.state.playing) {
			this.interval = setInterval(this.updateCurrent, 1500);
			this.updateCurrent();
		}
	}

	render() {

		const { current, loading, playing } = this.state;

		if (loading) {
			return <h1 style={{fontSize: 100, textAlign:'center', color:randomColor(), paddingTop: '20%'}}>Cargando...</h1>
		}

		const filteredData = this.data.filter(d => d.percentage > 0).filter(d => {
			return d.month === current.format('MMM') && d.year === current.year();
		});

		return (
			<div className='full-height'>
				<div style={{
					position: 'absolute',
					bottom: 40,
					left: 90,
					height: '120px',
					width: '200px',
					backgroundColor: 'rgba(255, 255, 255, .8)',
					zIndex: 1001,
					border: '1px solid rgba(111, 111, 111, .4)',
					padding: 10,
				}}>
					<button
						className="btn"
						onClick={this.togglePlayPause}>
							<FA name={playing ? 'pause' : 'play'} /> {playing ? 'Pause' : 'Play'}
					</button>
					<br/>
					<button
						disabled={this.state.current.isSame(initialState.current, 'month')}
						className="btn"
						style={{display:'inline-block'}}
						onClick={() => this.setState({ current: moment(this.state.current).subtract(1, 'month')})}>
							<FA name='step-backward' /> Previous
					</button>
					<button
						disabled={this.state.current.isSame(moment('201712', 'YYYYMM'), 'month')}
						className="btn"
						onClick={this.updateCurrent}
						style={{display:'inline-block', marginLeft: 4}}>
							Next&nbsp;<FA name='step-forward' />
					</button>
					<br/>
					<button className="btn" onClick={() => this.setState({ current: initialState.current })}><FA name='repeat' /> Reset</button>
				</div>
				<div style={{
					position: 'absolute',
					bottom: 40,
					right: 20,
					height: '220px',
					width: '400px',
					backgroundColor: 'rgba(255, 255, 255, .8)',
					zIndex: 1001,
					border: '1px solid rgba(111, 111, 111, .4)',
					padding: 10,
				}}>
					<h3 style={{marginTop:0,marginBottom:'0.3em'}}>Mobile usage evolution in <a href="https://radiocut.fm/">RadioCut</a></h3>
					<p style={{marginTop:0,marginBottom:'0.3em'}}><b>Percentage</b> of users who used their mobile phones per radio station to reproduce radiocuts is expressed in the <i>X-Axis</i></p>
					<p style={{marginTop:0,marginBottom:'0.3em'}}><b>Total</b> amount of users who reproduced radiocuts per radio station is expressed in the <i>Y-Axis</i></p>
					<p style={{marginTop:0,marginBottom:'0.3em'}}>The <b>size</b> of the circle represent the amount in total of users who used their mobile phones per radio station to reproduce radiocuts</p>
					<p style={{color:'rgb(19, 131, 249)', marginTop:0,marginBottom:'0.3em'}}><b>Conclusion:</b> radio cuts mobile plays evolve with time as expected</p>
				</div>
				<ResponsiveContainer>
					<ScatterChart margin={{top: 0, right: 0, bottom: 0, left: 20}}>
		      	<XAxis
		      		type="number"
		      		domain={[0, 100]}
		      		dataKey={'percentage'}
		      		unit='%'
		      		tickCount={50}/>
		      	<YAxis
		      		type="number"
		      		scale='log'
		      		domain={[500, 2 * this.maxTotal]}
		      		dataKey={'total'}
		      		tickCount={50}/>
		      	<CartesianGrid />
		      	<Tooltip content={<CustomTooltip />}/>
		      	
		        <Scatter
		        	name='Radiocut'
		        	data={filteredData}
		        	fill='#8884d8'
		        	animationEasing='ease-in'>

		          {filteredData.map((entry, index) => {

		            return <Cell size={Math.floor(entry.mobile / 50)} key={entry.radio} fill={this.radioColors[entry.radio]} />
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
