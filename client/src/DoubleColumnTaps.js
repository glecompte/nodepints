import React, { Component } from 'react'
import cn from 'classnames'
import {AllHtmlEntities as entities} from 'html-entities'
import {getBeerData} from './utils'

const DoubleColumnTaps = (props) => {
	const {activetaps, config} = props
	
	const getRows = () => {
		let rows = []
		for (var i = 0; i < 4; i++) {
			let beer = activetaps[i]
			let beer2 = activetaps[i + 4]

			let beerData = getBeerData(beer)
			let beer2Data = getBeerData(beer2)

			rows.push(
				<tr key={i} className={cn({'altrow': i%2>0})} id={i}>
					
						{ config.showTapNumCol && 
							<td className="tap-num">
								<span className="tapcircle">{i+1}</span>
							</td>
						}
					
						{ config.showSrmCol && 
							<td className="srm">
								<h3>{beer.ogAct} OG</h3>
								
								<div className="srm-container">
									<div className="srm-indicator" style={{backgroundColor: beerData.srmBackgroundColor}}></div>
									<div className="srm-stroke"></div> 
								</div>
								
								<h2>{beer.srmAct} SRM</h2>
							</td>
						}
					
						{ config.showIbuCol && 
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
					
						{ config.showAbvCol && config.showAbvImg &&
						
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

						{ config.showAbvCol && !config.showAbvImg &&
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
						</td>

						{ config.showTapNumCol && 
							<td className="tap-num">
								<span className="tapcircle">{i + 5}</span>
							</td>
						}
					
						{ config.showSrmCol && 
							<td className="srm">
								<h3>{beer2.ogAct} OG</h3>
								
								<div className="srm-container">
									<div className="srm-indicator" style={{backgroundColor: beer2Data.srmBackgroundColor}}></div>
									<div className="srm-stroke"></div> 
								</div>
								
								<h2>{beer2.srmAct} SRM</h2>
							</td>
						}
					
						{ config.showIbuCol && 
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
					
						{ config.showAbvCol && config.showAbvImg &&
						
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

						{ config.showAbvCol && !config.showAbvImg &&
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