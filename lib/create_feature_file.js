const axios = require('axios');
const fs = require('fs');


let create_feature_file = async function () {
  let file_names = await get_interview_list();
  let file_text = build_file_text( file_names );
  fs.writeFileSync( `load_each_interview.feature`, file_text );
};  // Ends create_feature_file()


let get_interview_list = async function () {
  /* Get a list of urls of interview that are on the server. See
  *    https://docassemble.org/docs/config.html#dispatch. Also, from some
  *    experimentation, this doesn't seem to error even when someone's
  *    playground is reloading the server. */

  let options = {
    method: 'GET',
    url: `https://apps-test.suffolklitlab.org/list?json=1`,
    timeout: 1 * 5000,
  };

  let response = await axios.request( options );

  let file_names = [];
  for ( let interview of response.data.interviews ) {
    file_names.push( `https://apps-test.suffolklitlab.org${ interview.link }` );
  }
  return file_names;
};  // Ends get_interview_list()


let build_file_text = function ( file_names ) {
  /* Create the tests with a Scenario for each interview to test. */
  let file_text = `Feature: load all interviews\n`

  for ( let name of file_names ) {
    file_text += `\nScenario: load ${ name }\n`;
    file_text += `  Given I start the interview at "${ name }"\n`;
  }
  return file_text;
};  // Ends build_file_text()


module.exports = create_feature_file;
