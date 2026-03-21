FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY favicon.ico /usr/share/nginx/html/
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
