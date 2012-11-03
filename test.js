var OPEN       = 1,
WINDOW         = OPEN           << 1,
HAS_MENU       = WINDOW         << 1,
IS_FULL_SCREEN = HAS_MENU       << 1,
IS_BROWSER     = IS_FULL_SCREEN << 1;


// console.log(HAS_MENU, WINDOW, OPEN, WINDOW & OPEN)

var needed = OPEN|WINDOW;
console.log((WINDOW|HAS_MENU|IS_BROWSER|OPEN) & needed, needed);

// console.log((WINDOW & HAS_MENU) & (WINDOW | OPEN));