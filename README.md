# RPLA_backend Project Final 

## To Install Locally

1. Make a file named .env in root folder and insert these lines :
DATABASE_URL=mongodb+srv://RPLA:rplauser@cluster0.5gbd1.mongodb.net/authDB?retryWrites=true&w=majority&appName=Cluster0

using generate random crypto token command from node to create SECRET key for jwt authenticaton
to generate random token for jwt = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" #
#### Example
SECRET=9313d6a2b96adb86001c6adcfa18cbe6ca2a110d5e14a5d47a255e7f24ff49d0 (also insert this line into the .env file)

2. Run `npm install`.
3. Run `node index.js`