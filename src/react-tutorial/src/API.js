import React, { Component } from 'react'
import EdiText from 'react-editext'


class App extends Component {
    state = {
        assetDataShort: [],
        assetDataLong: [],
        assetTotal:0,
        liabilityDataShort: [],
        liabilityDataLong: [],
        liabilityTotal:0,
    }

    componentDidMount(){

        const urlShortAsset = 'http://localhost:8080/?category=short_term&type=asset'
        const urlLongAsset = 'http://localhost:8080/?category=long_term&type=asset'
        const urlShortLiability = 'http://localhost:8080/?category=short_term&type=liability'
        const urlLongLiability = 'http://localhost:8080/?category=long_term&type=liability'
        

       


        fetch(urlShortAsset)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    assetDataShort: result,
                })
            })

        fetch(urlLongAsset)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    assetDataLong: result,
                })
            })

        fetch(urlShortLiability)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    liabilityDataShort: result,
                })
            })

        fetch(urlLongLiability)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    liabilityDataLong: result,
                })
            })

    }

    onSave = val => {
        console.log('Edited Value -> ', val)
    }

    updateTotal(tablename, totaldiv) {
        let assets = document.getElementById(tablename)
        let assetValues = assets.getElementsByClassName("editView")
    
        var i
        var total = 0
        for (i = 0; i < assetValues.length; i++) {
            total += parseFloat(assetValues[i].innerHTML)
        }
        document.getElementById(totaldiv).innerHTML = total.toFixed(2);
        return total;
    }

    sayHello(name,val) {
        let totalAssets = this.updateTotal("assetTable", "assetTotal");
        let totalLiability = this.updateTotal("liabilityTable", "liabilityTotal");
        let totalworth = totalAssets-totalLiability
        document.getElementById("networth").innerHTML = totalworth.toFixed(2);


        console.log(`hello, ${name}`);
        console.log('Edited Value -> ', val)

      }

    render(){
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = this.state

        const shortAssetsTotal = assetDataShort.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2);
        const longAssetsTotal = assetDataLong.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2);
        var assetTotal = parseFloat(shortAssetsTotal) + parseFloat(longAssetsTotal);

        const shortLiabilitysTotal = liabilityDataShort.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2);
        const longLiabilitysTotal = liabilityDataLong.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2);
        var liabilityTotal = parseFloat(shortLiabilitysTotal) + parseFloat(longLiabilitysTotal);

        const InlineEditor = props =>{
            // https://github.com/Vargentum/react-editext
            const {val,editName} = props
            return (
                    <EdiText
                        type="number"
                        viewProps={{
                            id: editName,
                            className: "editView",
                            float: "right"
                          }}
                        value={String(val)}
                        onSave={v => this.sayHello("pete",v)}
                    />
            )
        }

        const resultAssetShort = this.newMoneyRows(assetDataShort, InlineEditor)

        const resultAssetLong = this.newMoneyRows(assetDataLong, InlineEditor)
        
        const resultLiabilityShort = this.newMoneyRows(liabilityDataShort, InlineEditor)

        const resultLiabilityLong =  this.newMoneyRows(liabilityDataLong, InlineEditor)

        const CalcNetworth = () =>{
            return (assetTotal - liabilityTotal).toFixed(2)
        }

        const AssetTable = () => {
            return (
                <table id="assetTable"> 
                    <thead><tr><th colSpan="3"><h4>Assets</h4></th></tr></thead>
                    <tbody>
                        <tr><td colSpan="3"><h5>Cash and Investments</h5></td></tr>
                        {resultAssetShort}
                        <tr><td colSpan="3"><h5>Long Term Assets</h5></td></tr>
                        {resultAssetLong}
                    </tbody>
                    <tfoot><tr><td><h4>Total Assets:</h4></td><td ><h4 align="right">$</h4></td><td id="assetTotal"><h4 style={{float:"right"}}>{assetTotal.toFixed(2)}<ExtraSpacing /></h4></td></tr></tfoot>
                </table>
            )}

        const ExtraSpacing = () => {
            return (
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            )
        }

        const LiabilityTable = () => {
            return (
                <table id="liabilityTable">
                    <thead><tr><th colSpan="3"><h4>Liabilities</h4></th></tr></thead>
                    <tbody>
                        <tr><td colSpan="3"><h5>Short Term Liabilties</h5></td></tr>
                        {resultLiabilityShort}
                        <tr><td colSpan="3"><h5>Long Term Debt</h5></td></tr>
                        {resultLiabilityLong}
                    </tbody>
                    <tfoot><tr><td><h4>Total Liabilties:</h4></td><td ><h4 align="right" >$</h4></td><td id="liabilityTotal"><h4 style={{float:"right"}}>{liabilityTotal.toFixed(2)}<ExtraSpacing /></h4></td></tr></tfoot>
                </table>
            )
        }

        const CurrencySelect = props => {
            const { currency } = props;
            return (
                <select value={currency} name="currency" >
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                </select>
            )
        }

        const MainTable = () => {
            return (
                <div>
                    <h1>Tracking your Networth</h1>
                    <div>Select Currency: <CurrencySelect currency="USD"/></div>
                    Networth: <div id="networth" style={{display:"inline"}}><CalcNetworth/></div>
                    <AssetTable/>
                    <LiabilityTable/>
                </div>
            )
        }


        return <MainTable/>
    }

    newMoneyRows(assetDataShort, InlineEditor) {
        return assetDataShort.map((entry, index) => {
            return <tr key={index}><td width="77%"><div>{entry.type}-{entry.category}{entry.label}</div></td><td width="3%" style={{float:"right"}}><div>$</div></td><td width="20%"><div style={{float:"right"}}><InlineEditor val={entry.value.toFixed(2)} editName={entry.uuid} /></div></td></tr>
        })
    }
}

export default App


