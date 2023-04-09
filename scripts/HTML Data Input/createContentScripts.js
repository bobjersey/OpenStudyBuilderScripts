let api_base_url = 'http://localhost:5003/'

// makes a API GET request
function httpURLGet(path) {
  var url = api_base_url + path;
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.open('GET', url, false)
  xmlHttp.send(null)
  return xmlHttp.responseText
}

// makes a API POST request
function httpURLPost(path, data) {
  var url = api_base_url + path;
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.open('POST', url, false)
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.send(JSON.stringify(data))
  return xmlHttp.responseText
}

// writes text into HTML page
function writeTextToContainer(text){
  var container = document.getElementById('resultContainer');
  container.innerHTML = text;
}

// writes multiple texts into HTML page separated by breaks
function writeObjectToContainer(object, loopBy = null){
  var container = document.getElementById('resultContainer');
  if (loopBy == null){
    container.innerHTML = object.map(item => {
      return JSON.stringify(item) + "<br/><br/>"
    })
  } else {
    container.innerHTML = object[loopBy].map(item => {
      return JSON.stringify(item) + "<br/><br/>"
    })
  }
}

// Get all the clinical programs and print result
function getClinicalProgram() {
  console.log('Clinical Programs available:')
  let programs = JSON.parse(httpURLGet("clinical-programmes"))
  writeObjectToContainer(programs);
  console.log(programs);
}

// Get all the projects and print result
function getProjects() {
  console.log('Projecs available:')
  let projects = JSON.parse(httpURLGet("projects"))
  writeObjectToContainer(projects);
  console.log(projects);
}

// Get all the studies and print result
function getStudies() {
  console.log('Studies available:')
  let studies = JSON.parse(httpURLGet("studies"))
  console.log(studies);
  writeObjectToContainer(studies, "items");
}
// Get all the activity groups and print result
function getActivities() {
  console.log('Activity groups available:')
  let activities = JSON.parse(httpURLGet("concepts/activities/activity-groups"))
  console.log(activities);
  writeObjectToContainer(activities, "items");
}
// Get all the activity groups and print result
function getSubactivities() {
  console.log('Subactivity groups available:')
  let subactivities = JSON.parse(httpURLGet("concepts/activities/activity-sub-groups"))
  console.log(subactivities);
  writeObjectToContainer(subactivities, "items");
}
// Create a new clinical program and print result (if provided and not already existing)
function createClinicalProgram() {
  writeTextToContainer("");
  console.log('Create clinical program:')
  value = document.getElementById('01_clinicalProgramInput').value;
  // if no name is provided, then do not create anything
  if (value == null || value == ""){
    writeTextToContainer("The input for Clinical Program is not provided and for this cannot be created.");
  } else {
    // check that this is not already available
    let programs = JSON.parse(httpURLGet("clinical-programmes"))
    let isAlreadIn = programs.reduce((accum, item) => accum || item.name == value, false)
    if (isAlreadIn){
      writeTextToContainer("The clinical programme is already available.");
    } else {
      content = {"name" : value}
      let response = httpURLPost("clinical-programmes", content)
      writeTextToContainer(response);
      console.log(JSON.parse(response));
    }
  }
}

// Create a new project and print result (if provided and not already existing)
function createProject() {
  writeTextToContainer("");
  console.log('Create project:')
  progUid = document.getElementById('02_clinical_programme_uid').value;
  projNo = document.getElementById('02_project_number').value;
  progName = document.getElementById('02_name').value;
  progDesc = document.getElementById('02_description').value;

  // if no name is provided, then do not create anything
  if (progUid == "" || projNo == "" || progName == "" || progDesc == ""){
    writeTextToContainer("The inputs for Project are not all provided and for this cannot be created.");
  } else {
    // check that this is not already available
    let programs = JSON.parse(httpURLGet("projects"))
    let isAlreadIn = programs.reduce((accum, item) => accum || item.name == progName, false)
    if (isAlreadIn){
      writeTextToContainer("The project is already available.");
    } else {      
      content = {
        "project_number": projNo,
        "name": progName,
        "description": progDesc,
        "clinical_programme_uid": progUid
      }
      let response = httpURLPost("projects", content)
      writeTextToContainer(response);
      console.log(JSON.parse(response));
    }
  }
}

// Create a new activty group and print result (if provided and not already existing)
function createActivity() {
  writeTextToContainer("");
  console.log('Create activity group:')
  aName = document.getElementById('04_name').value;
  aName_sentence_case = document.getElementById('04_name_sentence_case').value;
  aDefinition = document.getElementById('04_definition').value;
  aAbbreviation = document.getElementById('04_abbreviation').value;  

  // if no name is provided, then do not create anything
  if (aName == "" || aName_sentence_case == "" || aDefinition == "" || aAbbreviation == ""){
    writeTextToContainer("The inputs for Activity group are not all provided and for this cannot be created.");
  } else {
    // check that this is not already available
    let activities = JSON.parse(httpURLGet("concepts/activities/activity-groups"))
    let isAlreadIn = activities.items.some((item) => { return item.name === aName;});
	
    if (isAlreadIn){
      writeTextToContainer("The activity group is already available.");
    } else {      
      content = {
		"name" : aName,
		"name_sentence_case" : aName_sentence_case,
		"definition" : aDefinition,
		"abbreviation" : aAbbreviation,
		"library_name" : "Sponsor"
      }
      let response = httpURLPost("concepts/activities/activity-groups", content)
      writeTextToContainer(response);
      console.log(JSON.parse(response));
	  // now approve it too!
	  let newActivity = JSON.parse(response)
      let response2 = httpURLPost("concepts/activities/activity-groups/"+newActivity.uid+"/approvals", content)
      writeTextToContainer(response2);
      console.log(JSON.parse(response2));
    }
  }
}

// Create a new sub activty group and print result (if provided and not already existing)
function createSubactivity() {
  writeTextToContainer("");
  console.log('Create activity sub group:')
  aName = document.getElementById('05_name').value;
  aName_sentence_case = document.getElementById('05_name_sentence_case').value;
  aDefinition = document.getElementById('05_definition').value;
  aAbbreviation = document.getElementById('05_abbreviation').value;  
  aGroup = document.getElementById('05_activity_group').value;  

  // if no name is provided, then do not create anything
  if (aName == "" || aName_sentence_case == "" || aDefinition == "" || aAbbreviation == ""||  aGroup == ""){
    writeTextToContainer("The inputs for Activity sub group are not all provided and for this cannot be created.");
  } else {
    // check that this is not already available
    let activities = JSON.parse(httpURLGet("concepts/activities/activity-sub-groups"))
    let isAlreadIn = activities.items.some((item) => { return item.name === aName;});
    if (isAlreadIn){
      writeTextToContainer("The activity sub group is already available.");
    } else {      
      content = {
		"name" : aName,
		"name_sentence_case" : aName_sentence_case,
		"definition" : aDefinition,
		"abbreviation" : aAbbreviation,
		"library_name" : "Sponsor",
		"activity_group" : aGroup
      }
      let response = httpURLPost("concepts/activities/activity-sub-groups", content)
      writeTextToContainer(response);
      console.log(JSON.parse(response));
	  // now approve it too!
	  let newActivity = JSON.parse(response)
      let response2 = httpURLPost("concepts/activities/activity-sub-groups/"+newActivity.uid+"/approvals", content)
      writeTextToContainer(response2);
      console.log(JSON.parse(response2));
    }
  }
}
