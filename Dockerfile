FROM node:18-alpine

WORKDIR /app

# Cache and Install dependencies
COPY package.json .

COPY yarn.lock .

RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]