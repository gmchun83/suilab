#!/bin/bash

# Build the Move package
sui move build

# Publish the package
sui client publish --gas-budget 100000000
