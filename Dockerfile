FROM nginx
COPY !mydir/dist/ /usr/share/nginx/html/
