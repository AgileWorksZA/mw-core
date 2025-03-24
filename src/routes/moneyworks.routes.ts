import { Elysia, t } from 'elysia';
import { moneyworksService } from '../services/moneyworks.service';

export const moneyworksRoutes = new Elysia({ prefix: '/api' })
  .get('/accounts', 
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, filter } = query;
      return moneyworksService.getAccounts({ limit, offset, sort, order, filter });
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        sort: t.Optional(t.String()),
        order: t.Optional(t.String()),
        filter: t.Optional(t.String())
      }),
      detail: {
        summary: 'Get all accounts',
        tags: ['MoneyWorks']
      }
    }
  )
  .get('/accounts/:id', 
    async ({ params }) => {
      return moneyworksService.getAccountById(params.id);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get account by ID',
        tags: ['MoneyWorks']
      }
    }
  )
  .post('/accounts', 
    async ({ body }) => {
      return moneyworksService.createAccount(body);
    },
    {
      body: t.Object({
        Code: t.String({ maxLength: 8 }),
        Type: t.String({ maxLength: 1 }),
        Description: t.String({ maxLength: 64 }),
        TaxCode: t.Optional(t.String({ maxLength: 6 }))
      }),
      detail: {
        summary: 'Create a new account',
        tags: ['MoneyWorks']
      }
    }
  )
  .put('/accounts/:id', 
    async ({ params, body }) => {
      return moneyworksService.updateAccount(params.id, body);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        Description: t.Optional(t.String({ maxLength: 64 })),
        TaxCode: t.Optional(t.String({ maxLength: 6 }))
      }),
      detail: {
        summary: 'Update an account',
        tags: ['MoneyWorks']
      }
    }
  )
  .delete('/accounts/:id', 
    async ({ params }) => {
      return moneyworksService.deleteAccount(params.id);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Delete an account',
        tags: ['MoneyWorks']
      }
    }
  )
  
  // Transaction endpoints
  .get('/transactions', 
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, filter } = query;
      return moneyworksService.getTransactions({ limit, offset, sort, order, filter });
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        sort: t.Optional(t.String()),
        order: t.Optional(t.String()),
        filter: t.Optional(t.String())
      }),
      detail: {
        summary: 'Get all transactions',
        tags: ['MoneyWorks']
      }
    }
  )
  .get('/transactions/:id', 
    async ({ params }) => {
      return moneyworksService.getTransactionById(params.id);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get transaction by ID',
        tags: ['MoneyWorks']
      }
    }
  )
  .post('/transactions', 
    async ({ body }) => {
      return moneyworksService.createTransaction(body);
    },
    {
      body: t.Object({
        OurRef: t.Optional(t.String({ maxLength: 12 })),
        TransDate: t.String(),
        DueDate: t.Optional(t.String()),
        Type: t.String({ maxLength: 4 }),
        TheirRef: t.Optional(t.String({ maxLength: 32 })),
        NameCode: t.String({ maxLength: 12 }),
        Description: t.Optional(t.String({ maxLength: 1024 })),
        Gross: t.Number()
      }),
      detail: {
        summary: 'Create a new transaction',
        tags: ['MoneyWorks']
      }
    }
  )
  .put('/transactions/:id', 
    async ({ params, body }) => {
      return moneyworksService.updateTransaction(params.id, body);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        OurRef: t.Optional(t.String({ maxLength: 12 })),
        TransDate: t.Optional(t.String()),
        DueDate: t.Optional(t.String()),
        TheirRef: t.Optional(t.String({ maxLength: 32 })),
        Description: t.Optional(t.String({ maxLength: 1024 }))
      }),
      detail: {
        summary: 'Update a transaction',
        tags: ['MoneyWorks']
      }
    }
  )
  .delete('/transactions/:id', 
    async ({ params }) => {
      return moneyworksService.deleteTransaction(params.id);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Delete a transaction',
        tags: ['MoneyWorks']
      }
    }
  )
  
  // Names (customers/suppliers) endpoints
  .get('/names', 
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, filter } = query;
      return moneyworksService.getNames({ limit, offset, sort, order, filter });
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        sort: t.Optional(t.String()),
        order: t.Optional(t.String()),
        filter: t.Optional(t.String())
      }),
      detail: {
        summary: 'Get all names',
        tags: ['MoneyWorks']
      }
    }
  )
  .get('/names/:id', 
    async ({ params }) => {
      return moneyworksService.getNameById(params.id);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get name by ID',
        tags: ['MoneyWorks']
      }
    }
  )

  // Products endpoints
  .get('/products', 
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, filter } = query;
      return moneyworksService.getProducts({ limit, offset, sort, order, filter });
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        sort: t.Optional(t.String()),
        order: t.Optional(t.String()),
        filter: t.Optional(t.String())
      }),
      detail: {
        summary: 'Get all products',
        tags: ['MoneyWorks']
      }
    }
  )
  .get('/products/:id', 
    async ({ params }) => {
      return moneyworksService.getProductById(params.id);
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get product by ID',
        tags: ['MoneyWorks']
      }
    }
  )
  
  // Batch operations endpoint
  .post('/batch', 
    async ({ body }) => {
      return moneyworksService.processBatch(body.operations);
    },
    {
      body: t.Object({
        operations: t.Array(
          t.Object({
            method: t.Enum({ GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE' }),
            path: t.String(),
            body: t.Optional(t.Object({}))
          })
        )
      }),
      detail: {
        summary: 'Process batch operations',
        tags: ['MoneyWorks']
      }
    }
  );
