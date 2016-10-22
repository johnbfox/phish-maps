# Phish Maps
This project is an attempt to visualize the jam rock band Phish's shows in a map
of the united states.

## Data
The data used for this project was scraped from the [I'm an inline-style link with title]
(https://www.phish.net) via python scripts. Once the data collected a NodeJs API with
express was built to perform the data accumulation logic. As per their api terms of use,
that process will remain undisclosed.

## Maps

This project is powered by google geocharts, which turns out to be a very powerful and
easy to use tool for displaying geographic data on a chart.  The real challenge here
was creating a gradient scale across the data to convey an effective heatmap.  After
finding a color palette that best conveyed the data, I chose the gradient midpoint to
be the average of shows, since the data is mostly skewed towards the lower end of the
data range.
