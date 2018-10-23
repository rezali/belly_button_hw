function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
      d3.json(`/metadata/${sample}`).then((data) => {
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");
    
        // Use `.html("") to clear any existing metadata
        PANEL.html("");
    
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(data).forEach(([key, value]) => {
          PANEL.append("h6").text(`${key}: ${value}`);
        });
    
        // BONUS: Build the Gauge Chart
        buildGauge(data.WFREQ);
      });
}

// function buildCharts includes two sub functions: one for the pie graph and one for the scatter chart
function buildCharts(sample) {

//print something to confirm the connection is good
console.log("Hello! The first sample in the drop down menu is:", sample);

// @TODO: Use `d3.json` to fetch the sample data for the plots
d3.json(`/samples/${sample}`).then(function(grabPieData) {

  //print something to confirm the function is connecting
  console.log("Hello! Does the following output look like function grabPieData is working?", grabPieData);

  //establish constant variables for the dataset. these will be used for the pie graph
  const pie_ids = grabPieData.otu_ids;
  const pie_labels = grabPieData.otu_labels;
  const pie_values = grabPieData.sample_values;

  //create a variable that contains an array of objects, use slice to pull out the top 10 values, and select "pie" for the type of graph 
  var pieChart = [
    {
      values: pie_values.slice(0,10),
      labels: pie_ids.slice(0, 10),
      type: "pie"
    }
  ]

  //use standard plotly commands to display the pie chart
  Plotly.plot("pie", pieChart);


// @TODO: Build a Bubble Chart using the sample data
//build the bubble chart within the same function as grabPieData
var bubbleChart = [
  {
    x: pie_ids,
    y: pie_values,
    text: pie_labels,
    mode: "markers",
    marker: {
      size: pie_values,
      color: pie_ids
    }
  }
]

var layout = {
  showlegend: false
};

//Use plotly commands to display the scatter chart
Plotly.plot("bubble", bubbleChart, layout);

//this closes out the function grabPieData
});


//this closes out the function buildCharts
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
