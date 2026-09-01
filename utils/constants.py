# utils/constants.py
from enum import Enum

class TERMINAL(Enum):
    TRUECOLOR = 24
    _256COLOR = 256
    BASICCOLORS = 16
    TTY = -11
    VIRTUALTERMINALPROCESSING = 0x0004
    PADDING = 8