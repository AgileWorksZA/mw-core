/**
 * Mock MoneyWorks API responses for testing
 */

export const mockMoneyWorksResponses = {
  // Mock suppliers data
  searchNames: (filter: string) => {
    if (filter.toLowerCase().includes('supplier')) {
      return {
        success: true,
        data: [
          {
            Code: "SUP001",
            Name: "Acme Supplies Ltd",
            Phone: "+1 555-0100",
            Email: "orders@acmesupplies.com",
            CustomerType: "none",
            SupplierType: "supplier"
          },
          {
            Code: "SUP002", 
            Name: "Global Materials Inc",
            Phone: "+1 555-0200",
            Email: "sales@globalmaterials.com",
            CustomerType: "none",
            SupplierType: "supplier"
          },
          {
            Code: "SUP003",
            Name: "Premium Parts Co",
            Phone: "+1 555-0300",
            Email: "info@premiumparts.com",
            CustomerType: "none",
            SupplierType: "supplier"
          },
          {
            Code: "CRED001",
            Name: "Tech Solutions Provider",
            Phone: "+1 555-0400",
            Email: "billing@techsolutions.com",
            CustomerType: "none",
            SupplierType: "creditor"
          },
          {
            Code: "CRED002",
            Name: "Office Essentials Direct",
            Phone: "+1 555-0500",
            Email: "accounts@officeessentials.com",
            CustomerType: "none",
            SupplierType: "creditor"
          }
        ]
      };
    }
    
    return {
      success: true,
      data: []
    };
  },
  
  // Mock tax rates
  getTaxRates: () => ({
    success: true,
    data: [
      { TaxCode: "GST10", TaxRate: 0.10, Description: "Goods and Services Tax 10%" },
      { TaxCode: "GST0", TaxRate: 0.00, Description: "GST Free" },
      { TaxCode: "BAS", TaxRate: 0.10, Description: "Capital Acquisitions" }
    ]
  }),
  
  // Mock company info
  getCompanyInfo: () => ({
    success: true,
    data: {
      CompanyName: "Acme Corporation",
      ABN: "12345678901",
      Address: "123 Business St, Sydney NSW 2000",
      Phone: "+61 2 9999 9999"
    }
  })
};

// Create a mock client that returns canned responses
export function createMockMoneyWorksClient() {
  return {
    searchNames: async (params: any) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockMoneyWorksResponses.searchNames(params.searchText || '');
    },
    
    getTaxRates: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockMoneyWorksResponses.getTaxRates();
    },
    
    getCompanyInfo: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockMoneyWorksResponses.getCompanyInfo();
    },
    
    // Add more mock methods as needed
    export: async (table: string, params: any) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (table === 'Name' && params.filter?.includes('supplier')) {
        return mockMoneyWorksResponses.searchNames('supplier');
      }
      
      if (table === 'TaxRate') {
        return mockMoneyWorksResponses.getTaxRates();
      }
      
      return { success: true, data: [] };
    }
  };
}