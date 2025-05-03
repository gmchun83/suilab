#!/bin/bash

# Create docs directory if it doesn't exist
mkdir -p docs

# Move job analysis and product description
mv "1.Job Analysis Report Meme Coin.md" "docs/job_analysis.md"
mv "2.Product Description Meme Coin.md" "docs/product_description.md"
mv "3.Target Audience for Meme Coin Launch Platform on Sui Blockchain.md" "docs/target_audience.md"
mv "4.Meme Coin Launch Platform PRD.md" "docs/prd.md"
mv "5.App Flow Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/app_flow.md"
mv "6.SRS for Meme Coin Launch Platform on Sui Blockchain.md" "docs/srs.md"
mv "7.Backend Structure Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/backend_structure.md"
mv "8.Frontend Guidelines Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/frontend_guidelines.md"
mv "9.Tech Stack Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/tech_stack.md"
mv "10.Features Results Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/features.md"
mv "11.Project Rules Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/project_rules.md"
mv "12.Implementation Plan Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/implementation_plan.md"
mv "13.Work Breakdown Structure Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/wbs.md"
mv "14.Knowledge Graph for Meme Coin Launch Platform on Sui Blockchain.ttl" "docs/knowledge_graph.ttl"
mv "15.Task List Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/task_list.md"
mv "16.Tickets Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/tickets.md"
mv "17.Gantt Chart Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/gantt_chart.md"
mv "18.Directory Structure Document for Meme Coin Launch Platform on Sui Blockchain.md" "docs/directory_structure.md"
mv "19.AI Guide for Meme Coin Launch Platform.md" "docs/ai_guide.md"

# Copy the README.md to the root (keeping the original)
cp "20.README.md" "README.md"

echo "Documentation files organized successfully!"
