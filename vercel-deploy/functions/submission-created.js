// This function runs when a form is submitted on Netlify
exports.handler = async function(event, context) {
  const { payload } = JSON.parse(event.body);
  
  console.log('Form submission received!');
  console.log('Form data:', payload);
  
  // You could add additional processing here, such as:
  // - Sending an email notification
  // - Storing the data in a database
  // - Integrating with a CRM
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Form submission received" })
  };
};
