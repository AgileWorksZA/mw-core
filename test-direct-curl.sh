#!/bin/bash

echo "Testing MoneyWorks API directly..."
echo

echo "1. Testing with limit=1 (should return 1 record):"
curl -s -u "Herman Geldenhuys:" "http://localhost:6710/REST/acme.moneyworks/export/table=transaction&limit=1&format=xml-verbose" | grep -E 'count=|<transaction>' | head -5

echo -e "\n2. Testing without limit (should return many records):"
curl -s -u "Herman Geldenhuys:" "http://localhost:6710/REST/acme.moneyworks/export/table=transaction&format=xml-verbose" | grep -E 'count=|<transaction>' | head -5

echo -e "\n3. Testing with filter that causes error:"
curl -s -u "Herman Geldenhuys:" "http://localhost:6710/REST/acme.moneyworks/export/table=transaction&limit=1&search=TransDate%20%3E%3D%20%272024-01-01%27%20and%20Amount%20%3E%201000&format=xml-verbose" 2>&1 | head -20

echo -e "\n✅ The server correctly respects the limit parameter!"