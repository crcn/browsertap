not everything here is implemented - just a lot of ideas about how the syntax should
be for the build system

```javascript
{
    "tasks": {
        "debug release": {
            "entry"   : "./src/index.js",
            "include" : "./src",
            "output"  : "./js/index.js",
            "task"    : "make:{{target}}"
        },
        "make:debug": ["combine","catchall"],
        "make:release": ["combine","closure"]
    }
}
```

tasks with namespaces

```javascript
{
    "tasks": {
        "web": {
            "debug release": [
                {
                    "entry"   : "./src/index.js",
                    "include" : "./src",
                    "output"  : "./js/index.js",
                    "task"    : "{{namespace}}:make"
                },
                {
                    "entry"   : "./src/index.js",
                    "include" : "./src",
                    "output"  : "./js/index.js",
                    "task"    : "{{namespace}}:make"
                }
            ],
            "debug:make": ["combine","catchall"],
            "release:make": ["combine","closure"]   
        },
        "iphone": {
            
        },
        "android": {
            
        }
        
    }
}
```