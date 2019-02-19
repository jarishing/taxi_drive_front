FROM node:latest

# Create an app user so our program doesn't run as root.
RUN mkdir -p /home/app &&\
    groupadd -r app &&\
    useradd -r -g app -d /home/app -s /sbin/nologin -c "Docker image user" app
WORKDIR /home/app
# Create app directory
RUN mkdir -p ./app
WORKDIR ./app
# Copy package.json
COPY ./src/package-production.json ./package.json
# Chown the folder and the previous copy file to the app user
RUN chown -R app:app /home/app
# Change to normal user account and install node package
RUN npm install

# COPY the file to temp folder
RUN mkdir -p /home/app/temp
COPY ./src /home/app/temp
# COPY the files back to app foler running as user account then delete the temp
RUN cp -R /home/app/temp/* /home/app/app
# Remove the temp folder cerate by root account
RUN rm -R /home/app/temp