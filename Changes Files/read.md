For nonclinical usage update terms.js and change study types (used on Study Properties page under Define Study), to pick from SEND CT instead of SDTM.
   After change to this file, issue these commands to update the FrontEnd to deploy this change:
                cd OpenStudyBuilder-0.3
                pipenv --python 3.7
                docker compose build --no-cache frontend
                docker-compose up --force-recreate frontend
