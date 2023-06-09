#https://github.com/plotly/dash-network

import itertools

import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
from dash.exceptions import PreventUpdate

from dash_network import Network

app = dash.Dash(__name__,
                external_scripts=['https://code.jquery.com/jquery-3.4.1.min.js',
                                  'https://code.jquery.com/ui/1.12.1/jquery-ui.js',
                                  'https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/js/jquery.tooltipster.js',
                                  'https://d3js.org/d3.v4.min.js',
                                  ],
                external_stylesheets=['https://codepen.io/chriddyp/pen/bWLwgP.css',
                                      'https://cdnjs.cloudflare.com/ajax/libs/tooltipster/3.3.0/css/tooltipster.min.css',
                                      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap',],
                #assets_external_path='https://www.asc.ohio-state.edu/dance/dunhams-data/inrepnet/assets/',
               )

server = app.server

app.scripts.config.serve_locally = False
app.css.config.serve_locally = False

app.title = 'Interactive Network of Dunham Company Repertory: Shows, Containers, Pieces, and Dances-in-Dances'

# MY CODE
# Imports
import networkx as nx
import os

THIS_PATH = os.path.dirname(os.path.abspath(__file__))

# Color schemes

standalone = '#a0a0a0' #'#cecece'

show_color_A = '#ff00ff'
container_color_A = '#ff4533'
mix_color_A = '#bd7aff'
piece_color_A = '#5c89ff'
dance_color_A = '#00b7da'
standalone_color_A = standalone

show_color_B = '#ff0066'
container_color_B = '#cc268c'
mix_color_B = '#994db3'
piece_color_B = '#6673d9'
dance_color_B = '#3399ff'
standalone_color_B = standalone

show_color_C = '#ff3333'
container_color_C = '#ff33cc'
mix_color_C = '#bb33ff'
piece_color_C = '#3399ff'
dance_color_C = '#33ffff'
standalone_color_C = standalone

show_color_D = '#ff9933'
container_color_D = '#ff3333'
mix_color_D = '#bb33ff'
piece_color_D = '#3399ff'
dance_color_D = '#33ffff'
standalone_color_D = standalone

show_color_X = '#ff0000'
container_color_X = '#ff00bf'
mix_color_X = '#8000ff'
piece_color_X = '#0040ff'
dance_color_X = '#00ffff'
standalone_color_X = standalone

node_colors_dct = {
    'A': {
        'Dance': dance_color_A,
        'Piece': piece_color_A,
        'Container': container_color_A,
        'Mix': mix_color_A,
        'Show': show_color_A,
    },
    'B': {
        'Dance': dance_color_B,
        'Piece': piece_color_B,
        'Container': container_color_B,
        'Mix': mix_color_B,
        'Show': show_color_B,
    },
    'C': {
        'Dance': dance_color_C,
        'Piece': piece_color_C,
        'Container': container_color_C,
        'Mix': mix_color_C,
        'Show': show_color_C,
    },
    'D': {
        'Dance': dance_color_D,
        'Piece': piece_color_D,
        'Container': container_color_D,
        'Mix': mix_color_D,
        'Show': show_color_D,
    },
}
edge_colors_dct = {
    'A': {
        'Dance': dance_color_A,
        'Piece': piece_color_A,
        'Standalone': standalone_color_A,
        'Mix': mix_color_A,
        'Container': container_color_A,
    },
    'B': {
        'Dance': dance_color_B,
        'Piece': piece_color_B,
        'Standalone': standalone_color_B,
        'Mix': mix_color_B,
        'Container': container_color_B,
    },
    'C': {
        'Dance': dance_color_C,
        'Piece': piece_color_C,
        'Standalone': standalone_color_C,
        'Mix': mix_color_C,
        'Container': container_color_C,
    },
    'D': {
        'Dance': dance_color_D,
        'Piece': piece_color_D,
        'Standalone': standalone_color_D,
        'Mix': mix_color_D,
        'Container': container_color_D,
    },
}

# Set up parameters
TOTAL_WIDTH_DIV = 2200 # 1800
TOTAL_HEIGHT_DIV = 1600 # 1400
MARGINTOP_DIV_INT = 0
MARGINLEFT_DIV_INT = 260 # space for legend
WIDTH_DIV = TOTAL_WIDTH_DIV - MARGINLEFT_DIV_INT
HEIGHT_DIV = TOTAL_HEIGHT_DIV
MARGINTOP_DIV = str(MARGINTOP_DIV_INT) + 'px'
MARGINLEFT_DIV = str(MARGINLEFT_DIV_INT) + 'px'

# Functionality
def all_neighbors(g, n):
    r = {n}
    for a, b in g.edges():
        if a == n:
            r.add(b)
        elif b == n:
            r.add(a)
    return '---'.join(r)

def net_data(populate=True, scheme='D', short_network='No'):
    data_file = 'repertory.gexf' if short_network == 'No' \
                else 'repertory.gexf'
    data_path = os.path.join(THIS_PATH, data_file)
    g = nx.read_gexf(data_path)
    nodes = [{
            'id': n,
            'radius': (data['size']+100)**2,
            'color': node_colors_dct[scheme][data['type']],
            'aka': data['aka'] if 'aka' in data else '',
            'premiere': data['premiere'] if 'premiere' in data else '',
            'allneighbors': all_neighbors(g, n),
        }
        for n, data in g.nodes(data=True)
    ] if populate else []
    links = [{
            'source': a,
            'target': b,
            'myedgecolor': edge_colors_dct[scheme][data['style']],
            'myweight': data['weight'],
        }
        for a, b, data in g.edges(data=True)
    ] if populate else []
    return {
        'nodes': nodes,
        'links': links
    }

netdata0 = net_data(False)
netdata1 = net_data(True)

nodeShowText = 'Named Evening-length Show'
nodeContainerText = 'Container (normally a grouping of 2+ variable pieces under a shared title; also includes act-length dances with named components)'
nodeMixText = 'Piece or Container, at different times'
nodePieceText = 'Piece'
nodeDanceText = 'Named Dances inside of other Dances'
arrowDanceText = 'Source is a Dance part of the target Piece'
arrowPieceText = 'Source is always part of other containers'
arrowMixText = 'Source is always part of other containers'
arrowStandaloneText = 'Source is sometimes part of other containers, but may also be a standalone work'

elemCount = itertools.count()
baseMargin = 530
elemMarginTop = "str(" + str(baseMargin) + " + 70*next(elemCount)) + 'px'"
dfltSchm = 'schemeD'

def create_layout():
    return html.Div([
    html.Div([
        html.Div(
            'Interactive Network of Dunham Company Repertory: Shows, Containers, Pieces, and Dances-in-Dances',
            className='title',
        ),
        html.Div([
            html.Span('Antonio Jimenez Mavillard created this network diagram to visualize a dataset manually curated by Harmony Bench, Kate Elswit, and Tia-Monique Uzor for '),
            html.I('Dunham’s Data: Katherine Dunham and Digital Methods for Dance Historical Inquiry'),
            html.Span(' (AHRC grant AH/R012989/1). '),
            html.I('Dunham’s Data'),
            html.Span(' explores the kinds of questions and problems that make the analysis and visualization of data meaningful for dance history, through the exemplary case study of African American artist, teacher, and activist Katherine Dunham. Over her career, Dunham actively repurposed and recombined elements of her choreography. Through an analysis of how Dunham framed her work for mid-century audiences in the form of programs and show patter, among other archival sources, Dunham’s Data has organized these elements into a nested hierarchy of what we describe as shows, containers, pieces, and dances-in-dances. This visualization makes it possible to interactively examine the many interconnections among Dunham’s repertory from 1937-1962, troubling the choreographic ‘work’ as a static category. For more on this dataset and analysis, see '),
            html.A('“Visceral Data for Dance Histories: Katherine Dunham’s People, Places, and Pieces”', target="_blank", href="https://doi.org/10.1017/S1054204321000708"),
            html.Span(' in '),
            html.I('The Drama Review (TDR)'),
            html.Span('.'),
        ], className='description'),
    ], id='info'),
    html.Div(id='scroll-to-here', style={'marginBottom': 20, 'marginTop': -10}),
    html.Div(
        [
            #html.Div('Node and arrow colors:', className='legend-title'),
            html.Div(
                [
                    html.Ul(
                        [
                            html.Li(
                                [html.Span(className='node show ' + dfltSchm), nodeShowText],
                                className='nd',
                            ),
                            html.Li(
                                [html.Span(className='node cont ' + dfltSchm), nodeContainerText],
                                className='nd',
                            ),
                            html.Li(
                                [html.Span(className='node mix ' + dfltSchm), nodeMixText],
                                className='nd',
                            ),
                            html.Li(
                                [html.Span(className='node piece ' + dfltSchm), nodePieceText],
                                className='nd',
                            ),
                            html.Li(
                                [html.Span(className='node dance ' + dfltSchm), nodeDanceText],
                                className='nd',
                            ),
                            html.Li(
                                [html.Span(className='arrow mix ' + dfltSchm), arrowMixText],
                                className='rw first',
                            ),
                            html.Li(
                                [html.Span(className='arrow piece ' + dfltSchm), arrowPieceText],
                                className='rw',
                            ),
                            html.Li(
                                [html.Span(className='arrow dance ' + dfltSchm), arrowDanceText],
                                className='rw',
                            ),
                            html.Li(
                                [html.Span(className='arrow standalone ' + dfltSchm), arrowStandaloneText],
                                className='rw last',
                            ),
                        ],
                        className='legend-labels'
                    )
                ],
                className='legend-scale'
            ),
        ],
#        '',
        id='legend', className='my-legend', style={'zIndex': 2, 'position': 'absolute', 'width': '270px'}
    ),
    html.Div([
        html.A('', id='reload', className='control-elem'),
        html.A('', id='play', className='control-elem disabled'),
        html.A('', id='pause', className='control-elem disabled'),
    ], className='control', style={'zIndex': 2}),
    html.Div([
        html.Div([
            html.Div('Instructions', className='item title'),
            html.Div(['Hover over a repertory node to highlight all of its connections. The connections can be viewed ', html.A('by all entities directly connected', id='link-neighbors', className='link-connections selected'), ' or ', html.A('by all entities within the nested hierarchy', id='link-hierarchy', className='link-connections'), '.'], className='item'),
            html.Div('Right click on a node to show alternate names.', className='item'),
            html.Div('Click on a repertory node and drag to reposition. Click on it again to release.', className='item'),
            html.Div('Use the search field to find repertory. Click on a name to center and highlight the node and its connections. Click anywhere to deselect.', className='item'),
        ], className='content'),
        html.Div([
            '',
            dcc.Input(id='searchInput', value='', placeholder='Loading...', style={'width': 266}),
        ], id='searchBar', style={'zIndex': 2, 'position': 'absolute', 'marginTop': 0}),
    ], id='sidebar', style={'zIndex': 2, 'position': 'absolute', 'marginTop': '256px'}),
    html.Div([
        'Only 1947-60 (input Yes or No):',
        html.Br(),
        dcc.Input(id='fulldata', value='No'),
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'display': 'none'},
       className='optional'),
    html.Div([
        'Freeze nodes (input Yes or No):',
        html.Br(),
        dcc.Input(id='frozen', value='Yes'),
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'display': 'none'},
       className='optional'),
    html.Div([
        'Color scheme (input C or D):',
        html.Br(),
        dcc.Input(id='scheme', value='D'),
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'display': 'none'},
       className='optional'),
    html.Div([
        'Delay (0, 500, 1000, 1500...):',
        html.Br(),
        dcc.Input(id='delay', value=0),
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'display': 'none'},
       className='optional'),
    html.Div([
        'Selected node opacity (0-1):',
        html.Br(),
        dcc.Input(id='L2opac', value=1),
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'display': 'none'},
       className='optional'),
    html.Div([
        'Non-selected node opacity (0-1):',
        html.Br(),
        dcc.Input(id='L2plusopac', value=0.05),
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'display': 'none'},
       className='optional'),
    html.Div([
        'Fade labels? (input Yes or No)',
        html.Br(),
        dcc.Input(id='fadeLabels', value='Yes'),
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'display': 'none'},
       className='optional'),
    html.Div([
        'Depth',
        dcc.Dropdown(
            id='depth',
            options=[
                {'label': '0 - no neighbors', 'value': 0},
                {'label': '1 - direct neighbors only', 'value': 1},
                {'label': '2 - neighbors of neighbors', 'value': 2},
                {'label': '3', 'value': 3},
                {'label': '4', 'value': 4},
                {'label': '5', 'value': 5},
                {'label': '6', 'value': 6},
                {'label': '7', 'value': 7},
                {'label': '8', 'value': 8},
                {'label': '9', 'value': 9},
                {'label': '10 - max. depth', 'value': 10},
            ],
            value=1,
        )
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': eval(elemMarginTop), 'width': '234px', 'display': 'none'},
       className='optional'),
    html.Div([
        '',
        dcc.Checklist(
            id='nh',
            options=[
                {'label': 'Neighbors (off) / Hierarchy (on)', 'value': 'NH'},
            ],
            value=[],
            style={},
        )
    ], style={'zIndex': 3, 'position': 'absolute', 'marginTop': 40, 'marginLeft': 320, 'display': 'none'},
       className=''),
    html.Div(
        Network(
            id='net1',
            data=netdata1,
            width=WIDTH_DIV, # some space taken for legend
            height=HEIGHT_DIV,
            maxRadius=25,
        ),
        id='div1',
        className='net-content',
        style={'marginTop': MARGINTOP_DIV, 'display': 'block', 'marginLeft': MARGINLEFT_DIV},
        **{'data-frozen': True},
    ),
#    html.Div(
#        Network(
#            id='net2',
#            data=net_data(False),
#            width=WIDTH_DIV, # some space taken for legend
#            height=HEIGHT_DIV,
#            maxRadius=25,
#        ),
#        id='div2',
#        className='net-content',
#        style={'marginTop': MARGINTOP_DIV, 'display': 'block', 'marginLeft': MARGINLEFT_DIV},
#        **{'data-frozen': True},
#    ),
    #html.Div(id='output'),
    #html.Div(**{'id': 'updating', 'data-firstexec': True, 'data-switch': 0}),
    html.Div([
        dcc.Input(id='controlAction', value='Nothing', style={'display': 'none'}),
        dcc.Input(id='isReload', value='No', style={'display': 'none'}),
    ], id='controls')
], id='layout')

app.layout = create_layout()

@app.callback(Output('layout', 'children'),
              [Input('reload', 'n_clicks')],
             )
def update_data(n_clicks):
    global elemCount
    elemCount = itertools.count()
    if n_clicks is None or not n_clicks:
        raise PreventUpdate()
    new_layout = create_layout()
    new_layout.children[-1].children[-1].value = 'Yes'
    return new_layout

#@app.callback([Output('net1', 'data'),
##               Output('net2', 'data'), Output('div2', 'style'),
#               #Output('updating', 'data-switch')
#              ],
#              [Input('reload', 'n_clicks')],
#              #[State('updating', 'data-switch')],
#              [
#                State('scheme', 'value'),
#                State('fulldata', 'value'),
#              ],
#             )
#def update_data(n_clicks, value1, value2):
#    if n_clicks is None or n_clicks % 2 == 0:
#        return [netdata1]
#    else:
#        return [netdata0]

if __name__ == '__main__':
    app.run_server(debug=True, port=8051)
