rm -f -r .next node_modules

npm i && npm run dev

npm run format

npm run pre-deploy

npm run format && npm run pre-deploy

rm -f -r .next node_modules && npm i && npm run dev
