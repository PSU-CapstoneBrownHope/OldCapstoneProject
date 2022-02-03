# brf-capstone-app

This repository contains the source code for the Black Resilience Fund web app.

## required environment variables

This code expects a file .env containing the constants and other values that
should not be hardcoded into the program. Below is a list of values expected
in the file .env:

- AIRTABLE_API_KEY: API Key to AirTable Database
- BASE_ID: Base ID key to AirTable Base
- SALT: Desired salt number to use in hashing. Will be read as string and
  must be converted back to an int via Number()
- RESET_SUBJECT= String to use in subject of password reset email
- NOREPLY_EMAIL= Email address to be used in sending password reset messages
- NOREPLY_PASS= Password for above email
- RESET_SERVER= Point to frontend server (localhost / ip / site name)

## preparing airtable

Instructions on preparing production-level AirTable to collect data from the app:

https://docs.google.com/document/d/1XHoM6LTCGIJY2pglrU98gtD90O2Ep9KQyDCutbuXXbo/edit

## running the application

### ...as docker containers on an Ubuntu 20.04 GCP VM

- Required: download and install `docker-engine` then `docker-compose`.
  https://docs.docker.com/engine/install/ubuntu/

  https://docs.docker.com/compose/install/

- `git clone` this repo
- Obtain environment variables & store them in `~/brf-capstone-app/back/.env`
- Set`server` in `front/src/util/config.ts` to the external IP of your GCP VM.
- `~/brf-capstone-app$ sudo docker-compose up --build`

The site should be served on `http://{your_external_IP_you_entered}/`

### ...as a node app

- The app may also be run as a `node` app without using `docker`. If doing local dev, this is the preferred method.
- Required: download and install `node` & `npm`.
- `git clone` this repo.
- Obtain environment variables & store them in `~/brf-capstone-app/back/.env`
- Set`server` in `front/src/util/config.ts` to `localhost:8080`
- after completing the above, open two terminals, and get the backend & frontend running using the below commands

#### nginx config

- Skip this step if you aren't running the app on GCP and just want to do local dev.
- In your first terminal on your GCP vm:
- `cd /etc/nginx/sites-available`
- `vim defualt`
- paste in the contents of nginx_sample.txt
- change the server IP to your current GCP external IP
- `sudo systemctl restart nginx`

#### backend

- In your first terminal:
- `~/brf-capstone-app/back$ npm install`
- `~/brf-capstone-app/back$ npm start`

#### frontend

- In your second terminal:
- `~/brf-capstone-app/front$ npm install`
- `~/brf-capstone-app/front$ npm start`

The site should be served on `http://localhost:3000/` (if doing local dev) or `http://{your_external_IP_you_entered}/` (if running on GCP VM and you completed the nginx step).
