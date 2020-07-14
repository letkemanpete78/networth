import React, { Component } from 'react'
import uuid from 'react-uuid'

class Intuit extends Component {
    state = {
        assetDataShort: [],
        assetDataLong: [],
        assetTotal: 0,
        liabilityDataShort: [],
        liabilityDataLong: [],
        liabilityTotal: 0,
        moneySymbols: [],
        currencyHistory: [],
        selectedCurrency: 'undefined'
    }

    removeRow = (index, dataset) => {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = this.state
        const urlFormPost = 'http://localhost:8080/deletedata'

        var deleteUUID = ''
        if (dataset === "assetDataShort") {
            this.setState({
                assetDataShort: assetDataShort.filter((row, i) => {
                    if (i === index) {
                        deleteUUID = assetDataShort[i].uuid;
                        return false;
                    } else {
                        return true;
                    }
                }),
            })
        } else if (dataset === "assetDataLong") {
            this.setState({
                assetDataLong: assetDataLong.filter((row, i) => {
                    if (i === index) {
                        deleteUUID = assetDataLong[i].uuid;
                        return false;
                    } else {
                        return true;
                    }
                }),
            })
        } else if (dataset === "liabilityDataShort") {
            this.setState({
                liabilityDataShort: liabilityDataShort.filter((row, i) => {
                    if (i === index) {
                        deleteUUID = liabilityDataShort[i].uuid;
                        return false;
                    } else {
                        return true;
                    }
                }),
            })
        } else {
            this.setState({
                liabilityDataLong: liabilityDataLong.filter((row, i) => {
                    if (i === index) {
                        deleteUUID = liabilityDataLong[i].uuid;
                        return false;
                    } else {
                        return true;
                    }
                }),
            })
        }

        fetch(urlFormPost, {
            method: 'POST',
            body: JSON.stringify(deleteUUID),
        });
    }

    handleAddAssetShortRow = () => {
        console.log("handleAddAssetShortRow")
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "ASSET",
            category: "SHORT_TERM",
            currency: this.state.selectedCurrency
        };
        this.setState({
            assetDataShort: [...this.state.assetDataShort, item]
        });
    };

    handleAddAssetLongRow = () => {
        console.log("handleAddAssetLongRow")
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "ASSET",
            category: "LONG_TERM",
            currency: this.state.selectedCurrency
        };
        this.setState({
            assetDataLong: [...this.state.assetDataLong, item]
        });
    };

    handleAddLiabilityShortRow = () => {
        console.log("handleAddLiabilityShortRow")
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "LIABILITY",
            category: "SHORT_TERM",
            currency: this.state.selectedCurrency
        };
        this.setState({
            liabilityDataShort: [...this.state.liabilityDataShort, item]
        });
    };

    handleAddLiabilityLongRow = () => {
        console.log("handleAddLiabilityLongRow")
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "LIABILITY",
            category: "LONG_TERM",
            currency: this.state.selectedCurrency
        };
        this.setState({
            liabilityDataLong: [...this.state.liabilityDataLong, item]
        });
    };

    componentDidMount() {

        const urlShortAsset = 'http://localhost:8080/?category=short_term&type=asset'
        const urlLongAsset = 'http://localhost:8080/?category=long_term&type=asset'
        const urlShortLiability = 'http://localhost:8080/?category=short_term&type=liability'
        const urlLongLiability = 'http://localhost:8080/?category=long_term&type=liability'
        const urlCurrencies = 'http://localhost:8080/currencies'

        this.loadCurrencies(urlCurrencies)
        this.state.currencyHistory.push(this.state.moneySymbols[0])

        this.loadShortAssets(urlShortAsset)

        this.loadLongAssets(urlLongAsset)

        this.loadShortLibilities(urlShortLiability)

        this.loadLongLibilities(urlLongLiability)   
    }

    loadLongLibilities(urlLongLiability) {
        fetch(urlLongLiability)
            .then(result => result.json())
            .then(result => {
                if ((result.length !== 0) && (typeof result[0].currency !== 'undefined')) {
                    this.setState({
                        selectedCurrency: result[0].currency,
                    })
                }
                this.setState({
                    liabilityDataLong: result,
                })
            })
    }

    loadShortLibilities(urlShortLiability) {
        fetch(urlShortLiability)
            .then(result => result.json())
            .then(result => {
                if ((result.length !== 0) && (typeof result[0].currency !== 'undefined')) {
                    this.setState({
                        selectedCurrency: result[0].currency,
                    })
                }
                this.setState({
                    liabilityDataShort: result,
                })
            })
    }

    loadLongAssets(urlLongAsset) {
        fetch(urlLongAsset)
            .then(result => result.json())
            .then(result => {
                if ((result.length !== 0) && (typeof result[0].currency !== 'undefined')) {
                    this.setState({
                        selectedCurrency: result[0].currency,
                    })
                }
                this.setState({
                    assetDataLong: result,
                })
            })
    }

    loadShortAssets(urlShortAsset) {
        fetch(urlShortAsset)
            .then(result => result.json())
            .then(result => {
                if ((result.length !== 0) && (typeof result[0].currency !== 'undefined')) {
                    this.setState({
                        selectedCurrency: result[0].currency,
                    })
                }
                this.setState({
                    assetDataShort: result,
                })
            })
    }

    loadCurrencies(urlCurrencies) {
        fetch(urlCurrencies)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    moneySymbols: result,
                })
                this.state.currencyHistory.push(this.state.moneySymbols[0])
                if (typeof this.state.currencyHistory[0] === 'undefined') {
                    this.state.currencyHistory.splice(0, 1)
                }
            })
    }

    updateTableTotal(currency) {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = this.state
  

        let oldRate = 1;
        let newRate = 1;
        oldRate = this.state.currencyHistory[0].rate
        if (this.state.currencyHistory.length === 2) {
            newRate = this.state.currencyHistory[1].rate
        } else {
            newRate = oldRate
        }

        if (currency === 'undefined'){
            currency = this.state.currencyHistory[0]
            this.setState({
                currency: this.state.currencyHistory[0]
            })
        }

        assetDataShort.forEach(function (asset) {
            asset.currency = currency
            asset.value = asset.value * oldRate / newRate
        })
        assetDataLong.forEach(function (asset) {
            asset.currency = currency
            asset.value = asset.value * oldRate / newRate
        })
        liabilityDataShort.forEach(function (asset) {
            asset.currency = currency
            asset.value = asset.value * oldRate / newRate
        })
        liabilityDataLong.forEach(function (asset) {
            asset.currency = currency
            asset.value = asset.value * oldRate / newRate
        })

        let newAssetTotal = this.assetUpdater(assetDataShort, assetDataLong)
        let newLiabilityTotal = this.libilityUpdater(liabilityDataShort, liabilityDataLong)
        let newNetworth = newAssetTotal - newLiabilityTotal

        this.setState({
            assetTotal: newAssetTotal,
            liabilityTotal: newLiabilityTotal,
            networth: newNetworth
        })
    }

    submitData(currency) {
        this.updateTableTotal(currency)
        const urlFormPost = 'http://localhost:8080/submitdata'

        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = this.state

        let dataToSend = []
        dataToSend.push(...assetDataShort)
        dataToSend.push(...assetDataLong)
        dataToSend.push(...liabilityDataShort);
        dataToSend.push(...liabilityDataLong);

        fetch(urlFormPost, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
        });
    }

    render() {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong, moneySymbols, selectedCurrency } = this.state

        let assetTotal = this.assetUpdater(assetDataShort, assetDataLong)
        let liabilityTotal = this.libilityUpdater(liabilityDataShort, liabilityDataLong)

        let networth = assetTotal - liabilityTotal

        const InlineEditor = props => {
            return this.createInlineEditor(props, this.state)
        }

        const resultAssetShort = this.newLineItemRow(this.state, InlineEditor, "assetDataShort")
        const resultAssetLong = this.newLineItemRow(this.state, InlineEditor, "assetDataLong")
        const resultLiabilityShort = this.newLineItemRow(this.state, InlineEditor, "liabilityDataShort")
        const resultLiabilityLong = this.newLineItemRow(this.state, InlineEditor, "liabilityDataLong")

        const AssetTable = () => {
            return (
                this.createAssetTable(resultAssetShort, resultAssetLong, assetTotal)
            )
        }

        const LiabilityTable = () => {
            return (
                this.createLibilityTable(resultLiabilityShort, resultLiabilityLong, liabilityTotal)
            )
        }

        const CurrencySelect = (props) => {
            const { moneySymbols } = props
            const { currencyHistory } = this.state

            const moneyOptions = moneySymbols.map((item, i) => {
                return (
                    <option key={i} value={item.symbol}>{item.symbol}</option>
                )
            }, this);
            let selectedSymbol
            if (typeof selectedCurrency !== 'undefined') {
                try {
                    selectedSymbol = selectedCurrency.symbol
                } catch (error) {
                    // selectedSymbol = ''
                }
            }
            return (
                <select name="currency"
                    value={selectedSymbol}
                    onChange={(e) => this.currencyChange(e, moneySymbols, currencyHistory)}
                >
                    {moneyOptions}
                </select>
            )
        }

        const MainTable = () => {
            return (
                <div>
                    <h1>Tracking your Net Worth</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td colSpan="3"><div style={{ float: "right" }}><h5 style={{display: "inline"}} >Select Currency:</h5> <CurrencySelect moneySymbols={moneySymbols} /></div></td>
                            </tr>
                            <tr>
                                <td width="55%"><h4>Net Worth:</h4></td>
                                <td width="3%"><h4>$</h4></td>
                                <td width="37%"><h4 id="networth" style={{ display: "inline" ,float:"right" }}>{networth.toFixed(2)}</h4></td>
                            </tr>
                        </tbody>
                    </table>
                    <AssetTable />
                    <LiabilityTable />
                </div>
            )
        }
        return <MainTable />
    }

    currencyChange(event, moneySymbols, currencyHistory) {
        let i
        let tempItem
        for (i = 0; i < moneySymbols.length; i++) {
            if (event.target.value === moneySymbols[i].symbol) {
                currencyHistory.push(moneySymbols[i])
                this.setState({
                    selectedCurrency: moneySymbols[i],
                })
                tempItem = moneySymbols[i]
                console.log("moneySymbols[i]")
                console.log(moneySymbols[i])
            }
        }

        if (currencyHistory.length > 2) {
            currencyHistory.splice(0, 1)
        }

        this.submitData(tempItem)
    }

    createLibilityTable(resultLiabilityShort, resultLiabilityLong, liabilityTotal) {
        return <table id="liabilityTable">
            <thead><tr><th colSpan="3"><h4>Liabilities</h4></th></tr></thead>
            <tbody>
                <tr><td colSpan="3"><h5>Short Term Liabilties</h5></td></tr>
                {resultLiabilityShort}
                <tr>
                    <td>
                        <button
                            onClick={this.handleAddLiabilityShortRow}
                            className="btn btn-default pull-left">
                            Add Short Term Liability
                        </button>
                    </td>
                </tr>
                <tr><td colSpan="3"><h5>Long Term Debt</h5></td></tr>
                {resultLiabilityLong}
                <tr>
                    <td>
                        <button
                            onClick={this.handleAddLiabilityLongRow}
                            className="btn btn-default pull-left">
                            Add Long Term Debt
                        </button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td><h4>Total Liabilties:</h4></td>
                    <td valign="middle"><h4>$</h4></td>
                    <td ><h4 style={{ float: "right" }} id="liabilityTotal">{liabilityTotal.toFixed(2)}</h4></td>
                </tr>
            </tfoot>
        </table>
    }

    createAssetTable(resultAssetShort, resultAssetLong, assetTotal) {
        return <table id="assetTable">
            <thead><tr><th colSpan="3"><h4>Assets</h4></th></tr></thead>
            <tbody>
                <tr><td colSpan="3"><h5>Cash and Investments</h5></td></tr>
                {resultAssetShort}
                <tr>
                    <td>
                        <button
                            onClick={this.handleAddAssetShortRow}
                            className="btn btn-default pull-left">
                            Add Short Term Asset
                        </button>
                    </td>
                </tr>
                <tr><td colSpan="3"><h5>Long Term Assets</h5></td></tr>
                {resultAssetLong}
                <tr>
                    <td>
                        <button
                            onClick={this.handleAddAssetLongRow}
                            className="btn btn-default pull-left">
                            Add Long Term Asset
                        </button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td><h4>Total Assets:</h4></td>
                    <td valign="middle"><h4>$</h4></td>
                    <td><h4 style={{ float: "right" }}><span id="assetTotal">{assetTotal.toFixed(2)}</span></h4></td>
                </tr>
            </tfoot>
        </table>
    }

    createInlineEditor(props, state) {
        const { val, elmID, dsName, index } = props

        let errorID = 'error' + elmID
        let pvID = 'pv' + elmID
        return (
            <p>
                <span
                    contentEditable="true"
                    id={elmID}
                    dataname={dsName}
                    suppressContentEditableWarning={true}
                    onInput={e => this.handleOnInput(e.currentTarget.textContent, elmID, index, dsName, state)}
                    onBlur={e => this.handleOnBlur(e.currentTarget.textContent, elmID, index, dsName, state)}
                    data-oldvalue={val}
                >
                    {String(val)}
                </span>
                <span id={errorID} style={{ display: "none" }} className={"elmError"}>
                    <br />Invalid Value - Previous Value: <br/>
                    <span id={pvID}> {val} </span>
                </span>
            </p>
        )
    }

    handleOnInput(value, elmID, index, dsName, state) {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = state

        let lineItems;
        if (dsName === "assetDataShort") {
            lineItems = assetDataShort
        } else if (dsName === "assetDataLong") {
            lineItems = assetDataLong
        } else if (dsName === "liabilityDataShort") {
            lineItems = liabilityDataShort
        } else {
            lineItems = liabilityDataLong
        }

        if (document.getElementById(elmID) !== null) {
            let currentElm = document.getElementById(elmID)
            if (elmID.startsWith("edit")) {
                lineItems[index].label = value
            } else {
                let errorID = "error" + elmID;
                let errorElm = document.getElementById(errorID)
                if (isNaN(value)) {
                    errorElm.style.display = "inline"
                } else {
                    lineItems[index].value = value
                    if (value !== 0) {
                        currentElm.setAttribute("data-oldvalue", value)
                        document.getElementById("pv" + elmID).innerHTML = Number(value).toFixed(2)
                    } else {
                        lineItems[index].value = 0.00
                    }
                    errorElm.style.display = "none"
                }
            }
        }
    }

    handleOnBlur(value, elmID, index, dsName, state) {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong, selectedCurrency } = state

        let assetTotal = this.assetUpdater(assetDataShort, assetDataLong)
        let liabilityTotal = this.libilityUpdater(liabilityDataShort, liabilityDataLong)
        this.setState({
            networth: assetTotal - liabilityTotal
        })
        this.submitData(selectedCurrency)
    }

    newLineItemRow(state, InlineEditor, dataSetName) {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = state
        let lineItems;
        if (dataSetName === "assetDataShort") {
            lineItems = assetDataShort
        } else if (dataSetName === "assetDataLong") {
            lineItems = assetDataLong
        } else if (dataSetName === "liabilityDataShort") {
            lineItems = liabilityDataShort
        } else if (dataSetName === "liabilityDataLong") {
            lineItems = liabilityDataLong
        }

        return lineItems.map((entry, index) => {
            let tempLabel = ""
            let tempNum = 0.00
            if ("" === entry.label) {
                tempLabel = "untiled"
            } else {
                tempLabel = entry.label
            }
            if (!isNaN(entry.value)) {
                tempNum = Number(entry.value).toFixed(2)
            }
            return <tr key={index}>
                <td width="60%">
                    <InlineEditor val={tempLabel} elmID={"edit-" + entry.uuid} dsName={dataSetName} index={index} />
                </td>
                <td width="3%" style={{ verticalAlign: "top" }}><div>$</div></td>
                <td width="37%">
                    <div style={{ float: "right" }}>
                        <InlineEditor val={tempNum} elmID={entry.uuid} index={index} dsName={dataSetName} />
                    </div>
                </td>
                <td>
                    <button onClick={() => this.removeRow(index, dataSetName)}>X</button>
                </td>
            </tr>
        })
    }

    libilityUpdater(liabilityDataShort, liabilityDataLong) {
        const shortLiabilitysTotal = liabilityDataShort.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2)
        const longLiabilitysTotal = liabilityDataLong.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2)
        let liabilityTotal = parseFloat(shortLiabilitysTotal) + parseFloat(longLiabilitysTotal)
        return liabilityTotal
    }

    assetUpdater(assetDataShort, assetDataLong) {
        const shortAssetsTotal = assetDataShort.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2)
        const longAssetsTotal = assetDataLong.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2)
        let assetTotal = parseFloat(shortAssetsTotal) + parseFloat(longAssetsTotal)
        return assetTotal
    }
}

export default Intuit