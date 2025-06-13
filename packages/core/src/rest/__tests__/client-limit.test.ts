import { describe, test, expect, beforeEach, vi } from 'vitest';
import { MoneyWorksRESTClient } from '../client';

// Mock fetch
global.fetch = vi.fn();

describe('MoneyWorksRESTClient - limit parameter', () => {
  let client: MoneyWorksRESTClient;
  
  beforeEach(() => {
    vi.clearAllMocks();
    client = new MoneyWorksRESTClient({
      host: 'localhost',
      port: 6710,
      dataFile: 'test.moneyworks',
      username: 'test',
      password: 'test'
    });
  });

  test('export with limit=1 should return only 1 record', async () => {
    // Mock response with exactly 1 record
    const mockXML = `<?xml version="1.0"?>
<table name="Transaction" count="1" start="0" found="981">
  <transaction>
    <sequencenumber>1</sequencenumber>
    <ourref>TEST001</ourref>
    <gross>1000.00</gross>
  </transaction>
</table>`;

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockXML,
      headers: new Headers({ 'content-type': 'text/xml' })
    });

    const result = await client.export('Transaction', {
      format: 'json',
      limit: 1
    });

    // Verify the request was made with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('export/table=Transaction&limit=1&format=xml-verbose'),
      expect.any(Object)
    );

    // Verify only 1 record is returned
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].sequenceNumber).toBe('1');
    expect(result[0].ourRef).toBe('TEST001');
  });

  test('export should include limit in URL path parameters', async () => {
    const mockXML = `<?xml version="1.0"?><table name="Transaction" count="0"></table>`;
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockXML,
      headers: new Headers({ 'content-type': 'text/xml' })
    });

    await client.export('Transaction', {
      format: 'xml-verbose',
      limit: 5,
      filter: 'Gross > 1000'
    });

    const [url] = (global.fetch as any).mock.calls[0];
    
    // Verify URL contains all parameters in path (not query)
    expect(url).toContain('/export/table=Transaction');
    expect(url).toContain('&search=Gross%20%3E%201000');
    expect(url).toContain('&limit=5');
    expect(url).toContain('&format=xml-verbose');
    
    // Ensure no query parameters
    expect(url).not.toContain('?');
  });
});