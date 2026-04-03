/**
 * MoneyWorks Asset Category Type Definitions
 * @moneyworks-entity AssetCategory
 * @moneyworks-dsl PURE
 */

import type { MoneyWorksDepreciationType } from "../assets/enums";

export interface MoneyWorksAssetCategory {
	Code: string;
	Description?: string;
	Group?: string;
	Custom?: string;
	Comments?: string;
	// GL Account Mappings
	AssetAccount?: string;
	AccumDepreciationAccount?: string;
	RevaluationSurplusAccount?: string;
	ImpairmentLossAccount?: string;
	DepreciationExpenseAccount?: string;
	DepreciationPersonalAccount?: string;
	DisposalGainLossAccount?: string;
	DisposalGainLossPersonalAccount?: string;
	// Depreciation settings
	DepreciationType?: MoneyWorksDepreciationType;
	DepreciationRate?: number;
	LastDepreciated?: string;
	PersonalUseEnabled?: boolean;
	CalculateDailyBasis?: boolean;
}

export interface MoneyWorksAssetCategoryCreateInput {
	Code: string;
	Description?: string;
	Group?: string;
	AssetAccount: string;
	AccumDepreciationAccount: string;
	DepreciationExpenseAccount: string;
	DepreciationType: MoneyWorksDepreciationType;
	DepreciationRate: number;
}
