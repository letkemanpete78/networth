import React, { Component } from 'react'

const CurrencySelect = (props) => {
    const { moneySymbols } = props

    let moneyOptions = moneySymbols.map((item, i) => {
        return (
            <option key={i} value={item.symbol}>{item.symbol}</option>
        )
    }, this);

    return (
        <select name="currency" onChange={(e) => currencyChange(e, moneySymbols)}>
            {moneyOptions}
        </select>
    )

}

function currencyChange(event, moneySymbols) {
    console.log(event.target.value);
    console.log(moneySymbols);
}


export default CurrencySelect