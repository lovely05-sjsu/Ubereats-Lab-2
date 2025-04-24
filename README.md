1. Install packages in backend and frontend folders by running npm install
2. Run backend by executing node index.js. You should see 'Server running on port 2000'
3. Run frontend by executing npm start. 
4. Sync database and models by GET http://localhost:2000/sync on backend api. You should see 'Tables synced successfully!'
5. Verify table entries by checking in MySQL Workbench
6. If any issue, drop all tables and run GET http://localhost:2000/sync
7. If no records still exist in DB, run Insert.sql command from SQL folder
8. On Front end UI, click Save Address to save address
9. Click on login and enter login credentials. See 