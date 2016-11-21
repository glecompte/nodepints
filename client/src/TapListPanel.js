import React, { Component } from 'react'
import Client from './Client'
import cn from 'classnames'
import SingleColumnTaps from './SingleColumnTaps'
import DoubleColumnTaps from './DoubleColumnTaps'

const wallPaperLoadNext = 40000
const wallPaperRefresh = 43200000
const singleColumn = false

const getRedditWallPapers = () => {
	return fetch('https://www.reddit.com/r/wallpaper/.json?count=100', {
		method: 'get'
	}).then((response) => {
		return response.json()
	}).catch((err) => {
		console.log(err)
	})
}

class TaplistPanel extends Component {
  constructor() {
  	super()
  	this.state = {configs: [], activetaps: []}
  }
  getWallPapers() {
	getRedditWallPapers().then((response) => {
		let data = response.data.children
		let urls = []
		let i = 0
		data.map((post) => {
			if (post.data.title.includes('1920')) {
				urls.push({url: post.data.url, id: i})
				i += 1
			}
		})
		this.setState({wallpapers: urls}, () => {
			this.changeWallPaper()
		})
  	})
  }
  changeWallPaper() {
  	let nextId = this.state.currentWallPaper ? this.state.currentWallPaper.id + 1 : 0
  	let nextWallPaper = this.state.wallpapers.find((paper) => paper.id === nextId)
  	this.setState({currentWallPaper: nextWallPaper})
  }
  componentDidMount() {
   	Client.getApi('config', (response) => {
  		this.setState({configs: response})
  	})
  	Client.getApi('activetaps', (response) => {
  		this.setState({activetaps: response})
  	})

	this.getWallPapers()

  	setInterval(() => {
  		this.getWallPapers()
  	}, wallPaperRefresh)

	setInterval(() => {
  		this.changeWallPaper()
  	}, wallPaperLoadNext)
   }
  render() {
  	const {configs, activetaps} = this.state
	let config = configs.reduce((_,x) =>  ({..._, [x.configName]: x.configValue }), {})

	const headers = (
			<tr>
					{ config.showTapNumCol && 
						<th className="tap-num">
							TAP<br />#
						</th>
					}
					{ config.showSrmCol && 
						<th className="srm">
							GRAVITY<hr />COLOR
						</th>
					}
					
					{ config.showIbuCol && 
						<th className="ibu">
							BALANCE<hr />BITTERNESS
						</th>
					}
					
					<th className="name">
						BEER NAME &nbsp; & &nbsp; STYLE<hr />TASTING NOTES
					</th>
					
					{ config.showAbvCol && 
						<th className="abv">				
							CALORIES<hr />ALCOHOL
						</th>
					}
			</tr>)


	const doubleHeaders = (
			<tr>
					{ config.showTapNumCol && 
						<th className="tap-num">
							TAP<br />#
						</th>
					}
					{ config.showSrmCol && 
						<th className="srm">
							GRAVITY<hr />COLOR
						</th>
					}
					
					{ config.showIbuCol && 
						<th className="ibu">
							BALANCE<hr />BITTERNESS
						</th>
					}
					
					<th className="name">
						BEER NAME &nbsp; & &nbsp; STYLE<hr />TASTING NOTES
					</th>
					
					{ config.showAbvCol && 
						<th className="abv">				
							CALORIES<hr />ALCOHOL
						</th>
					}

					<th style={{height:60}}></th>

					{ config.showTapNumCol && 
						<th className="tap-num">
							TAP<br />#
						</th>
					}
					{ config.showSrmCol && 
						<th className="srm">
							GRAVITY<hr />COLOR
						</th>
					}
					
					{ config.showIbuCol && 
						<th className="ibu">
							BALANCE<hr />BITTERNESS
						</th>
					}
					
					<th className="name">
						BEER NAME &nbsp; & &nbsp; STYLE<hr />TASTING NOTES
					</th>
					
					{ config.showAbvCol && 
						<th className="abv">				
							CALORIES<hr />ALCOHOL
						</th>
					}
			</tr>)

  	if (!this.state.currentWallPaper || !this.state.activetaps || !this.state.configs)
  		return null

  	const backgroundStyle = {backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${this.state.currentWallPaper.url})`}
  	
    return (
		<div className="bodywrapper" style={backgroundStyle}>
            <div className="header clearfix">
					<a href="admin/admin.php"><img src={config.logoUrl} style={{height:'100%', width: '100%'}} alt="" /></a>         
            </div>
			
			<table>
				<thead>
					{
						singleColumn ? headers : doubleHeaders
					}
				</thead>
				{ singleColumn ? <SingleColumnTaps activetaps={activetaps} config={config} />	 :
				  <DoubleColumnTaps activetaps={activetaps} config={config} />	
				}
			</table>
			<div style={{fontSize: 11, textAlign: 'center'}}>Refridgeration Temperature: 37.76F</div>
		</div>
    )
  }
}

export default TaplistPanel