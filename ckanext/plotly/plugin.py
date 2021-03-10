import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit


from six.moves.urllib.parse import urlencode

from ckan.common import json

class PlotlyPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IResourceView)
    plugins.implements(plugins.IValidators)

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('public', 'ckanext-plotly')


    # IResourceView

    def can_view(self, data_dict):
        resource = data_dict['resource']
        return resource.get(u'datastore_active')

    def view_template(self, context, data_dict):
        return u'plotly/plotly_view.html'

    def form_template(self, context, data_dict):
        return u'plotly/plotly_form.html'

    def info(self):
        return {
            u'name': u'plotly_view',
            u'title': u'Chart',
            u'icon': u'bar-chart-o',
            u'requires_datastore': True,
            u'preview_enabled': False,
            u'full_page_edit': False,
            u'default_title': toolkit._(u'Chart'),
            u'schema': {'plotly_config': [toolkit.get_validator('ignore_missing'), toolkit.get_validator('valid_plotly_json')]}
        }

    def setup_template_variables(self, context, data_dict):

        resource = data_dict['resource']
        all_fields = _get_fields_without_id(resource)
        fields = []

        plotly_json = data_dict['resource_view'].get('plotly_config')

        full_data_url = toolkit.h.url_for('datastore.dump', resource_id=resource['id'])

        if not plotly_json:
            return {'plotly_json': plotly_json, 'full_data_url': full_data_url}

        plotly_config = json.loads(plotly_json)

        for t in plotly_config.get('traces',[]):
            for k in t.keys():
                if k.endswith('src') and t[k] not in fields:
                    fields.append(t[k])

        data_url = full_data_url + u'?' + urlencode({u'fields': u','.join(fields)})

        return {'plotly_json': plotly_json, 'plot_fields': fields, 'data_url': data_url, 'full_data_url':full_data_url}

    def get_validators(self):
        return { u'valid_plotly_json': valid_plotly }

def valid_plotly(value):
# validator for plotly configuration, won't cover everything, but hits the high point...

    try:
        config = json.loads( value)

    except json.JSONDecodeError  as e:
        raise toolkit.Invalid(u'Invalid JSON string near line %d column %d, %s' % (e.lineno, e.colno, e.msg))

    if not isinstance( config, dict):
        raise toolkit.Invalid(u'Incorrect plot configuration, expected object containing "traces", "layout" and/or "frames"')

    if 'traces' in config:

        if not isinstance(config['traces'],list):
            raise toolkit.Invalid(u'Incorrect traces configuration, expecting list of objects')

        for t in config['traces']:
            if not isinstance(t, dict):
                raise toolkit.Invalid(u'Incorrect traces configuration, expecting list of objects')


    if 'layout' in config and not isinstance(config['layout'], dict):
        raise toolkit.Invalid(u'Incorrect layout configuration, object of plot axes')

    return value


class PlotlyExplorerPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.IResourceView)


    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('public', 'ckanext-plotly')


    # IResourceView

    def can_view(self, data_dict):
        resource = data_dict['resource']
        return resource.get(u'datastore_active')

    def view_template(self, context, data_dict):
        return u'plotly/plotly_explorer.html'

    def form_template(self, context, data_dict):
        return u'plotly/plotly_explorer_form.html'

    def info(self):
        return {
            u'name': u'plotly_explorer',
            u'title': u'Chart Explorer',
            u'icon': u'bar-chart-o',
            u'requires_datastore': True,
            u'preview_enabled': False,
            u'full_page_edit': False,
            u'default_title': toolkit._(u'Chart Explorer'),
            u'schema': {}
        }

    def setup_template_variables(self, context, data_dict):

        resource = data_dict['resource']

        full_data_url = toolkit.h.url_for('datastore.dump', resource_id=resource['id'])


        return {'full_data_url': full_data_url}


def _get_fields_without_id(resource):
    fields = _get_fields(resource)
    return [{'value': v['id']} for v in fields if v['id'] != '_id']


def _get_fields(resource):
    data = {
        'resource_id': resource['id'],
        'limit': 0
    }
    result = toolkit.get_action('datastore_search')({}, data)
    return result['fields']