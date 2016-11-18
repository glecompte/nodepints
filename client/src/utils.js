import React, { Component } from 'react'

export const getBeerData = (beer) => {
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
