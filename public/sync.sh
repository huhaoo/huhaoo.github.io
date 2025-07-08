cd huhaoo.github.io
git pull
npm install
npm run build
rm -r /var/www/huhao && cp dist /var/www/huhao -r
cd ~

conda activate backend && cd backend
git pull
pip install -r requirements.txt
killall python
nohup python -m gunicorn -w 2 --threads 4 -b 127.0.0.1:5000 app:app > app.log 2>&1 &
cd ~