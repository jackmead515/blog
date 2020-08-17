rm -rf ./server/src/build/*
mkdir ./server/src/build/client
mkdir ./server/src/build/sat-tester
mkdir ./server/src/build/cap-sensor-vis
mkdir ./server/src/build/d3-graphs
mkdir ./server/src/build/covid-vis
mkdir ./server/src/build/widgeter

cd client
npm run build > /dev/null || { echo 'Client Build Failed'; exit 1; }
echo 'Client Build Complete'
cd ..

cd plugins/sat-tester
npm run build > /dev/null || { echo 'SAT Tester Build Failed'; exit 1; }
echo 'SAT Tester Build Complete'
cd ..

cd cap-sensor-vis
npm run build > /dev/null || { echo 'Cap Sensor Vis Build Failed'; exit 1; }
echo 'Cap Sensor Vis Build Complete'
cd ..

cd d3-graphs
npm run build > /dev/null || { echo 'D3 Graphs Build Failed'; exit 1; }
echo 'D3 Graphs Build Complete'
cd ..

cd covid-vis
npm run build > /dev/null || { echo 'COVID-VIS Build Failed'; exit 1; }
echo 'COVID-VIS Build Complete'
cd ..

cd widgeter
npm run build > /dev/null || { echo 'Widgeter Build Failed'; exit 1; }
echo 'Widgeter Build Complete'
cd ..
cd ..

cp -r client/build/* server/src/build/client
cp -r plugins/sat-tester/build/* server/src/build/sat-tester
cp -r plugins/cap-sensor-vis/build/* server/src/build/cap-sensor-vis
cp -r plugins/d3-graphs/build/* server/src/build/d3-graphs
cp -r plugins/covid-vis/build/* server/src/build/covid-vis
cp -r plugins/widgeter/build/* server/src/build/widgeter

cd server/util
echo "Creating Tags List"
node tags.js
echo "Creating Related Index"
node related.js
echo "Creating Sitemap.xml"
node sitemap.js
echo "Converting Markdown to HTML"
node markdown.js

cd ..

ls -sh src/resources

cd ..

