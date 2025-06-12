#!/bin/bash

echo "Testing MoneyWorks REST API with curl..."
echo

# Test version endpoint
echo "Test 1: Getting version..."
curl -i "http://localhost:6710/REST/Herman%20Geldenhuys:spoon.1024@GeldenTech/GeldenTech.moneyworks/version"
echo
echo

# Test list endpoint
echo "Test 2: Listing documents..."
curl -i "http://localhost:6710/REST/list"
echo
echo

# Test export with simpler auth
echo "Test 3: Export Names..."
curl -i "http://localhost:6710/REST/Herman%20Geldenhuys:spoon.1024@GeldenTech/GeldenTech.moneyworks/export?table=Name&format=json&limit=1"
echo