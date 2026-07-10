FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5173
# Ajustando a porta default do nginx para 5173 para bater com o docker-compose, 
# ou rodando dev server se for pra desenvolvimento. 
# Como o compose não monta volume e expõe 5173, é melhor rodarmos o vite dev no docker-compose para dev, ou expor no nginx.
# Vamos expor no nginx customizado.
RUN sed -i 's/listen  *80;/listen 5173;/g' /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
