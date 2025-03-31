import type { Account } from "../types/interface/account";

// Mock data for demonstration
const accounts: Account[] = [
  {
    SequenceNumber: 1,
    LastModifiedTime: new Date(),
    Code: "ASSET001",
    Type: "A",
    Group: "ASSET",
    Category: "CURRENT",
    Description: "Bank Account",
    PandL: "",
    TaxCode: "NONE",
    Flags: 0,
    System: "N",
    Created: new Date(),
    Category2: "",
    Category3: "",
    Category4: "",
    AccountantCode: "",
    Colour: 0,
    Currency: "USD",
    SecurityLevel: 0,
    BankAccountNumber: "123456789",
    BalanceLimit: 0,
    ManualChequeNumber: "",
    PrintedChequeNumber: "",
    LastStatementImport: new Date(),
    Comments: "",
    ManualChequeNumDigits: 0,
    PrintedChequeNumDigits: 0,
    UserNum: 0,
    UserText: "",
    TaggedText: "",
    FeedID: "",
    Cashflow: "",
    Cashforecast: "",
    EBITDA: "",
    ImportFormat: "",
  },
];

const transactions = [
  {
    SequenceNumber: 12345,
    LastModifiedTime: new Date(),
    OurRef: "INV12345",
    TransDate: new Date(),
    EnterDate: new Date(),
    DueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    Period: 3,
    Type: "INVC",
    TheirRef: "PO98765",
    NameCode: "CUSTOMER1",
    Description: "Monthly Services",
    Gross: 1500.0,
    Status: "OP",
  },
];

const names = [
  {
    SequenceNumber: 101,
    LastModifiedTime: new Date(),
    Code: "CUSTOMER1",
    Name: "Sample Customer 1",
    Type: "C",
    Status: "A",
    Address: "123 Sample St",
    City: "Sample City",
    State: "CA",
    PostCode: "12345",
    Country: "USA",
    Phone: "555-123-4567",
    Email: "customer1@example.com",
  },
];

const products = [
  {
    SequenceNumber: 201,
    LastModifiedTime: new Date(),
    Code: "PROD001",
    Description: "Sample Product",
    SalesAccount: "SALES",
    COGSAccount: "COGS",
    InventoryAccount: "INVENTORY",
    Type: "S",
    SellPrice: 99.99,
    BuyPrice: 49.99,
    TaxCode: "GST",
  },
];

// Helper function to parse filters
const parseFilter = (filter?: string) => {
  if (!filter) return null;

  const parts = filter.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid filter format. Expected field:operator:value");
  }

  const [field, operator, value] = parts;
  return { field, operator, value };
};

// Helper function to add pagination metadata
const addPagination = (
  data: any[],
  total: number,
  limit: number,
  offset: number,
  path: string,
  filter?: string,
) => {
  const filterParam = filter ? `&filter=${filter}` : "";
  const nextOffset = offset + limit;
  const prevOffset = offset - limit >= 0 ? offset - limit : null;

  return {
    data,
    pagination: {
      total,
      limit,
      offset,
      next:
        nextOffset < total
          ? `${path}?limit=${limit}&offset=${nextOffset}${filterParam}`
          : null,
      prev:
        prevOffset !== null
          ? `${path}?limit=${limit}&offset=${prevOffset}${filterParam}`
          : null,
    },
  };
};

export const moneyworksService = {
  // Account methods
  getAccounts: ({
    limit = 10,
    offset = 0,
    sort,
    order,
    filter,
  }: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
    filter?: string;
  }) => {
    let filteredAccounts = [...accounts];

    // Apply filtering
    if (filter) {
      const parsedFilter = parseFilter(filter);
      if (parsedFilter) {
        const { field, operator, value } = parsedFilter;
        filteredAccounts = filteredAccounts.filter((account) => {
          const accountValue = (account as any)[field];
          switch (operator) {
            case "eq":
              return accountValue === value;
            case "ne":
              return accountValue !== value;
            case "gt":
              return accountValue > value;
            case "lt":
              return accountValue < value;
            case "gte":
              return accountValue >= value;
            case "lte":
              return accountValue <= value;
            case "like":
              return accountValue.includes(value.replace(/%/g, ""));
            default:
              return true;
          }
        });
      }
    }

    // Apply sorting
    if (sort) {
      filteredAccounts.sort((a, b) => {
        const aValue = (a as any)[sort];
        const bValue = (b as any)[sort];
        if (order === "desc") {
          return aValue > bValue ? -1 : 1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const paginatedAccounts = filteredAccounts.slice(offset, offset + limit);

    return addPagination(
      paginatedAccounts,
      filteredAccounts.length,
      limit,
      offset,
      "/api/accounts",
      filter,
    );
  },

  getAccountById: (id: string) => {
    const account = accounts.find(
      (a) => a.Code === id || a.SequenceNumber.toString() === id,
    );
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  },

  createAccount: (accountData: Partial<Account>) => {
    const newAccount: Account = {
      SequenceNumber: accounts.length + 1,
      LastModifiedTime: new Date(),
      Code: accountData.Code || "",
      Type: accountData.Type || "",
      Group: accountData.Group || "",
      Category: accountData.Category || "",
      Description: accountData.Description || "",
      PandL: accountData.PandL || "",
      TaxCode: accountData.TaxCode || "",
      Flags: accountData.Flags || 0,
      System: accountData.System || "",
      Created: new Date(),
      Category2: accountData.Category2 || "",
      Category3: accountData.Category3 || "",
      Category4: accountData.Category4 || "",
      AccountantCode: accountData.AccountantCode || "",
      Colour: accountData.Colour || 0,
      Currency: accountData.Currency || "",
      SecurityLevel: accountData.SecurityLevel || 0,
      BankAccountNumber: accountData.BankAccountNumber || "",
      BalanceLimit: accountData.BalanceLimit || 0,
      ManualChequeNumber: accountData.ManualChequeNumber || "",
      PrintedChequeNumber: accountData.PrintedChequeNumber || "",
      LastStatementImport: accountData.LastStatementImport || new Date(),
      Comments: accountData.Comments || "",
      ManualChequeNumDigits: accountData.ManualChequeNumDigits || 0,
      PrintedChequeNumDigits: accountData.PrintedChequeNumDigits || 0,
      UserNum: accountData.UserNum || 0,
      UserText: accountData.UserText || "",
      TaggedText: accountData.TaggedText || "",
      FeedID: accountData.FeedID || "",
      Cashflow: accountData.Cashflow || "",
      Cashforecast: accountData.Cashforecast || "",
      EBITDA: accountData.EBITDA || "",
      ImportFormat: accountData.ImportFormat || "",
    };

    accounts.push(newAccount);
    return newAccount;
  },

  updateAccount: (id: string, accountData: Partial<Account>) => {
    const index = accounts.findIndex(
      (a) => a.Code === id || a.SequenceNumber.toString() === id,
    );
    if (index === -1) {
      throw new Error("Account not found");
    }

    const updatedAccount = {
      ...accounts[index],
      ...accountData,
      LastModifiedTime: new Date(),
    };

    accounts[index] = updatedAccount;
    return updatedAccount;
  },

  deleteAccount: (id: string) => {
    const index = accounts.findIndex(
      (a) => a.Code === id || a.SequenceNumber.toString() === id,
    );
    if (index === -1) {
      throw new Error("Account not found");
    }

    const deletedAccount = accounts[index];
    accounts.splice(index, 1);
    return { message: "Account deleted successfully", deletedAccount };
  },

  // Transaction methods
  getTransactions: ({
    limit = 10,
    offset = 0,
    sort,
    order,
    filter,
  }: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
    filter?: string;
  }) => {
    let filteredTransactions = [...transactions];

    // Apply filtering
    if (filter) {
      const parsedFilter = parseFilter(filter);
      if (parsedFilter) {
        const { field, operator, value } = parsedFilter;
        filteredTransactions = filteredTransactions.filter((transaction) => {
          const transactionValue = (transaction as any)[field];
          if (transactionValue === undefined) return false;

          switch (operator) {
            case "eq":
              return transactionValue === value;
            case "ne":
              return transactionValue !== value;
            case "gt":
              return transactionValue > value;
            case "lt":
              return transactionValue < value;
            case "gte":
              return transactionValue >= value;
            case "lte":
              return transactionValue <= value;
            case "like":
              return (
                typeof transactionValue === "string" &&
                transactionValue.includes(value.replace(/%/g, ""))
              );
            default:
              return true;
          }
        });
      }
    }

    // Apply sorting
    if (sort) {
      filteredTransactions.sort((a, b) => {
        const aValue = (a as any)[sort];
        const bValue = (b as any)[sort];
        if (order === "desc") {
          return aValue > bValue ? -1 : 1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const paginatedTransactions = filteredTransactions.slice(
      offset,
      offset + limit,
    );

    return addPagination(
      paginatedTransactions,
      filteredTransactions.length,
      limit,
      offset,
      "/api/transactions",
      filter,
    );
  },

  getTransactionById: (id: string) => {
    const transaction = transactions.find(
      (t) => t.SequenceNumber.toString() === id || t.OurRef === id,
    );
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return transaction;
  },

  createTransaction: (transactionData: any) => {
    const newTransaction = {
      SequenceNumber: transactions.length + 1,
      LastModifiedTime: new Date(),
      EnterDate: new Date(),
      Period: new Date().getMonth() + 1,
      Status: "OP",
      ...transactionData,
      TransDate: new Date(transactionData.TransDate),
      DueDate: transactionData.DueDate
        ? new Date(transactionData.DueDate)
        : undefined,
    };

    transactions.push(newTransaction);
    return newTransaction;
  },

  updateTransaction: (id: string, transactionData: any) => {
    const index = transactions.findIndex(
      (t) => t.SequenceNumber.toString() === id || t.OurRef === id,
    );
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    const updatedTransaction = {
      ...transactions[index],
      ...transactionData,
      LastModifiedTime: new Date(),
      TransDate: transactionData.TransDate
        ? new Date(transactionData.TransDate)
        : transactions[index].TransDate,
      DueDate: transactionData.DueDate
        ? new Date(transactionData.DueDate)
        : transactions[index].DueDate,
    };

    transactions[index] = updatedTransaction;
    return updatedTransaction;
  },

  deleteTransaction: (id: string) => {
    const index = transactions.findIndex(
      (t) => t.SequenceNumber.toString() === id || t.OurRef === id,
    );
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    const deletedTransaction = transactions[index];
    transactions.splice(index, 1);
    return { message: "Transaction deleted successfully", deletedTransaction };
  },

  // Names methods
  getNames: ({
    limit = 10,
    offset = 0,
    sort,
    order,
    filter,
  }: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
    filter?: string;
  }) => {
    let filteredNames = [...names];

    // Apply filtering
    if (filter) {
      const parsedFilter = parseFilter(filter);
      if (parsedFilter) {
        const { field, operator, value } = parsedFilter;
        filteredNames = filteredNames.filter((name) => {
          const nameValue = (name as any)[field];
          if (nameValue === undefined) return false;

          switch (operator) {
            case "eq":
              return nameValue === value;
            case "ne":
              return nameValue !== value;
            case "gt":
              return nameValue > value;
            case "lt":
              return nameValue < value;
            case "gte":
              return nameValue >= value;
            case "lte":
              return nameValue <= value;
            case "like":
              return (
                typeof nameValue === "string" &&
                nameValue.includes(value.replace(/%/g, ""))
              );
            default:
              return true;
          }
        });
      }
    }

    // Apply sorting
    if (sort) {
      filteredNames.sort((a, b) => {
        const aValue = (a as any)[sort];
        const bValue = (b as any)[sort];
        if (order === "desc") {
          return aValue > bValue ? -1 : 1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const paginatedNames = filteredNames.slice(offset, offset + limit);

    return addPagination(
      paginatedNames,
      filteredNames.length,
      limit,
      offset,
      "/api/names",
      filter,
    );
  },

  getNameById: (id: string) => {
    const name = names.find(
      (n) => n.Code === id || n.SequenceNumber.toString() === id,
    );
    if (!name) {
      throw new Error("Name not found");
    }
    return name;
  },

  // Products methods
  getProducts: ({
    limit = 10,
    offset = 0,
    sort,
    order,
    filter,
  }: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: string;
    filter?: string;
  }) => {
    let filteredProducts = [...products];

    // Apply filtering
    if (filter) {
      const parsedFilter = parseFilter(filter);
      if (parsedFilter) {
        const { field, operator, value } = parsedFilter;
        filteredProducts = filteredProducts.filter((product) => {
          const productValue = (product as any)[field];
          if (productValue === undefined) return false;

          switch (operator) {
            case "eq":
              return productValue === value;
            case "ne":
              return productValue !== value;
            case "gt":
              return productValue > value;
            case "lt":
              return productValue < value;
            case "gte":
              return productValue >= value;
            case "lte":
              return productValue <= value;
            case "like":
              return (
                typeof productValue === "string" &&
                productValue.includes(value.replace(/%/g, ""))
              );
            default:
              return true;
          }
        });
      }
    }

    // Apply sorting
    if (sort) {
      filteredProducts.sort((a, b) => {
        const aValue = (a as any)[sort];
        const bValue = (b as any)[sort];
        if (order === "desc") {
          return aValue > bValue ? -1 : 1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return addPagination(
      paginatedProducts,
      filteredProducts.length,
      limit,
      offset,
      "/api/products",
      filter,
    );
  },

  getProductById: (id: string) => {
    const product = products.find(
      (p) => p.Code === id || p.SequenceNumber.toString() === id,
    );
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },

  // Batch operations
  processBatch: async (
    operations: Array<{ method: string; path: string; body?: any }>,
  ) => {
    const results = [];

    for (const operation of operations) {
      try {
        let result;
        const path = operation.path.replace(/^\/api\//, "");
        const segments = path.split("/");
        const resource = segments[0];
        const id = segments[1];

        switch (operation.method) {
          case "GET":
            if (id) {
              // Get by ID
              switch (resource) {
                case "accounts":
                  result = moneyworksService.getAccountById(id);
                  break;
                case "transactions":
                  result = moneyworksService.getTransactionById(id);
                  break;
                case "names":
                  result = moneyworksService.getNameById(id);
                  break;
                case "products":
                  result = moneyworksService.getProductById(id);
                  break;
                default:
                  throw new Error(`Unknown resource: ${resource}`);
              }
            } else {
              // Get all
              const queryParams = { limit: 10, offset: 0 };
              switch (resource) {
                case "accounts":
                  result = moneyworksService.getAccounts(queryParams);
                  break;
                case "transactions":
                  result = moneyworksService.getTransactions(queryParams);
                  break;
                case "names":
                  result = moneyworksService.getNames(queryParams);
                  break;
                case "products":
                  result = moneyworksService.getProducts(queryParams);
                  break;
                default:
                  throw new Error(`Unknown resource: ${resource}`);
              }
            }
            break;

          case "POST":
            switch (resource) {
              case "accounts":
                result = moneyworksService.createAccount(operation.body);
                break;
              case "transactions":
                result = moneyworksService.createTransaction(operation.body);
                break;
              default:
                throw new Error(`Creating ${resource} is not implemented`);
            }
            break;

          case "PUT":
            if (!id) {
              throw new Error("ID is required for PUT operations");
            }
            switch (resource) {
              case "accounts":
                result = moneyworksService.updateAccount(id, operation.body);
                break;
              case "transactions":
                result = moneyworksService.updateTransaction(
                  id,
                  operation.body,
                );
                break;
              default:
                throw new Error(`Updating ${resource} is not implemented`);
            }
            break;

          case "DELETE":
            if (!id) {
              throw new Error("ID is required for DELETE operations");
            }
            switch (resource) {
              case "accounts":
                result = moneyworksService.deleteAccount(id);
                break;
              case "transactions":
                result = moneyworksService.deleteTransaction(id);
                break;
              default:
                throw new Error(`Deleting ${resource} is not implemented`);
            }
            break;

          default:
            throw new Error(`Unsupported method: ${operation.method}`);
        }

        results.push({
          status: "success",
          operation,
          result,
        });
      } catch (error) {
        results.push({
          status: "error",
          operation,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return { operations: results };
  },
};
