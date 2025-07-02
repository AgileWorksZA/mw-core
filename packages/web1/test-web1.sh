#!/bin/bash
cd /Users/hgeldenhuys/WebstormProjects/mw-core/packages/web1

echo "Installing dependencies..."
bun install

echo -e "\nStarting web1..."
bun dev