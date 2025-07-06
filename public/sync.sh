cd huhaoo.github.io
git pull
npm install
npm run build
rm -r /var/www/huhao && cp dist /var/www/huhao -r
cd ~

conda activate backend && cd backend
git pull
pip install -r requirements.txt
nohup python app.py > app.log 2>&1 &
cd ~