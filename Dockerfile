FROM nginx
COPY *.html /usr/share/nginx/html/
COPY *.ttf /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/
COPY sounds /usr/share/nginx/html/sounds