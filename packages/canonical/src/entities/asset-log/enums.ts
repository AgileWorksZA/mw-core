/**
 * MoneyWorks Asset Log Action Types
 * @moneyworks-entity AssetLog
 * @moneyworks-dsl PURE
 */

export enum MoneyWorksAssetLogAction {
	ACQUISITION = "AA",
	DISPOSAL = "AD",
	PART_DISPOSAL = "AP",
	DEPRECIATION_SL = "DS",
	DEPRECIATION_DV = "DD",
	MEMO = "ME",
	REVALUATION = "RV",
}
