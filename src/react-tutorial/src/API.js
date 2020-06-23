import React, { Component } from 'react'
import EdiText from 'react-editext'
import uuid from 'react-uuid'


class App extends Component {
    state = {
        assetDataShort: [],
        assetDataLong: [],
        assetTotal:0,
        liabilityDataShort: [],
        liabilityDataLong: [],
        liabilityTotal:0,
        moneySymbols:[],
    }

    removeRow = (index,dataset) => {
        const { assetDataShort ,assetDataLong,liabilityDataShort,liabilityDataLong } = this.state
        const urlFormPost = 'http://localhost:8080/deletedata'

        var deleteUUID = ''
        if (dataset==="assetDataShort") {
            this.setState({
                assetDataShort: assetDataShort.filter((row, i) => {
                    if (i === index){
                        deleteUUID = assetDataShort[i].uuid;
                        return false;
                    } else {
                        return true;
                    }
                }),
            })
        } else if (dataset==="assetDataLong") {
            this.setState({
                assetDataLong: assetDataLong.filter((row, i) => {
                    if (i === index){
                        deleteUUID =assetDataLong[i].uuid;
                        return false;
                    } else {
                        return true;
                    }
                }),
            })
        } else if (dataset==="liabilityDataShort") {
            this.setState({
                liabilityDataShort: liabilityDataShort.filter((row, i) => {
                    if (i === index){
                        deleteUUID = liabilityDataShort[i].uuid;
                        return false;
                    } else {
                        return true;
                    }
                }),
            })
        } else  {
            this.setState({
                liabilityDataLong: liabilityDataLong.filter((row, i) => {
                    if (i === index){
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

    componentDidMount(){

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
            })
    }

    updateTableTotal(tablename, totalspan) {
        let assets = document.getElementById(tablename)
        let assetValues = assets.getElementsByClassName("editView")
    
        var i
        var total = 0
        for (i = 0; i < assetValues.length; i++) {
            total += parseFloat(assetValues[i].innerHTML)
        }
        document.getElementById(totalspan).innerHTML =  total.toFixed(2);
        return total;
    }

    updateNetworth(name,val) {
        const urlFormPost = 'http://localhost:8080/submitdata'

        let totalAssets = this.updateTableTotal("assetTable", "assetTotal");
        let totalLiability = this.updateTableTotal("liabilityTable", "liabilityTotal");
        let totalworth = totalAssets-totalLiability
        document.getElementById("networth").innerHTML = totalworth.toFixed(2);

        var dataToSend = this.getDataItems("assetTable");
        dataToSend.push(...this.getDataItems("liabilityTable"));

        fetch(urlFormPost, {
            method: 'POST',
            body: JSON.stringify(dataToSend),
        });
    }

    getDataItems(tableName) {
        var dataToSend1 = [];
        let assets = document.getElementById(tableName)
        var domItems = assets.querySelectorAll("[dataname]")
    
        var records
        var uuid;
        var label;
        var value;
        domItems.forEach(function (userItem) {
            records = userItem.getAttribute("dataname").toUpperCase().split("DATA");
            uuid = userItem.id.replace("edit-", "");
            label = userItem.innerHTML;
            value = document.getElementById(uuid).innerHTML;
            var rec = { uuid: uuid, type: records[0], category: records[1] +"_TERM", label: label, value: value };
            dataToSend1.push(rec);
        });
        return dataToSend1;
    }
      

    render(){
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong, moneySymbols} = this.state

        const shortAssetsTotal = assetDataShort.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2);
        const longAssetsTotal = assetDataLong.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2);
        var assetTotal = parseFloat(shortAssetsTotal) + parseFloat(longAssetsTotal);

        const shortLiabilitysTotal = liabilityDataShort.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2);
        const longLiabilitysTotal = liabilityDataLong.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2);
        var liabilityTotal = parseFloat(shortLiabilitysTotal) + parseFloat(longLiabilitysTotal);

        const InlineEditor = props =>{
            return this.createInlineEditor(props)
        }

        const resultAssetShort = this.newMoneyRows(assetDataShort, InlineEditor,"assetDataShort")

        const resultAssetLong = this.newMoneyRows(assetDataLong, InlineEditor,"assetDataLong")
        
        const resultLiabilityShort = this.newMoneyRows(liabilityDataShort, InlineEditor,"liabilityDataShort")

        const resultLiabilityLong =  this.newMoneyRows(liabilityDataLong, InlineEditor,"liabilityDataLong")

        const CalcNetworth = () =>{
            return (assetTotal - liabilityTotal).toFixed(2)
        }

        const AssetTable = () => {
            return (
                this.createAssetTable(resultAssetShort, resultAssetLong, assetTotal, ExtraSpacing)
            )}

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

        const CurrencySelect = () => {
            const { moneySymbols } = this.state;

            let moneyOptions = moneySymbols.map((item, i) => {
                return (
                    <option key={i} value={item.symbol}>{item.symbol}</option>
                )
            }, this);

            return (
                <select name="currency" onChange={(e) => this.currencyChange(e,moneySymbols)}>
                    {moneyOptions}
                </select>
            );
        }

        const MainTable = () => {
            return (
                <div>
                    <h1>Tracking your Networth</h1>
                    <div>Select Currency: <CurrencySelect /></div>
                    Networth: <div id="networth" style={{display:"inline"}}><CalcNetworth/></div>
                    <AssetTable/>
                    <LiabilityTable/>
                </div>
            )
        }

        return <MainTable/>
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

    createInlineEditor(props) {
        // https://github.com/Vargentum/react-editext
        const { val, elmClass, elmType, elmID, dsName } = props
        return (
            <EdiText
                type={elmType}
                viewProps={{
                    id: elmID,
                    className: elmClass,
                    dataname: dsName,
                }}
                value={String(val)}
                onSave={v => this.updateNetworth("pete", v)} />
        )
    }

    currencyChange(event,moneySymbols) {
        console.log(event.target.value);
        console.log(moneySymbols);
      }

    newMoneyRows(assetDataShort, InlineEditor,dataSetName) {
        return assetDataShort.map((entry, index) => {
            return <tr key={index}>
                <td width="60%">
                    <InlineEditor val={entry.label} elmClass="entryLabel" elmType="text" elmID={"edit-" + entry.uuid} dsName={dataSetName} />
                </td>
                <td width="3%" style={{ lineHeight:"3"}} valign="bottom"><div>$</div></td>
                <td width="37%">
                    <div style={{float:"right"}}>
                        <InlineEditor val={entry.value.toFixed(2)} elmClass="editView" elmType="number" elmID={entry.uuid}/>
                    </div>
                </td>
                <td>
                    <button onClick={() => this.removeRow(index,dataSetName)}>X</button>
                </td>
            </tr>
        })
    }
}

export default App

