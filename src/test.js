import { JSONPath } from 'jsonpath-plus';

var data = {
    "Info": {
        "title": "iReceptorPlus Statistics API",
        "version": "0.3.0",
        "description": "Statistics API for the iReceptor Plus platform",
        "contact": {
            "name": "NULL",
            "url": "null",
            "email": "null"
        }
    },
    "Result": [
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 1,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 452265,
                    "data": [
                        {
                            "key": "top10",
                            "count": 98797
                        },
                        {
                            "key": "top100",
                            "count": 183251
                        },
                        {
                            "key": "top1000",
                            "count": 353053
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 2,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 1357416,
                    "data": [
                        {
                            "key": "top10",
                            "count": 131929
                        },
                        {
                            "key": "top100",
                            "count": 399548
                        },
                        {
                            "key": "top1000",
                            "count": 909613
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 3,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 8963075,
                    "data": [
                        {
                            "key": "top10",
                            "count": 700548
                        },
                        {
                            "key": "top100",
                            "count": 1132131
                        },
                        {
                            "key": "top1000",
                            "count": 2106341
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 4,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 2658565,
                    "data": [
                        {
                            "key": "top10",
                            "count": 297111
                        },
                        {
                            "key": "top100",
                            "count": 619307
                        },
                        {
                            "key": "top1000",
                            "count": 1060760
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 5,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 1464331,
                    "data": [
                        {
                            "key": "top10",
                            "count": 119977
                        },
                        {
                            "key": "top100",
                            "count": 364421
                        },
                        {
                            "key": "top1000",
                            "count": 864023
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 6,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 1573623,
                    "data": [
                        {
                            "key": "top10",
                            "count": 184476
                        },
                        {
                            "key": "top100",
                            "count": 595247
                        },
                        {
                            "key": "top1000",
                            "count": 1266739
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 7,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 1496777,
                    "data": [
                        {
                            "key": "top10",
                            "count": 116812
                        },
                        {
                            "key": "top100",
                            "count": 337873
                        },
                        {
                            "key": "top1000",
                            "count": 865525
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 8,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 26305505,
                    "data": [
                        {
                            "key": "top10",
                            "count": 207464
                        },
                        {
                            "key": "top100",
                            "count": 607465
                        },
                        {
                            "key": "top1000",
                            "count": 2222221
                        }
                    ]
                }
            ]
        },
        {
            "repertoire": {
                "study": "lp15",
                "repertoire_id": "null",
                "subject_id": 9,
                "sample_processing_id": "null"
            },
            "statistics": [
                {
                    "statistic_name": "clone_size_top",
                    "total": 290415,
                    "data": [
                        {
                            "key": "top10",
                            "count": 5084
                        },
                        {
                            "key": "top100",
                            "count": 33739
                        },
                        {
                            "key": "top1000",
                            "count": 137448
                        }
                    ]
                }
            ]
        }
    ]
}

var keys = JSONPath('$..count', data);
let uniq = [...new Set(keys)];
// console.log(uniq);