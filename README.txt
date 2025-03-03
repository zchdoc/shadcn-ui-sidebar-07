rm -f -r .next node_modules

npm i && npm run dev

npm run format

npm run pre-deploy

npm run format && npm run pre-deploy

rm -f -r .next node_modules && npm i && npm run dev

rmdir /s /q .next && rmdir /s /q node_modules && npm install && npm run dev

rmdir /s /q .next：递归删除 .next 目录，并且不提示确认。
rmdir /s /q node_modules：递归删除 node_modules 目录，并且不提示确认。
npm install：安装项目依赖。
npm run dev：运行开发服务器。
