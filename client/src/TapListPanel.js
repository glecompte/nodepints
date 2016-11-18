import React, { Component } from 'react'
import Client from './Client'
import cn from 'classnames'
import SingleColumnTaps from './SingleColumnTaps'

const wallPaperLoadNext = 720000
const wallPaperRefresh = 43200000

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
  	this.state = {config: [], activetaps: []}
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

	const getConfigValue = (configName) => {
		if (!configs) return null
		let config = configs.find((config) => config.configName === configName)
		return config.configValue
	}

  	if (!this.state.currentWallPaper || !this.state.activetaps || !this.state.configs)
  		return null

    return (
		<div className="bodywrapper" style={{backgroundImage: `url(${this.state.currentWallPaper.url})`}}>
            <div className="header clearfix">
                <div className="HeaderLeft">
					<a href="admin/admin.php"><img src={getConfigValue('logoUrl')} height="100" alt="" /></a>
                </div>
                <div className="HeaderCenter">
                    <h1 id="HeaderTitle">{getConfigValue('headerText')}</h1>
                </div>
                <div className="HeaderRight">
					<a href="http://www.raspberrypints.com"><img src="img/RaspberryPints.png" height="100" alt="" /></a>
                </div>
            </div>
			
			<table>
				<thead>
					<tr>
						{ getConfigValue('showTapNumCol') && 
							<th className="tap-num">
								TAP<br />#
							</th>
						}
						{ getConfigValue('showSrmCol') && 
							<th className="srm">
								GRAVITY<hr />COLOR
							</th>
						}
						
						{ getConfigValue('showIbuCol') && 
							<th className="ibu">
								BALANCE<hr />BITTERNESS
							</th>
						}
						
						<th className="name">
							BEER NAME &nbsp; & &nbsp; STYLE<hr />TASTING NOTES
						</th>
						
						{ getConfigValue('showAbvCol') && 
							<th className="abv">				
								CALORIES<hr />ALCOHOL
							</th>
						}
					</tr>
                </thead>
				<SingleColumnTaps activetaps={activetaps} configs={configs} />	
			</table>
		</div>
    )
  }
}

export default TaplistPanel