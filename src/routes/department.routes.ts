import { Elysia, t } from 'elysia';
import { DepartmentService } from '../services/department.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { DepartmentMany, DepartmentOne } from "../moneyworks/responses/Department";

// Initialize the department service with configuration
const config = loadMoneyWorksConfig();
const departmentService = new DepartmentService(config);

export const departmentRoutes = new Elysia({ prefix: '/api' })
  .get('/departments',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await departmentService.getDepartments({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /departments:', error);
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
        summary: 'Get all departments',
        tags: ['MoneyWorks Data']
      },
      response: DepartmentMany
    }
  )
  .get('/departments/:code',
    async ({ params }) => {
      try {
        const code = params.code;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(code)) && !isNaN(parseFloat(code))) {
          return await departmentService.getDepartmentBySequenceNumber(Number(code));
        }

        // Otherwise treat as code
        return await departmentService.getDepartmentByCode(code);
      } catch (error) {
        console.error(`Error in GET /departments/${params.code}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        code: t.String()
      }),
      detail: {
        summary: 'Get department by code',
        tags: ['MoneyWorks Data']
      },
      response: DepartmentOne
    }
  )
  .get('/departments/by-sequence/:sequence',
    async ({ params }) => {
      try {
        const sequence = params.sequence;
        return await departmentService.getDepartmentBySequenceNumber(sequence);
      } catch (error) {
        console.error(`Error in GET /departments/${params.sequence}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequence: t.Numeric()
      }),
      detail: {
        summary: 'Get department by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: DepartmentOne
    }
  );
