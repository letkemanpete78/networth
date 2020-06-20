import React, { Component } from 'react'

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

    render(){
        const { assetDataShort, assetDataLong, liabilityDataShort, liabilityDataLong } = this.state

        const shortAssetsTotal = assetDataShort.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2);
        const longAssetsTotal = assetDataLong.reduce((totalAssets, asset) => totalAssets + parseFloat(asset.value, 10), 0).toFixed(2);
        var assetTotal = parseFloat(shortAssetsTotal) + parseFloat(longAssetsTotal);

        const shortLiabilitysTotal = liabilityDataShort.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2);
        const longLiabilitysTotal = liabilityDataLong.reduce((totalLiabilitys, liability) => totalLiabilitys + parseFloat(liability.value, 10), 0).toFixed(2);
        var liabilityTotal = parseFloat(shortLiabilitysTotal) + parseFloat(longLiabilitysTotal);

        const resultAssetShort = assetDataShort.map((entry, index) => {
            return <tr key={index} uuid={entry.uuid}><td>{entry.type}-{entry.category}{entry.label}</td><td>{entry.value}</td></tr>
        })

        const resultAssetLong = assetDataLong.map((entry, index) => {
            return <tr key={index} uuid={entry.uuid}><td>{entry.type}-{entry.category}{entry.label}</td><td>{entry.value}</td></tr>
        })
        
        const resultLiabilityShort = liabilityDataShort.map((entry, index) => {
            return <tr key={index} uuid={entry.uuid}><td>{entry.type}-{entry.category}{entry.label}</td><td>{entry.value}</td></tr>
        })

        const resultLiabilityLong = liabilityDataLong.map((entry, index) => {
            return <tr key={index} uuid={entry.uuid}><td>{entry.type}-{entry.category}{entry.label}</td><td>{entry.value}</td></tr>
        })

        const Networth = () =>{
            return (assetTotal - liabilityTotal)
        }

        const AssetTable = () => {
            return (
                <table>
                    <thead><tr><th>Assets</th></tr></thead>
                    <tbody>
                        <tr><td>Cash and Investments</td></tr>
                        {resultAssetShort}
                        <tr><td>Long Term Assets</td></tr>
                        {resultAssetLong}
                    </tbody>
                    <tfoot><tr><td>Total Assets:</td><td>{assetTotal}</td></tr></tfoot>
                </table>
            )}
        

        const LiabilityTable = () => {
            return (
                <table>
                    <thead><tr><th>Liabilities</th></tr></thead>
                    <tbody>
                        <tr><td>Short Term Liabilties</td></tr>
                        {resultLiabilityShort}
                        <tr><td>Long Term Debt</td></tr>
                        {resultLiabilityLong}
                    </tbody>
                    <tfoot><tr><td>Total Liabilties</td><td>{liabilityTotal}</td></tr></tfoot>
                </table>
            )
        }

        const CurrencySelect = props => {
            const { currency } = props.currency;
            return (
                <select value={currency} name="currency" >
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                </select>
            )
        }
        

        return <div><h1>Tracking your Networth</h1><div>Select Currency: <CurrencySelect currency="USD"/></div>Networth: <Networth/><div></div><AssetTable/> <LiabilityTable/></div>
    }
}

export default App