const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

function init(){ 

// This function is called when a dropdown menu item is selected
    d3.json(url).then(function(data){

        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");   
        let names = data.names;
        names.forEach(function(id){
            dropdownMenu.append("option").text(id).property("value");
        });
         
        chartvalues(names[0]);
        metadata(names[0]);
    });
};

function optionChanged(cases) {

    chartvalues(cases);
    metadata(cases);
};

function chartvalues(cases){
    
    d3.json(url).then(function(data){
        let samples = data.samples;
        let id = samples.filter(take=>take.id == cases);

        let sample_values = id[0].sample_values; 
        let otu_ids = id[0].otu_ids; 
        let otu_labels = id[0].otu_labels; 

       
        charts(sample_values, otu_ids, otu_labels);

    });
};

function charts(sample_values, otu_ids, otu_labels){

 
    d3.json(url).then(function(data){
                
        // data for bar chart
        let bar_data = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels,
            orientation: 'h'
        }];

        // data for bubble chart
        let bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker:{
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        }];
    
        // layout for bar chart
        let bar_layout = {
            //title: 'Top 10 Belly Button Bacteria',
            height: 500,
            width: 400            
        };    

        // layout for bubble chart
        let bubble_layout = {
            height: 550,
            width: 1000 
        };

        // display bar chart
        Plotly.newPlot('bar', bar_data, bar_layout);

        // display bubble chart
        Plotly.newPlot('bubble', bubble_data, bubble_layout);

    });
};

function metadata(cases){

  
    d3.json(url).then(function(data){
        let samples = data.metadata;
        let id = samples.filter(take=>take.id == cases);
        let sample_metadata = d3.select('#sample-metadata').html('');

        Object.entries(id[0]).forEach(([key, value]) => {
            sample_metadata.append("h5").text(`${key}: ${value}`);
        });
    });
};
init();