import { Elysia, t } from 'elysia';
import { LogService } from '../services/tables/log.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { LogMany, LogOne } from "../moneyworks/responses/Log";

// Initialize the log service with configuration
const config = loadMoneyWorksConfig();
const logService = new LogService(config);

export const logRoutes = new Elysia({ prefix: '/api' })
  .get('/logs',
    async ({ query }) => {
      const { limit = 50, offset = 0, sort, order, search } = query;

      try {
        return await logService.getLogs({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /logs:', error);
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
        summary: 'Get all log entries',
        tags: ['MoneyWorks Data']
      },
      response: LogMany
    }
  )
  .get('/logs/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await logService.getLogBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /logs/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get log entry by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: LogOne
    }
  )
  .get('/logs/by-user/:username',
    async ({ params }) => {
      try {
        return await logService.getLogsByUser(params.username);
      } catch (error) {
        console.error(`Error in GET /logs/by-user/${params.username}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        username: t.String()
      }),
      detail: {
        summary: 'Get log entries by user',
        tags: ['MoneyWorks Data']
      },
      response: LogMany
    }
  );
