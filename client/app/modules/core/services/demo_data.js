window.demoGraphData = {
    
    "nodes":[
    {
      "id": 1,
      "label": "University General Hospital of Alexandroupolis",
      "group": 1,
      "color": "#F56954"
    },
    {
      "id": 11,
      "label": "University Medical Center Hamburg-Eppendorf",
      "group": 1,
      "color": "#F56954"
    },
    {
      "id": 2,
      "label": "Acute kidney injury (Guideline)",
      "group": 2,
      "color": "#F39C12"
    },
    {
      "id": 22,
      "label": "Acute kidney injury (Protocol)",
      "group": 2,
      "color": "#F39C12"
    },
    {
      "id": 222,
      "label": "Acute kidney injury (Guideline) - Greek",
      "group": 2,
      "color": "#F39C12"
    },
    {
      "id": 2222,
      "label": "Acute coronary syndrome",
      "group": 2,
      "color": "#F39C12"
    },
    {
      "id": 3,
      "label": "Hellenic Society of Nephrology",
      "group": 3,
      "color": "#3C8DBC"
    },
    {
      "id": 33,
      "label": "NICE",
      "group": 3,
      "color": "#3C8DBC"
    },
    {
      "id": 333,
      "label": "European Renal Association",
      "group": 3,
      "color": "#3C8DBC"
    }
  ],
    
    "edges":[
    {
      "from": 333,
      "to": 2,
      "label": "issues",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 333,
      "to": 22,
      "label": "issues",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 3,
      "to": 222,
      "label": "issues",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 33,
      "to": 2222,
      "label": "issues",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 2,
      "to": 222,
      "label": "translated to",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 2,
      "to": 22,
      "label": "deviated to",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 1,
      "to": 222,
      "label": "uses",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 11,
      "to": 2222,
      "label": "uses",
      "font": {
        "align": "middle"
      },
      "dashes": false
    },
    {
      "from": 11,
      "to": 22,
      "label": "uses",
      "font": {
        "align": "middle"
      },
      "dashes": false
    }
  ]
    
}