# Use an node:14 image from DockerHub as a parent image
FROM python:3.7.14-alpine

# Set the working directory
WORKDIR /kartinflix-ui

# Copy required files to the image
COPY index.html .
COPY python-server.sh .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run npm start command when the container launches
CMD ["sh", "python-server.sh"]