FROM node:22

WORKDIR /srv/app

# Install nodemon globally (system level)
RUN npm install -g nodemon

# Copy only package files to leverage Docker cache
COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

USER node

EXPOSE 3000 9229

ENV NODE_ENV=development

# Start script from package.json (name: 'dev')
CMD ["npm", "run", "dev"]