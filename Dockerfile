FROM nginx:alpine

COPY ["New Website/", "/usr/share/nginx/html/"]

EXPOSE 80
