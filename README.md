RFID Supply Chain Tracking System
Overview
This project is an RFID-based supply chain tracking system that leverages blockchain technology (using Ethereum) for secure, transparent tracking of product statuses across different nodes in the supply chain. This application aims to enhance product traceability by allowing users to view and update product information, including location, status, and origin details, through a decentralized network.

Table of Contents
Features
Tech Stack
Installation
Usage
Project Structure
Contributing
License
Features
RFID Integration: Utilizes RFID tags to capture product information as it moves across various nodes in the supply chain.
Blockchain Transparency: Leverages Ethereum smart contracts to log product states immutably on the blockchain.
Dynamic Status Tracking: Enables users to retrieve real-time product status, owner details, timestamps, and RFID hash identifiers.
WebSocket Support: Allows real-time updates for products using WebSocket connections.
UI/UX Design: Sleek and responsive UI built with Material-UI and Tailwind CSS.
Tech Stack
Frontend: Next.js, TypeScript, Tailwind CSS, Material-UI
Backend: Scaffold-ETH (Hardhat, Ethers.js), WebSocket
Blockchain: Ethereum (using Scaffold-ETH and Hardhat)
Hardware: Raspberry Pi for RFID scanning and communication
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/rfid-supply-chain.git
cd rfid-supply-chain
Install dependencies:

bash
Copy code
# For the main application
yarn install
Start Hardhat Blockchain: Run the local Ethereum testnet using Hardhat:

bash
Copy code
yarn chain
Deploy Smart Contracts: Deploy the contracts to the local Hardhat network:

bash
Copy code
yarn deploy
Start Frontend Server:

bash
Copy code
yarn start
Start WebSocket Server (if applicable): Configure and run the WebSocket server to manage real-time RFID input. Ensure that it connects correctly to your RFID scanner hardware.

Usage
Connecting RFID Scanner:

Connect your RFID scanner to the Raspberry Pi.
The scanner sends product data to the frontend via WebSocket.
Viewing Product Status:

On the homepage, enter a product ID in the input field.
Submit to retrieve real-time information on the product's state, including:
RFID hash
Status (Created, Shipped, etc.)
Origin and location details
Owner address
Updating Product Status:

Trigger RFID scans at different supply chain nodes to automatically update product status on the blockchain.
Project Structure

hardhat
├── contracts/                 # Solidity smart contracts
├── deploy/                    # Typescript scripts for deployment
├── deployments/               # Contract ABI's
├── scripts/                   # Utility scripts for accounts
├── test/                      # Testing scripts
nextjs 
├── app/                       # Frontend Next.js Application
├── components/                # Reusable UI components
├── contracts/                 # Deployed Solidity smart contracts APIS
├── hooks/                     # Custom React hooks
├── public/                    # Static assets
├── utils/                     # Utility functions for data handling and validation
├── websocket-server.ts        # WebSocket server setup for real-time updates
python
├── register.py                # Run on Raspberry Pi to register a new RFID tagged product and send to nextjs App
├── scan.py                    # Run on RPi to scan an RFID tagged product and send data to nextjs App
└── README.md                  # Project documentation


File Highlights
hooks/useWebSocket.ts: Manages WebSocket connections for real-time RFID updates.
components/ProductStatus.tsx: Component for displaying detailed product information.
contracts/StateTransition.sol: Smart contract managing product state transitions.
contracts/ProductRegistration.sol: Smart contract for registering new products on the blockchain.
Contributing
Contributions are welcome! Please follow these steps to contribute:

Fork the repository.
Create a new branch (feature/your-feature-name).
Commit your changes.
Push to the branch.
Open a pull request.
Please ensure your contributions align with the project’s code style and include relevant documentation for new features.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Contact
For any questions or feedback, please feel free to reach out through the repository’s issue tracker.

