import { Elysia, t } from 'elysia';
import { MessageService } from '../services/message.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';

// Initialize the message service with configuration
const config = loadMoneyWorksConfig();
const messageService = new MessageService(config);

export const messageRoutes = new Elysia({ prefix: '/api' })
  .get('/messages',
    async ({ query }) => {
      const { limit = 50, offset = 0, sort, order, search } = query;

      try {
        return await messageService.getMessages({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /messages:', error);
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
        summary: 'Get all messages',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/messages/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await messageService.getMessageBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /messages/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get message by sequence number',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/messages/by-user/:username',
    async ({ params }) => {
      try {
        return await messageService.getMessagesByUser(params.username);
      } catch (error) {
        console.error(`Error in GET /messages/by-user/${params.username}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        username: t.String()
      }),
      detail: {
        summary: 'Get messages by user',
        tags: ['MoneyWorks Data']
      }
    }
  );
