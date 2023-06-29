# Instructions 
For nonclinical usage update terms.js and change study types (used on Study Properties page under Define Study), to pick from SEND CT instead of SDTM.

   After change to this file, issue these commands to update the FrontEnd to deploy this change:
   
                cd OpenStudyBuilder-0.3
                
                pipenv --python 3.7
                
                docker compose build --no-cache frontend
                
                docker-compose up --force-recreate frontend
                
  For Study Population form change to ask instead for Species, Strain, Number of Males, Number of Females. Updated just for selection for species and strain, 
       still needs more work for proper saving. Involves these files:
       
       C:/OpenStudyBuilder-0.3/studybuilder/src/api/controlledTerminology/terms.js
       
       C:/OpenStudyBuilder-0.3/studybuilder/src/locales/en.json
       
       C:/OpenStudyBuilder-0.3/studybuilder/src/components/studies/StudyPopulationSummary.vue
       
       C:/OpenStudyBuilder-0.3/studybuilder/src/components/studies/StudyPopulationForm.vue
       
       C:/OpenStudyBuilder-0.3/studybuilder/src/store/modules/studies/general.js 

# License 
 
Be aware that the origin is using the GPLv3 license. See [third-party-licenses.md](./third-party-licenses.md) for more information. As the origin is GPLv3, my updates are also using GLPv3.
