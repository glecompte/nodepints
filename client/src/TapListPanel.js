import React, { Component } from 'react'
import Client from './Client'
import {AllHtmlEntities as entities} from 'html-entities'

const getRedditWallPapers = () => {
	return fetch('https://www.reddit.com/r/wallpaper/top/.json?count=200', {
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
		data.map((post, i) => {
			urls.push({url: post.data.url, id: i})
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
  	}, 43200000)

	setInterval(() => {
  		this.changeWallPaper()
  	}, 720000)
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
				<tbody>
					{ activetaps && activetaps.length > 0 ? 
						activetaps.map((beer, i) => {
						const srmBackgroundColor = beer.srmRgb ? `rgb(${beer.srmRgb})` : 'rgb(0,0,0)'
						const ibuHeight = beer.ibuAct > 100 ? 100 : beer.ibuAct
						let calFromAlc = (1881.22 * beer.fgAct * (beer.ogAct - beer.fgAct)) / (1.775 - beer.ogAct)
						let calFromCarbs = 3550.0 * beer.fgAct * ((0.1808 * beer.ogAct) + (0.8192 * beer.fgAct) - 1.0004)
						if (beer.ogAct === 1 && beer.fgAct === 1) {
							calFromAlc = 0
							calFromCarbs = 0
						}
						const kCal = Math.round(calFromAlc + calFromCarbs)
						const abv = (beer.ogAct - beer.fgAct) * 131

						let abvIndicator = []
						let remaining = abv * 20
						let numCups = 0
						do {
						   let level = 0
						   if (remaining < 100)
						   	level = remaining
						   else 
						   	level = 100

						   remaining = remaining - level
						   numCups += 1
						   abvIndicator.push(<div key={numCups} className="abv-indicator"><div className="abv-full" style={{height: level}}></div></div>)
						} while (remaining > 0 && numCups < 2)

						if (remaining > 0) {
							abvIndicator.push(<div class="abv-offthechart"></div>)
						}

						return (<tr key={i} className="beerRow" id={i}>
								{ getConfigValue('showTapNumCol') && 
									<td className="tap-num">
										<span className="tapcircle">{i + 1}</span>
									</td>
								}
							
								{ getConfigValue('showSrmCol') && 
									<td className="srm">
										<h3>{beer.ogAct} OG</h3>
										
										<div className="srm-container">
											<div className="srm-indicator" style={{backgroundColor: srmBackgroundColor}}></div>
											<div className="srm-stroke"></div> 
										</div>
										
										<h2>{beer.srmAct} SRM</h2>
									</td>
								}
							
								{ getConfigValue('showIbuCol') && 
									<td className="ibu">
										<h3>
											{
												beer.ogAct > 1 ? 
												(beer.ibuAct / (beer.ogAct - 1) * .001).toFixed(2) :
												'0.00'
											}
											BU:GU
										</h3>
										
										<div className="ibu-container">
											<div className="ibu-indicator"><div className="ibu-full" style={{height: ibuHeight}}></div></div>
										</div>								
										<h2>{beer.ibuAct} IBU</h2>
									</td>
								}
							
								<td className="name">
									<h1>{beer.name}</h1>
									<h2 className="subhead">{entities.decode(beer.style)}</h2>
									<p>{beer.notes}</p>
								</td>
							
								{ getConfigValue('showAbvCol') && getConfigValue('showAbvImg') &&
								
									<td className="abv">
										<h3>
										{
											`${kCal} kCal`
										}
										</h3>
										<div className="abv-container">
										{abvIndicator}	
										</div>
										<h2>{abv.toFixed(1)}%  ABV</h2>
									</td>
								}

								{ getConfigValue('showAbvCol') && !getConfigValue('showAbvImg') &&
									<td className="abv">
										<h3>
										</h3>
										<div className="abv">
											<div class="abv-container">
											{abvIndicator}
											</div>
										</div>
										<h2>{abv.toFixed(1)}% ABV</h2>
									</td>
								}
							</tr>)
					}) : null
				}			
				</tbody>
			</table>
		</div>
    )
  }
}

export default TaplistPanel