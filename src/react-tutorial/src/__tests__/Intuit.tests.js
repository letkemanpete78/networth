import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '../Intuit';
import Intuit from '../Intuit';

test('App works', () => {
    const { container } = render(<Intuit />)
})

test('has required titles',() =>{
    const { container} = render (
        <Intuit />
    )
    const title = "Tracking your Net Worth"
    expect(screen.getByText (title)).toBeDefined
    const titleNet = "Net Worth:"
    expect(screen.getByText (titleNet)).toBeDefined
    const assetTitle = "Assets"
    expect(screen.getByText (assetTitle)).toBeDefined
    const shortCashTitle= "Cash and Investments"
    expect(screen.getByText (shortCashTitle)).toBeDefined
    const longCashTitle = "Long Term Assets"
    expect(screen.getByText (longCashTitle)).toBeDefined
    const totalAssetsTitle = "Total Assets:"
    expect(screen.getByText (totalAssetsTitle)).toBeDefined
    const totalLiabiltiesTitle= "Total Liabilties:"
    expect(screen.getByText (totalLiabiltiesTitle)).toBeDefined
    const longTermLiabiltyTitle = "Long Term Debt"
    expect(screen.getByText (longTermLiabiltyTitle)).toBeDefined
    const shortTermLiabiltyTitle = "Short Term Liabilties"
    expect(screen.getByText (shortTermLiabiltyTitle)).toBeDefined

    const shortTermAssetButton = "Add Short Term Asset"
    expect(screen.getByText (shortTermAssetButton)).toBeDefined
    const longTermAssetButton = "Add Long Term Asset"
    expect(screen.getByText (longTermAssetButton)).toBeDefined
    const longTermLiabilityButton = "Add Long Term Debt"
    expect(screen.getByText (longTermLiabilityButton)).toBeDefined
    const shortTermLiabilityButton = "Add Short Term Liability"
    expect(screen.getByText (shortTermLiabilityButtonw)).toBeDefined
})