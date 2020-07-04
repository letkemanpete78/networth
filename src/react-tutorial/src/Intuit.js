import React, { Component } from 'react'
import uuid from 'react-uuid'
// import CurrencySelect from './CurrencySelect'

class Intuit extends Component {
    state = {
        assetDataShort: [],
        assetDataLong: [],
        assetTotal: 0,
        liabilityDataShort: [],
        liabilityDataLong: [],
        liabilityTotal: 0,
        moneySymbols: [],
        currencyHistory: []
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
        console.log(deleteUUID);
    }

    handleAddAssetShortRow = () => {
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "asset",
            category: "short_term"
        };
        this.setState({
            assetDataShort: [...this.state.assetDataShort, item]
        });
    };

    handleAddAssetLongRow = () => {
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "asset",
            category: "long_term"
        };
        this.setState({
            assetDataLong: [...this.state.assetDataLong, item]
        });
    };

    handleAddLiabilityShortRow = () => {
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "liability",
            category: "short_term"
        };
        this.setState({
            liabilityDataShort: [...this.state.liabilityDataShort, item]
        });
    };

    handleAddLiabilityLongRow = () => {
        const item = {
            label: "",
            value: 0.00,
            uuid: uuid(),
            type: "liability",
            category: "long_term"
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

        this.loadShortAssets(urlShortAsset)

        this.loadLongAssets(urlLongAsset)

        this.loadShortLibilities(urlShortLiability)

        this.loadLongLibilities(urlLongLiability)
        this.state.currencyHistory.push(this.state.moneySymbols[0])

        

    }

    loadLongLibilities(urlLongLiability) {
        fetch(urlLongLiability)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    liabilityDataLong: result,
                })
            })
    }

    loadShortLibilities(urlShortLiability) {
        fetch(urlShortLiability)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    liabilityDataShort: result,
                })
            })
    }

    loadLongAssets(urlLongAsset) {
        fetch(urlLongAsset)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    assetDataLong: result,
                })
            })
    }

    loadShortAssets(urlShortAsset) {
        fetch(urlShortAsset)
            .then(result => result.json())
            .then(result => {
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

                if (typeof this.state.currencyHistory[0] === 'undefined'){
                    this.state.currencyHistory.splice(0,1)

                }
            })
            
    }

    updateTableTotal(tablename, totalspan) {
        let assets = document.getElementById(tablename)
        let assetValues = assets.getElementsByClassName("editView")
        let oldRate = 1;
        let newRate = 1;
        oldRate = this.state.currencyHistory[0].rate
        if (this.state.currencyHistory.length === 2){
            newRate = this.state.currencyHistory[1].rate
        }
        console.log("update")

        let i
        let total = 0
        let temp = 0;
        for (i = 0; i < assetValues.length; i++) {
            temp = parseFloat(assetValues[i].innerHTML)  * oldRate / newRate
            assetValues[i].innerHTML = temp.toFixed(2)
            total += temp
        }
        document.getElementById(totalspan).innerHTML = total.toFixed(2);
        return total;
    }

    updateNetworth() {
        const urlFormPost = 'http://localhost:8080/submitdata'

        let totalAssets = this.updateTableTotal("assetTable", "assetTotal");
        let totalLiability = this.updateTableTotal("liabilityTable", "liabilityTotal");
        let totalworth = totalAssets - totalLiability
        document.getElementById("networth").innerHTML = totalworth.toFixed(2);

        let dataToSend = this.getDataItems("assetTable");
        dataToSend.push(...this.getDataItems("liabilityTable"));

        fetch(urlFormPost, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
        });
    }

    getDataItems(tableName) {
        let dataToSend1 = [];
        let domItems = document.getElementById(tableName).querySelectorAll("[id^='edit']")

        let records
        let uuid;
        let label;
        let value;
        domItems.forEach(function (userItem) {
            records = userItem.getAttribute("dataname").toUpperCase().split("DATA");
            uuid = userItem.id.replace("edit-", "");
            label = userItem.innerHTML;
            value = document.getElementById(uuid).innerHTML;
            let rec = { uuid: uuid, type: records[0], category: records[1] + "_TERM", label: label, value: value };
            dataToSend1.push(rec);
        });
        return dataToSend1;
    }


    render() {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong, moneySymbols } = this.state
        

        let assetTotal = assetUpdater(assetDataShort, assetDataLong)

        let liabilityTotal = libilityUpdater(liabilityDataShort, liabilityDataLong)


        const InlineEditor = props => {
            return this.createInlineEditor(props, this.state)
        }


        const resultAssetShort = this.newLineItemRow(this.state, InlineEditor, "assetDataShort")

        const resultAssetLong = this.newLineItemRow(this.state, InlineEditor, "assetDataLong")

        const resultLiabilityShort = this.newLineItemRow(this.state, InlineEditor, "liabilityDataShort")

        const resultLiabilityLong = this.newLineItemRow(this.state, InlineEditor, "liabilityDataLong")

        const CalcNetworth = () => {
            return (assetTotal - liabilityTotal).toFixed(2)
        }

        const AssetTable = () => {
            return (
                this.createAssetTable(resultAssetShort, resultAssetLong, assetTotal, ExtraSpacing)
            )
        }

        const LiabilityTable = () => {
            return (
                this.createLibilityTable(resultLiabilityShort, resultLiabilityLong, liabilityTotal, ExtraSpacing)
            )
        }

        const ExtraSpacing = () => {
            return (
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            )
        }

        const CurrencySelect = (props) => {
            const { moneySymbols } = props
            const {currencyHistory} = this.state

            let moneyOptions = moneySymbols.map((item, i) => {
                return (
                    <option key={i} value={item.symbol}>{item.symbol}</option>
                )
            }, this);
        
            return (
                <select name="currency" 
                    onChange={(e) => this.currencyChange(e, moneySymbols,currencyHistory)}
                    >
                    {moneyOptions}
                </select>
            )
        
        }

        const MainTable = () => {
            return (
                <div>
                    <h1>Tracking your Networth</h1>
                    <div>Select Currency: <CurrencySelect moneySymbols={moneySymbols} /></div>
                    Networth: <div id="networth" style={{ display: "inline" }}><CalcNetworth /></div>
                    <AssetTable />
                    <LiabilityTable />
                </div>
            )
        }
        return <MainTable />
    }

    currencyChange(event, moneySymbols, currencyHistory) {
        let i
        for ( i =0;i<moneySymbols.length;i++){
            if (event.target.value === moneySymbols[i].symbol){
                currencyHistory.push(moneySymbols[i])
            }
        }
        if (currencyHistory.length > 2){
            currencyHistory.splice(0,1)
        }
        this.updateNetworth()
    }

    createLibilityTable(resultLiabilityShort, resultLiabilityLong, liabilityTotal, ExtraSpacing) {
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
                    <td ><h4 style={{ float: "right" }}><span id="liabilityTotal">{liabilityTotal.toFixed(2)}</span><ExtraSpacing /></h4></td>
                </tr>
            </tfoot>
        </table>
    }

    createAssetTable(resultAssetShort, resultAssetLong, assetTotal, ExtraSpacing) {
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
                    <td><h4 style={{ float: "right" }}><span id="assetTotal">{assetTotal.toFixed(2)}</span><ExtraSpacing /></h4></td>
                </tr>
            </tfoot>
        </table>
    }

    createInlineEditor(props, state) {
        const { val, elmClass, elmType, elmID, dsName, index } = props

        let errorID = 'error' + elmID
        let pvID = 'pv' + elmID
        return (
            <p>
                <span
                    contentEditable="true"
                    id={elmID}
                    className={elmClass}
                    dataname={dsName}
                    suppressContentEditableWarning={true}
                    onInput={e => this.handleOnInput(e.currentTarget.textContent, elmID, index, dsName, state)}
                    onBlur={e => this.handleOnBlur(e.currentTarget.textContent, elmID, index, dsName, state)}
                    data-oldvalue={val}

                >
                    {String(val)}
                </span>
                <span id={errorID} style={{ display: "none" }}>
                    <br />My custom message
                    <br />Preivous Value: <span id={pvID}> {val} </span>
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
                        currentElm.innerHTML = 0.00
                    }
                    errorElm.style.display = "none"
                }
            }
        }
    }

    handleOnBlur(value, elmID, index, dsName, state) {
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = state
        console.log("index : " + index)
       
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
        
        let temp
        if (document.getElementById(elmID) !== null) {
            let currentElm = document.getElementById(elmID);
            if (elmID.startsWith("edit")) {
                lineItems[index].label = value
            } else {
                temp = currentElm.innerHTML.replace("<br><br>","")
                if (!isNaN(temp)){
                    currentElm.innerHTML = Number(temp).toFixed(2)
                }
                lineItems[index].value = value
            }
        }
        this.updateNetworth()
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
                    <InlineEditor val={tempLabel} elmClass="entryLabel" elmType="text" elmID={"edit-" + entry.uuid} dsName={dataSetName} index={index} />
                </td>
                <td width="3%" style={{ lineHeight: "3" }} valign="bottom"><div>$</div></td>
                <td width="37%">
                    <div style={{ float: "right" }}>
                        <InlineEditor val={tempNum} elmClass="editView" elmType="number" elmID={entry.uuid} index={index} dsName={dataSetName} />
                    </div>
                </td>
                <td>
                    <button onClick={() => this.removeRow(index, dataSetName)}>X</button>
                </td>
            </tr>
        })
    }


    

}

export default Intuit

// function currencyChange(event, moneySymbols) {
//     console.log(event.target.value);
//     console.log(moneySymbols);
// }

function libilityUpdater(liabilityDataShort, liabilityDataLong) {
    const shortLiabilitysTotal = liabilityDataShort.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2)
    const longLiabilitysTotal = liabilityDataLong.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2)
    let liabilityTotal = parseFloat(shortLiabilitysTotal) + parseFloat(longLiabilitysTotal)
    return liabilityTotal
}

function assetUpdater(assetDataShort, assetDataLong) {
    const shortAssetsTotal = assetDataShort.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2)
    const longAssetsTotal = assetDataLong.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2)
    let assetTotal = parseFloat(shortAssetsTotal) + parseFloat(longAssetsTotal)
    return assetTotal
}

