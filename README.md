[![Tests](https://github.com/USEPA/ckanext-plotly/workflows/Tests/badge.svg?branch=main)](https://github.com/USEPA/ckanext-plotly/actions)

# ckanext-plotly

CKAN Chart viewer / builder built around [plotly.js](https://plotly.com/javascript/) and the Plotly [react-chart-editor](https://github.com/plotly/react-chart-editor)


## Requirements

Compatibility with core CKAN versions:

| CKAN version    | Compatible?   |
| --------------- | ------------- |
| 2.7 and earlier | no            |
| 2.8             | not tested    |
| 2.9             | yes           |


## Installation

   For example installing any non-Python dependencies or adding any required
   config settings.

To install ckanext-plotly:

1. Activate your CKAN virtual environment, for example:

     . /usr/lib/ckan/default/bin/activate

2. Clone the source and install it on the virtualenv

    git clone https://github.com/USEPA/ckanext-plotly.git
    cd ckanext-plotly
    pip install -e .
	pip install -r requirements.txt

3. Add `plotly` and/or `plotly_explorer` to the `ckan.plugins` setting in your CKAN
   config file (by default the config file is located at `/etc/ckan/default/ckan.ini`).

4. Restart CKAN


## Config settings

None at present


## Developer installation

To install ckanext-plotly for development, activate your CKAN virtualenv and
do:

    git clone https://github.com/USEPA/ckanext-plotly.git
    cd ckanext-plotly
    python setup.py develop
    pip install -r dev-requirements.txt


## Rebuilding the editor/explorer

The editor/explorer is built off of [react-chart-editor](https://github.com/plotly/react-chart-editor). At present this
being react based application necessitates some effort to export for use as a CKAN javascript asset. To accomplish this 
the following manual process is has been employed. A customized build process would be a great addition!

1. Build the editor interface via npm:

       cd ckanext-plotly/editor_app/src
       npm run build
   
2. Copy the built js and css bundles over to the CKAN location 

       cp ../build/static/css/main*.css ../../ckanext/plotly/public/plotly_edit_app.css
       cp ../build/static/css/main*.css.map ../../ckanext/plotly/public/plotly_edit_app.css.map
       cp ../build/static/js/main*.js ../../ckanext/plotly/public/plotly_edit_app.js
       cp ../build/static/js/main*.js.map ../../ckanext/plotly/public/plotly_edit_app.js.map

3. Edit the source map in the final line in plotly_edit_app.css and plotly_edit_app.js.map to point to the appropriate map file


## Tests

To run the tests, do:

    pytest --ckan-ini=test.ini ckanext


## Disclaimer

The United States Environmental Protection Agency (EPA) GitHub project code is provided on an "as is" basis
and the user assumes responsibility for its use.  EPA has relinquished control of the information and no longer
has responsibility to protect the integrity , confidentiality, or availability of the information.  Any
reference to specific commercial products, processes, or services by service mark, trademark, manufacturer,
or otherwise, does not constitute or imply their endorsement, recommendation or favoring by EPA.  The EPA seal
and logo shall not be used in any manner to imply endorsement of any commercial product or activity by EPA or
the United States Government.
