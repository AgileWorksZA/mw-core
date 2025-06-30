#!/bin/bash

echo "Testing Company Endpoint"
echo "========================"

echo -e "\n1. Testing /api/v1/company"
curl -s http://localhost:3000/api/v1/company | python3 -m json.tool

echo -e "\n\n2. Testing /api/v1/company/fields"
curl -s http://localhost:3000/api/v1/company/fields | python3 -m json.tool

echo -e "\n\n3. Testing /api/v1/company with specific fields"
curl -s "http://localhost:3000/api/v1/company?fields[]=Name&fields[]=BaseCurrency&fields[]=Version" | python3 -m json.tool

echo -e "\n\n4. Testing /api/v1/company with flat format"
curl -s "http://localhost:3000/api/v1/company?format=flat" | python3 -m json.tool