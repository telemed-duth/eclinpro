#DEVELOPMENT AND USE OF INTEGRATED E-CLINICAL PROTOCOLS. IMPACT ON CLINICAL EFFECTIVENESS
##ABSTRACT: 
Clinical effectiveness and the prevention of iatrogenic patient harm are among the most critical and thorny issues worldwide.

The aim of this proposal is to develop and introduce the systematic utilization of clinical protocols (CP), and prove their effectiveness in terms of improved morbidity, mortality and patient safety outcomes. Selected CPs will be developed and modified to the specific hospital environment of participating Clinical Departments. User-friendly software tools will be developed and an Electronic Clinical Database will be populated with selected surgical cancer disease groups (ie, cancer of: breast, colorectal, hepatobiliary and pancreas). Development of a web-based collaborative service and key performance indicators for data utilization for clinical and administrative purposes is also planned.

The proposed research focuses on the impact of systematic use of electronic CPs on clinical outcomes. The comparative analyses of data will demonstrate potential care improvements due to electronic CPs, compared to the traditional way of delivering care (without protocols) and the hand-written CPs. The data analysis will also include benchmarking to international clinical standards.

The project applies a variety of "lenses" to identify hazards in cancer surgical care and uses a mixed-methods, multi-center, cohort study design to provide the first comprehensive social-technical evaluation, of cancer care pathways in Greece which includes the role of patients in care coordination.

The expected results include the CPs for the selected disease groups and the Electronic Database with the purpose to expand it nationally to other disease groups. We will also develop a national "best clinical practices" network and affiliation with relevant international centers of excellence. Finally, an innovative, sustainable, web-based service to facilitate collaborative efforts for application, assessment and updating of relevant CPs will be developed.


##PROJECT INFO
* [Official library link](http://excellence.minedu.gov.gr/thales/en/thalesprojects/375876)
* Acronym: e-ClinPro
* Research Area: Biological and Medical Sciences
* Coordinating Institution: National and Kapodistrian University of Athens (UoA)
* Scientific Coordinator: Skalkidis Yannis
* Research Team 2 Leader: Gennatas Konstadinos
* Research Team 3 Leader: Pallikarakis Nicolas

##STATS
* I.D.: 731
* Mis: 375876
* Duration (months): 45
* Budget: 600.000 euro
* Diavgeia: ΑΔΑ: Β49Ι9-Α84

##Preview

[ ![Codeship Status for telemed-duth/eclinpro](https://codeship.com/projects/9cda4d60-6afc-0133-7b78-4e7d03b9bb62/status?branch=master)](https://codeship.com/projects/115059)
[![Build Status](https://travis-ci.org/telemed-duth/eclinpro.svg)](https://travis-ci.org/telemed-duth/eclinpro)
##
Live Application: [WEB PREVIEW](http://ecp.apps.nporto.com)

Code metrics: [CODE METRICS](http://ecp.apps.nporto.com:9999)


## Installation

### Dependencies

Installation depends on `node`/`npm` with `grunt` and `bower` installed globally.

    $ npm install -g bower grunt-cli


### The steps above: 

### Checkout the project:

    git clone https://github.com/telemed-duth/eclinpro.git

### Install the Node packages:

    npm install

### Allow execution of the scripts:

    sudo chmod +x dev.sh run.sh
    
### Run the development build (dev.sh) or the the production build (run.sh):

    ./dev.sh or ./run.sh
    


## Connect to a real database (memory db for default)

    MONGODB_URL="mongodb://localhost:27017"

This also works with the free hosted MongoDB instances at [compose.io](https://www.compose.io) and [mongolab.com](https://mongolab.com)!



## Unit Testing using Karma/Jasmine

    $ node_modules/.bin/karma start client/test/karma.conf.js

    INFO [karma]: Karma v0.12.31 server started at http://localhost:8080/
    INFO [launcher]: Starting browser PhantomJS
    INFO [PhantomJS 1.9.8 (Linux)]: Connected on socket aLJmRuSNUH2rPfpWgS3l with id 89641972
    PhantomJS 1.9.8 (Linux): Executed 1 of 1 SUCCESS (0.007 secs / 0.029 secs)
