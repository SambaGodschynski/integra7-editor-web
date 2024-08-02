FROM node:20
WORKDIR /home/public
COPY css ./css/
COPY html_develop ./html_develop/
COPY img ./img/
COPY js ./js/
COPY manual ./manual/
COPY *.html ./
COPY *.js ./
COPY cert.pem ./
COPY key.pem ./
EXPOSE 8080
RUN npm install -g http-serve
ENTRYPOINT ["http-serve", ".", "-S", "-C", "cert.pem"]
