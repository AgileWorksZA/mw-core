import {Elysia, t} from 'elysia';
import {AccountService} from '../services/account.service';
import {loadMoneyWorksConfig} from '../config/moneyworks.config';
import {AccountMany, AccountOne} from "../moneyworks/responses/Account";


// Initialize the account service with configuration
const config = loadMoneyWorksConfig();
const accountService = new AccountService(config);

export const accountRoutes = new Elysia({prefix: '/api'})
.get('/accounts',
  async ({query}) => {
    const {limit = 10, offset = 0, sort, order, search} = query;

    try {
      return await accountService.getAccounts({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as 'asc' | 'desc',
        search
      });
    } catch (error) {
      console.error('Error in GET /accounts:', error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(t.String())
    }),
    detail: {
      summary: 'Get all accounts',
      tags: ['MoneyWorks Data'],
    },
    response: AccountMany
  }
)
.get('/accounts/:code',
  async ({params}) => {
    try {
      const code = params.code;

      // Try to parse as number for sequence number lookup
      if (!isNaN(Number(code)) && !isNaN(parseFloat(code))) {
        return await accountService.getAccountBySequenceNumber(Number(code));
      }

      // Otherwise treat as code
      return await accountService.getAccountByCode(code);
    } catch (error) {
      console.error(`Error in GET /accounts/${params.code}:`, error);
      throw error;
    }
  },
  {
    params: t.Object({
      code: t.String()
    }),
    detail: {
      summary: 'Get account by code',
      tags: ['MoneyWorks Data']
    },
    response: AccountOne
  }
)
.get('/accounts/by-sequence/:sequence',
  async ({params}) => {
    try {
      const sequence = params.sequence;
      return await accountService.getAccountBySequenceNumber(sequence);
    } catch (error) {
      console.error(`Error in GET /accounts/${params.sequence}:`, error);
      throw error;
    }
  },
  {
    params: t.Object({
      sequence: t.Numeric()
    }),
    detail: {
      summary: 'Get account by sequence number',
      tags: ['MoneyWorks Data']
    },
    response: AccountOne
  }
);
