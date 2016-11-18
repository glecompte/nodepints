import React, { Component } from 'react'
import cn from 'classnames'
import {AllHtmlEntities as entities} from 'html-entities'

const DoubleColumnTaps = (props) => {
	const {activetaps, configs} = props
	const getConfigValue = (configName) => {
		if (!configs) return null
		let config = configs.find((config) => config.configName === configName)
		return config.configValue
	}

	const getBeerData = (beer) => {
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

		return { srmBackgroundColor, ibuHeight, calFromCarbs, calFromAlc, kCal, abv, abvIndicator }
	}

	const getRows = () => {
		let rows = []
		for (var i = 1; i <= 4; i++) {
			let beer = activetaps[i]
			let beer2 = activetaps[i + 4]

			let beerData = getBeerData(beer)
			let beer2Data = getBeerData(beer2)

			rows.push(
				<tr key={i} className={cn({'altrow': i%2>0})} id={i}>
					
						{ getConfigValue('showTapNumCol') && 
							<td className="tap-num">
								<span className="tapcircle">{i + 1}</span>
							</td>
						}
					
						{ getConfigValue('showSrmCol') && 
							<td className="srm">
								<h3>{beer.ogAct} OG</h3>
								
								<div className="srm-container">
									<div className="srm-indicator" style={{backgroundColor: beerData.srmBackgroundColor}}></div>
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
									<div className="ibu-indicator"><div className="ibu-full" style={{height: beerData.ibuHeight}}></div></div>
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
									`${beerData.kCal} kCal`
								}
								</h3>
								<div className="abv-container">
								{beerData.abvIndicator}	
								</div>
								<h2>{beerData.abv.toFixed(1)}%  ABV</h2>
							</td>
						}

						{ getConfigValue('showAbvCol') && !getConfigValue('showAbvImg') &&
							<td className="abv">
								<h3>
								</h3>
								<div className="abv">
									<div class="abv-container">
									{beerData.abvIndicator}
									</div>
								</div>
								<h2>{beerData.abv.toFixed(1)}% ABV</h2>
							</td>
						}
						<td>
							<div style={{width:200}} />						
						</td>

						{ getConfigValue('showTapNumCol') && 
							<td className="tap-num">
								<span className="tapcircle">{i + 4}</span>
							</td>
						}
					
						{ getConfigValue('showSrmCol') && 
							<td className="srm">
								<h3>{beer2.ogAct} OG</h3>
								
								<div className="srm-container">
									<div className="srm-indicator" style={{backgroundColor: beer2Data.srmBackgroundColor}}></div>
									<div className="srm-stroke"></div> 
								</div>
								
								<h2>{beer2.srmAct} SRM</h2>
							</td>
						}
					
						{ getConfigValue('showIbuCol') && 
							<td className="ibu">
								<h3>
									{
										beer2.ogAct > 1 ? 
										(beer2.ibuAct / (beer2.ogAct - 1) * .001).toFixed(2) :
										'0.00'
									}
									BU:GU
								</h3>
								
								<div className="ibu-container">
									<div className="ibu-indicator"><div className="ibu-full" style={{height: beer2Data.ibuHeight}}></div></div>
								</div>								
								<h2>{beer2.ibuAct} IBU</h2>
							</td>
						}
					
						<td className="name">
							<h1>{beer2.name}</h1>
							<h2 className="subhead">{entities.decode(beer2.style)}</h2>
							<p>{beer2.notes}</p>
						</td>
					
						{ getConfigValue('showAbvCol') && getConfigValue('showAbvImg') &&
						
							<td className="abv">
								<h3>
								{
									`${beer2Data.kCal} kCal`
								}
								</h3>
								<div className="abv-container">
								{beer2Data.abvIndicator}	
								</div>
								<h2>{beer2Data.abv.toFixed(1)}%  ABV</h2>
							</td>
						}

						{ getConfigValue('showAbvCol') && !getConfigValue('showAbvImg') &&
							<td className="abv">
								<h3>
								</h3>
								<div className="abv">
									<div class="abv-container">
									{beer2Data.abvIndicator}
									</div>
								</div>
								<h2>{beer2Data.abv.toFixed(1)}% ABV</h2>
							</td>
						}
						<td>
							<div style={{width:200}} />						
						</td>
				</tr>)
		}
		return rows
	}

	if (!activetaps || activetaps.length == 0) 
		return null

	return (
		<tbody>
			{getRows()}
		</tbody>)
}

export default DoubleColumnTaps