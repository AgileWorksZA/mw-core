/**
 * MoneyWorks Assets Table Interface
 *
 * The Assets file contains fixed asset records for tracking capital items,
 * their depreciation, and disposal. It manages the lifecycle of assets from
 * acquisition through disposal.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_assets.html
 */

/**
 * Asset status codes
 * @description Current state of the asset
 */
export enum AssetStatus {
  /** New - not yet in service */
  New = "NEW",
  /** Active - currently in use */
  Active = "ACT",
  /** No depreciation - active but not depreciating */
  NoDepreciation = "NDP",
  /** Other - special status */
  Other = "OTH",
  /** Disposed - sold or written off */
  Disposed = "DSP",
}

/**
 * Depreciation type codes
 * @description Method of calculating depreciation
 */
export enum DepreciationType {
  /** Straight line depreciation */
  StraightLine = "SL",
  /** Diminishing value depreciation */
  DiminishingValue = "DV",
}

/**
 * MoneyWorks Assets Table (Raw Interface)
 * @description Complete interface for the Assets table with exact field names
 */
export interface Asset {
  /**
   * Asset code
   * @maxLength 19
   * @description Unique identifier for the asset
   * @example "VEHICLE001"
   */
  Code: string;

  /**
   * Asset description
   * @maxLength 63
   * @description Display name/description of the asset
   * @example "2020 Toyota Hilux - Registration ABC123"
   */
  Description?: string;

  /**
   * Cost per unit
   * @description Purchase price or cost of the asset
   * @example 45000.00
   */
  Cost?: number;

  /**
   * Acquisition date
   * @format date
   * @description Date the asset was purchased or acquired
   */
  AcquisitionDate?: Date | string;

  /**
   * Asset status
   * @maxLength 3
   * @description Current state of the asset
   * @default "NEW"
   */
  Status?: AssetStatus;

  /**
   * Expected life
   * @description Expected useful life in years
   * @example 5 (for 5 years)
   */
  ExpectedLife?: number;

  /**
   * Depreciation type
   * @maxLength 3
   * @description Method used to calculate depreciation
   * @default "SL"
   */
  Type?: DepreciationType;

  /**
   * Department code
   * @maxLength 5
   * @description Department responsible for the asset
   * @relationship References Department.Code
   */
  Dept?: string;

  /**
   * Location
   * @maxLength 15
   * @description Physical location of the asset
   * @example "Head Office"
   */
  Location?: string;

  /**
   * Serial number
   * @maxLength 31
   * @description Manufacturer's serial number
   */
  SerialNum?: string;

  /**
   * Private use percentage
   * @description Percentage of asset used for private purposes
   * @minimum 0
   * @maximum 100
   * @example 20 (for 20% private use)
   */
  PrivateUsePercent?: number;

  /**
   * Opening book value
   * @description Book value at start of financial year
   * @readonly
   */
  OpeningBookValue?: number;

  /**
   * Current book value
   * @description Current depreciated value
   * @readonly
   */
  BookValue?: number;

  /**
   * Accumulated depreciation
   * @description Total depreciation to date
   * @readonly
   */
  AccumDep?: number;

  /**
   * Disposal date
   * @format date
   * @description Date asset was sold or disposed
   */
  DisposalDate?: Date | string;

  /**
   * Disposal proceeds
   * @description Amount received from asset disposal
   */
  DisposalProceeds?: number;

  /**
   * Asset account
   * @maxLength 7
   * @description General ledger account for asset value
   * @relationship References Account.Code
   */
  AssetAccount?: string;

  /**
   * Depreciation account
   * @maxLength 7
   * @description General ledger account for depreciation expense
   * @relationship References Account.Code
   */
  DepnAccount?: string;

  /**
   * Accumulated depreciation account
   * @maxLength 7
   * @description General ledger account for accumulated depreciation
   * @relationship References Account.Code
   */
  AccumDepnAccount?: string;

  /**
   * User-defined custom field 1
   * @maxLength 15
   * @description For your own use
   */
  Custom1?: string;

  /**
   * User-defined custom field 2
   * @maxLength 15
   * @description For your own use
   */
  Custom2?: string;

  /**
   * User-defined custom field 3
   * @maxLength 15
   * @description For your own use
   */
  Custom3?: string;

  /**
   * User-defined custom field 4
   * @maxLength 15
   * @description For your own use
   */
  Custom4?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  UserNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  UserText?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  TaggedText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date and time of last record change
   * @readonly
   */
  LastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  ModUser?: string;
}

/**
 * MoneyWorks Assets Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface AssetCamel {
  /**
   * Asset code
   * @maxLength 19
   * @description Unique identifier for the asset
   * @example "VEHICLE001"
   */
  code: string;

  /**
   * Asset description
   * @maxLength 63
   * @description Display name/description of the asset
   * @example "2020 Toyota Hilux - Registration ABC123"
   */
  description?: string;

  /**
   * Cost per unit
   * @description Purchase price or cost of the asset
   * @example 45000.00
   */
  cost?: number;

  /**
   * Acquisition date
   * @format date
   * @description Date the asset was purchased or acquired
   */
  acquisitionDate?: Date | string;

  /**
   * Asset status
   * @maxLength 3
   * @description Current state of the asset
   * @default "NEW"
   */
  status?: AssetStatus;

  /**
   * Expected life
   * @description Expected useful life in years
   * @example 5 (for 5 years)
   */
  expectedLife?: number;

  /**
   * Depreciation type
   * @maxLength 3
   * @description Method used to calculate depreciation
   * @default "SL"
   */
  type?: DepreciationType;

  /**
   * Department code
   * @maxLength 5
   * @description Department responsible for the asset
   * @relationship References Department.Code
   */
  dept?: string;

  /**
   * Location
   * @maxLength 15
   * @description Physical location of the asset
   * @example "Head Office"
   */
  location?: string;

  /**
   * Serial number
   * @maxLength 31
   * @description Manufacturer's serial number
   */
  serialNum?: string;

  /**
   * Private use percentage
   * @description Percentage of asset used for private purposes
   * @minimum 0
   * @maximum 100
   * @example 20 (for 20% private use)
   */
  privateUsePercent?: number;

  /**
   * Opening book value
   * @description Book value at start of financial year
   * @readonly
   */
  openingBookValue?: number;

  /**
   * Current book value
   * @description Current depreciated value
   * @readonly
   */
  bookValue?: number;

  /**
   * Accumulated depreciation
   * @description Total depreciation to date
   * @readonly
   */
  accumDep?: number;

  /**
   * Disposal date
   * @format date
   * @description Date asset was sold or disposed
   */
  disposalDate?: Date | string;

  /**
   * Disposal proceeds
   * @description Amount received from asset disposal
   */
  disposalProceeds?: number;

  /**
   * Asset account
   * @maxLength 7
   * @description General ledger account for asset value
   * @relationship References Account.Code
   */
  assetAccount?: string;

  /**
   * Depreciation account
   * @maxLength 7
   * @description General ledger account for depreciation expense
   * @relationship References Account.Code
   */
  depnAccount?: string;

  /**
   * Accumulated depreciation account
   * @maxLength 7
   * @description General ledger account for accumulated depreciation
   * @relationship References Account.Code
   */
  accumDepnAccount?: string;

  /**
   * User-defined custom field 1
   * @maxLength 15
   * @description For your own use
   */
  custom1?: string;

  /**
   * User-defined custom field 2
   * @maxLength 15
   * @description For your own use
   */
  custom2?: string;

  /**
   * User-defined custom field 3
   * @maxLength 15
   * @description For your own use
   */
  custom3?: string;

  /**
   * User-defined custom field 4
   * @maxLength 15
   * @description For your own use
   */
  custom4?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  userNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  userText?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  taggedText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date and time of last record change
   * @readonly
   */
  lastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  modUser?: string;
}

/**
 * Converter utilities for Assets table
 */
export const assetConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: Asset): AssetCamel {
    return {
      code: raw.Code,
      description: raw.Description,
      cost: raw.Cost,
      acquisitionDate: raw.AcquisitionDate,
      status: raw.Status,
      expectedLife: raw.ExpectedLife,
      type: raw.Type,
      dept: raw.Dept,
      location: raw.Location,
      serialNum: raw.SerialNum,
      privateUsePercent: raw.PrivateUsePercent,
      openingBookValue: raw.OpeningBookValue,
      bookValue: raw.BookValue,
      accumDep: raw.AccumDep,
      disposalDate: raw.DisposalDate,
      disposalProceeds: raw.DisposalProceeds,
      assetAccount: raw.AssetAccount,
      depnAccount: raw.DepnAccount,
      accumDepnAccount: raw.AccumDepnAccount,
      custom1: raw.Custom1,
      custom2: raw.Custom2,
      custom3: raw.Custom3,
      custom4: raw.Custom4,
      userNum: raw.UserNum,
      userText: raw.UserText,
      taggedText: raw.TaggedText,
      lastModifiedTime: raw.LastModifiedTime,
      modUser: raw.ModUser,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: AssetCamel): Asset {
    return {
      Code: camel.code,
      Description: camel.description,
      Cost: camel.cost,
      AcquisitionDate: camel.acquisitionDate,
      Status: camel.status,
      ExpectedLife: camel.expectedLife,
      Type: camel.type,
      Dept: camel.dept,
      Location: camel.location,
      SerialNum: camel.serialNum,
      PrivateUsePercent: camel.privateUsePercent,
      OpeningBookValue: camel.openingBookValue,
      BookValue: camel.bookValue,
      AccumDep: camel.accumDep,
      DisposalDate: camel.disposalDate,
      DisposalProceeds: camel.disposalProceeds,
      AssetAccount: camel.assetAccount,
      DepnAccount: camel.depnAccount,
      AccumDepnAccount: camel.accumDepnAccount,
      Custom1: camel.custom1,
      Custom2: camel.custom2,
      Custom3: camel.custom3,
      Custom4: camel.custom4,
      UserNum: camel.userNum,
      UserText: camel.userText,
      TaggedText: camel.taggedText,
      LastModifiedTime: camel.lastModifiedTime,
      ModUser: camel.modUser,
    };
  },
};

/**
 * Helper functions for Assets table
 */
export const assetHelpers = {
  /**
   * Check if asset is active
   * @param status - The asset status
   * @returns True if the asset is active
   */
  isActive(status?: AssetStatus): boolean {
    return (
      status === AssetStatus.Active || status === AssetStatus.NoDepreciation
    );
  },

  /**
   * Check if asset has been disposed
   * @param status - The asset status
   * @returns True if the asset has been disposed
   */
  isDisposed(status?: AssetStatus): boolean {
    return status === AssetStatus.Disposed;
  },

  /**
   * Calculate annual depreciation (straight line)
   * @param cost - Asset cost
   * @param expectedLife - Expected life in years
   * @param privateUsePercent - Private use percentage
   * @returns Annual depreciation amount
   */
  calculateStraightLineDepreciation(
    cost?: number,
    expectedLife?: number,
    privateUsePercent?: number,
  ): number {
    if (!cost || !expectedLife || expectedLife === 0) return 0;

    const annualDepreciation = cost / expectedLife;
    const businessPercent = 100 - (privateUsePercent || 0);

    return (
      Math.round(((annualDepreciation * businessPercent) / 100) * 100) / 100
    );
  },

  /**
   * Calculate gain/loss on disposal
   * @param bookValue - Current book value
   * @param disposalProceeds - Amount received on disposal
   * @returns Gain (positive) or loss (negative) on disposal
   */
  calculateDisposalGainLoss(
    bookValue?: number,
    disposalProceeds?: number,
  ): number {
    return (disposalProceeds || 0) - (bookValue || 0);
  },

  /**
   * Calculate age of asset in years
   * @param acquisitionDate - Date asset was acquired
   * @returns Age in years (null if no acquisition date)
   */
  calculateAge(acquisitionDate?: Date | string): number | null {
    if (!acquisitionDate) return null;

    const acquired =
      typeof acquisitionDate === "string"
        ? new Date(acquisitionDate)
        : acquisitionDate;

    const today = new Date();
    const years = today.getFullYear() - acquired.getFullYear();
    const monthDiff = today.getMonth() - acquired.getMonth();

    // Adjust for partial years
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < acquired.getDate())
    ) {
      return years - 1;
    }

    return years;
  },

  /**
   * Check if asset is fully depreciated
   * @param bookValue - Current book value
   * @param cost - Original cost
   * @returns True if asset is fully depreciated
   */
  isFullyDepreciated(bookValue?: number, cost?: number): boolean {
    if (!cost) return false;
    return (bookValue || 0) <= 0 || (bookValue || 0) < cost * 0.01; // Less than 1% of cost
  },

  /**
   * Get depreciation method display name
   * @param type - Depreciation type code
   * @returns User-friendly depreciation method name
   */
  getDepreciationMethodName(type?: DepreciationType): string {
    switch (type) {
      case DepreciationType.StraightLine:
        return "Straight Line";
      case DepreciationType.DiminishingValue:
        return "Diminishing Value";
      default:
        return "Unknown";
    }
  },

  /**
   * Create asset summary text
   * @param asset - The asset record
   * @returns Multi-line summary of key asset information
   */
  getAssetSummary(asset: Asset): string {
    const lines: string[] = [];

    if (asset.Description) lines.push(asset.Description);
    if (asset.Cost) lines.push(`Cost: $${asset.Cost.toLocaleString()}`);
    if (asset.BookValue !== undefined)
      lines.push(`Book Value: $${asset.BookValue.toLocaleString()}`);
    if (asset.Status) lines.push(`Status: ${asset.Status}`);
    if (asset.Location) lines.push(`Location: ${asset.Location}`);
    if (asset.SerialNum) lines.push(`Serial: ${asset.SerialNum}`);

    return lines.join("\n");
  },
};
