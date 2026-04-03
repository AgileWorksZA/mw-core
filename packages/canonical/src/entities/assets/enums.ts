/**
 * MoneyWorks Asset Enumerations
 * @moneyworks-entity Asset
 * @moneyworks-dsl PURE
 */

export enum MoneyWorksAssetStatus {
	NEW = "NEW",
	ACTIVE = "ACT",
	NON_DEPRECIABLE = "NDP",
	OTHER = "OTH",
	DISPOSED = "DSP",
}

export enum MoneyWorksDepreciationType {
	STRAIGHT_LINE = "SL",
	DIMINISHING_VALUE = "DV",
}
