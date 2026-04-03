/**
 * MoneyWorks Asset Type Definitions — 32 fields
 * @moneyworks-entity Asset
 * @moneyworks-table Asset
 * @moneyworks-dsl PURE
 */

import type { MoneyWorksAssetStatus, MoneyWorksDepreciationType } from "./enums";

export interface MoneyWorksAsset {
	Code: string;
	Description?: string;
	Category?: string;
	SerialNum?: string;
	Qty?: number;
	ExpectedLife?: number;
	ResidualValue?: number;
	CostPerUnit?: number;
	AccumDepreciation?: number;
	BookValue?: number;
	Status?: MoneyWorksAssetStatus;
	Type?: MoneyWorksDepreciationType;
	Rate?: number;
	AcquiredDate?: string;
	LastDepreciated?: string;
	LastDisposed?: string;
	PrivateUsePercent?: number;
	Location?: string;
	Department?: string;
	LinkedTransaction?: number;
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	Comments?: string;
	Colour?: number;
	LastModifiedTime?: string;
	/** Calculated: CostPerUnit * Qty */
	TotalCost?: number;
	/** Calculated: TotalCost - AccumDepreciation */
	NetBookValue?: number;
}

export interface MoneyWorksAssetCreateInput {
	Code: string;
	Description: string;
	Category: string;
	CostPerUnit: number;
	Qty?: number;
	Type?: MoneyWorksDepreciationType;
	Rate?: number;
	ExpectedLife?: number;
	ResidualValue?: number;
	AcquiredDate?: string;
	AccumDepreciation?: number;
	LastDepreciated?: string;
	PrivateUsePercent?: number;
	Location?: string;
	Department?: string;
	SerialNum?: string;
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	Comments?: string;
	Colour?: number;
}

export interface MoneyWorksAssetUpdateInput {
	Code: string;
	Description?: string;
	Category?: string;
	Rate?: number;
	ExpectedLife?: number;
	ResidualValue?: number;
	PrivateUsePercent?: number;
	Location?: string;
	Department?: string;
	SerialNum?: string;
	Custom1?: string;
	Custom2?: string;
	Custom3?: string;
	Custom4?: string;
	Comments?: string;
	Colour?: number;
}

export interface MoneyWorksAssetFilter {
	status?: MoneyWorksAssetStatus;
	category?: string;
	department?: string;
	searchText?: string;
}
