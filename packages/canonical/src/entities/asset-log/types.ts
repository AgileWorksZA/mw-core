/**
 * MoneyWorks Asset Log Type Definitions
 * @moneyworks-entity AssetLog
 * @moneyworks-dsl PURE
 */

import type { MoneyWorksAssetLogAction } from "./enums";

export interface MoneyWorksAssetLog {
	AssetCode: string;
	Date: string;
	Action: MoneyWorksAssetLogAction;
	Amount: number;
	Description?: string;
	TransactionSeqNum?: number;
	Period?: number;
}
