# Local imports.
from .base import *

__author__ = 'Jason Parent'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
        'TEST_CONFIG': {
            'expiry': 100500,
        }
    }
}
