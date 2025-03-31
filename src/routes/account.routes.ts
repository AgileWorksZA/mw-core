import {Elysia, t} from 'elysia';
import {AccountService} from '../services/tables/account.service';
import {loadMoneyWorksConfig} from '../config/moneyworks.config';
import {AccountMany, AccountOne} from "../moneyworks/responses/Account";
import {AccountFields} from "../moneyworks/types/account";
import {accountZodKeys} from "../constants";


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
.get('/accounts/:by/:value',
  async ({params}) => {
    try {
      const by = params.by;
      const value = params.value;

      return await accountService.getAccountBy(by, value);
    } catch (error) {
      console.error(`Error in GET /accounts/${params.by}/${params.value}:`, error);
      throw error;
    }
  },
  {
    params: t.Object({
      by: t.String({enum: accountZodKeys}),
      value: t.String()
    }),
    detail: {
      summary: `Get account by field: ${AccountFields.join(', ')}`,
      tags: ['MoneyWorks Data']
    },
    response: AccountOne
  }
);
