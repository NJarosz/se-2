# 🏗 Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

<h1>RFID Supply Chain Tracking System</h1>

<h2>Overview</h2>
<p>
    This project is an RFID-based blockchahain supply chain tracking system that leverages secure, transparent tracking of product statuses across different nodes in the supply chain. This application aims to enhance product traceability by allowing users to view and update product information, including location, status, and origin details, through a decentralized network.
</p>

<h2>Table of Contents</h2>
<ul>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
</ul>

<h2 id="features">Features</h2>
<ul>
    <li><strong>RFID Integration</strong>: Utilizes RFID tags to capture product information as it moves across various nodes in the supply chain.</li>
    <li><strong>Blockchain Transparency</strong>: Leverages Ethereum smart contracts to log product states immutably on the blockchain.</li>
    <li><strong>Dynamic Status Tracking</strong>: Enables users to retrieve real-time product status, owner details, timestamps, and RFID hash identifiers.</li>
    <li><strong>WebSocket Support</strong>: Allows real-time updates for products using WebSocket connections.</li>
    <li><strong>UI/UX Design</strong>: Sleek and responsive UI built with Material-UI and Tailwind CSS.</li>
</ul>

<h2 id="tech-stack">Tech Stack</h2>
<ul>
    <li><strong>Frontend</strong>: Next.js, TypeScript, Tailwind CSS, Material-UI</li>
    <li><strong>Backend</strong>: Scaffold-ETH (Hardhat, Ethers.js), WebSocket</li>
    <li><strong>Blockchain</strong>: Ethereum (using Scaffold-ETH and Hardhat)</li>
    <li><strong>Hardware</strong>: Python, Raspberry Pi, RC522 for RFID scanning and communication</li>
</ul>

<h2 id="installation">Installation</h2>
<ol>
    <li><strong>Clone the repository</strong>:
        <pre><code>git clone https://github.com/NJarosz/se-2.git
cd se-2
git checkout rfid-supply-chain</code></pre>
    </li>
    <li><strong>Install dependencies</strong>:
        <pre><code>yarn install</code></pre>
    </li>
    <li><strong>Start Hardhat Blockchain</strong>: Run the local Ethereum testnet using Hardhat:
        <pre><code>yarn chain</code></pre>
    </li>
    <li><strong>Deploy Smart Contracts</strong>: Deploy the contracts to the local Hardhat network:
        <pre><code>yarn deploy</code></pre>
    </li>
    <li><strong>Start Frontend Server</strong>:
        <pre><code>yarn start</code></pre>
    </li>
    <li><strong>Start WebSocket Server</strong> (if applicable): Configure and run the WebSocket server to manage real-time RFID input. Choose port (default is 4000) and configure firewall to allow communication between Raspberry Pi and websocket server.  Ensure that it connects correctly to your RFID scanner hardware.
    </li>
</ol>

<h2 id="usage">Usage</h2>
<ol>
    <li><strong>Connecting RFID Scanner</strong>:
        <ul>
            <li>Connect your RFID scanner to the Raspberry Pi.</li>
            <li>Set up venv- import websocket, mfrc522, eth_utils, dotenv</li>
            <li>Set up .env file- include websockset server url and node id number</li>
            <li>The scanner sends product data to the frontend via WebSocket using scan.py or register.py scripts.</li>
        </ul>
    </li>
    <li><strong>Viewing Product Status</strong>:
        <ul>
            <li>On the homepage, enter a product ID in the input field.</li>
            <li>Submit to retrieve real-time information on the product's state, including:
                <ul>
                    <li>RFID hash</li>
                    <li>Status (Created, Shipped, etc.)</li>
                    <li>Origin and location details</li>
                    <li>Owner address</li>
                </ul>
            </li>
        </ul>
    </li>
    <li><strong>Updating Product Status</strong>:
        <ul>
            <li>Trigger RFID scans at different supply chain nodes to automatically update product status on the blockchain.</li>
        </ul>
    </li>
</ol>

<h2 id="project-structure">Project Structure</h2>
<pre>
<code>├── app/                       # Frontend Next.js Application
├── components/                # Reusable UI components
├── contracts/                 # Solidity smart contracts for blockchain
├── hooks/                     # Custom React hooks
├── public/                    # Static assets
├── scripts/                   # Deployment and testing scripts
├── utils/                     # Utility functions for data handling and validation
├── server/                    # WebSocket server setup for real-time updates
└── README.md                  # Project documentation</code>
</pre>

<h3>File Highlights</h3>
<ul>
    <li><strong>hooks/useWebSocket.ts</strong>: Manages WebSocket connections for real-time RFID updates.</li>
    <li><strong>components/ProductStatus.tsx</strong>: Component for displaying detailed product information.</li>
    <li><strong>contracts/StateTransition.sol</strong>: Smart contract managing product state transitions.</li>
    <li><strong>contracts/ProductRegistration.sol</strong>: Smart contract for registering new products on the blockchain.</li>
</ul>

<h2 id="contributing">Contributing</h2>
<p>Contributions are welcome! Please follow these steps to contribute:</p>
<ol>
    <li>Fork the repository.</li>
    <li>Create a new branch (<code>feature/your-feature-name</code>).</li>
    <li>Commit your changes.</li>
    <li>Push to the branch.</li>
    <li>Open a pull request.</li>
</ol>
<p>Please ensure your contributions align with the project’s code style and include relevant documentation for new features.</p>

<h2 id="license">License</h2>
<p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for more details.</p>

<h2>Contact</h2>
<p>For any questions or feedback, please feel free to reach out through the repository’s issue tracker.</p>

